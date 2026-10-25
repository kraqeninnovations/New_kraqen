import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSiteContent } from '@/lib/content';

// Rate limiter (5 requests per 10 mins per IP)
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const ipRequests = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (!record || now > record.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const site = await getSiteContent();
    const body = await request.json();

    // 1. Honeypot check
    if (body._hp && body._hp.length > 0) {
      return NextResponse.json({ success: true, message: site.forms.success.text });
    }

    // 2. Determine fieldSet (default: inquiry)
    const fieldSetName = body.fieldSet === 'contact' ? 'contact' : 'inquiry';
    const fields = site.forms.fieldSets[fieldSetName] || site.forms.fieldSets.inquiry || [];

    // 3. Build dynamic validator
    const shape: Record<string, z.ZodTypeAny> = {
      _hp: z.string().optional(),
      fieldSet: z.string().optional(),
      source: z.string().optional(),
      phoneCountry: z.string().optional(),
      dialCode: z.string().optional(),
      phoneE164: z.string().optional(),
    };

    fields.forEach((f) => {
      if (f.id === 'email') {
        shape.email = f.required
          ? z.string().trim().min(1, site.forms.validation.required).email(site.forms.validation.email)
          : z.string().trim().email(site.forms.validation.email).optional().or(z.literal(''));
      } else if (f.id === 'phone') {
        shape.phone = f.required
          ? z.string().trim().min(5, site.forms.validation.phone)
          : z.string().trim().optional().or(z.literal(''));
      } else if (f.id === 'service') {
        shape.service = f.required
          ? z.string().trim().min(1, site.forms.validation.required)
          : z.string().trim().optional().or(z.literal(''));
      } else {
        shape[f.id] = f.required
          ? z.string().trim().min(1, site.forms.validation.required)
          : z.string().trim().optional().or(z.literal(''));
      }
    });

    const schema = z.object(shape);
    const result = schema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0]?.toString();
        if (fieldName) {
          fieldErrors[fieldName] = err.message;
        }
      });
      return NextResponse.json(
        { error: site.forms.error, fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data as Record<string, any>;
    const recipient = process.env.CONTACT_TO_EMAIL || site.brand.email;

    // 4. Send email if Resend is configured, otherwise log
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${site.brand.name} <enquiries@kraqeninc.com>`,
            to: [recipient],
            reply_to: data.email,
            subject: `[${data.source?.toUpperCase() || 'WEBSITE'}] New Enquiry from ${data.name || 'Client'} (${data.service || 'General'})`,
            html: `
              <h2>New Project Enquiry</h2>
              <p><strong>Source:</strong> ${data.source || 'website'}</p>
              <p><strong>Name:</strong> ${data.name || 'N/A'}</p>
              <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
              <p><strong>Phone:</strong> ${data.phone || 'N/A'} (Country: ${data.phoneCountry || 'IN'}, Code: ${data.dialCode || '+91'}, E.164: ${data.phoneE164 || 'N/A'})</p>
              ${data.brand ? `<p><strong>Brand / Website:</strong> ${data.brand}</p>` : ''}
              <p><strong>Service Needed:</strong> ${data.service || 'N/A'}</p>
            `,
          }),
        });
        if (!resendRes.ok) {
          console.warn('Resend API response not ok:', await resendRes.text());
        }
      } catch (err) {
        console.error('Error dispatching via Resend:', err);
      }
    } else {
      console.log('--- [ENQUIRY RECEIVED] ---');
      console.log({
        recipient,
        ...data,
        timestamp: new Date().toISOString(),
      });
      console.log('--------------------------');
    }

    return NextResponse.json({
      success: true,
      title: site.forms.success.title,
      message: site.forms.success.text,
    });
  } catch (err: unknown) {
    console.error('Unexpected error in contact API:', err);
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}
