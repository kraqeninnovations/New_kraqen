import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getContactContent, getSiteContent } from '@/lib/content';

// Basic in-memory rate limiter (5 requests per 10 mins per IP)
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

    const [contact, site] = await Promise.all([getContactContent(), getSiteContent()]);
    const body = await request.json();

    // 1. Honeypot check
    if (body._hp && body._hp.length > 0) {
      return NextResponse.json({ success: true, message: 'Message sent successfully' });
    }

    // 2. Build dynamic Zod validator based on contact.json field config
    const schemaShape: Record<string, z.ZodTypeAny> = {
      _hp: z.string().optional(),
    };

    if (contact.fields.name.enabled) {
      schemaShape.name = contact.fields.name.required
        ? z.string().trim().min(1, contact.validation.nameRequired)
        : z.string().trim().optional();
    }

    if (contact.fields.email.enabled) {
      schemaShape.email = contact.fields.email.required
        ? z.string().trim().email(contact.validation.emailInvalid)
        : z.string().trim().optional();
    }

    if (contact.fields.phone.enabled) {
      schemaShape.phone = contact.fields.phone.required
        ? z.string().trim().min(1, 'Phone is required')
        : z.string().trim().optional();
    }

    if (contact.fields.company.enabled) {
      schemaShape.company = contact.fields.company.required
        ? z.string().trim().min(1, 'Company is required')
        : z.string().trim().optional();
    }

    if (contact.fields.projectTypes.enabled) {
      schemaShape.projectTypes = contact.fields.projectTypes.required
        ? z.array(z.string()).min(1, contact.validation.projectTypeRequired)
        : z.array(z.string()).optional();
    }

    if (contact.fields.budget.enabled) {
      schemaShape.budget = contact.fields.budget.required
        ? z.string().trim().min(1, contact.validation.budgetRequired)
        : z.string().trim().optional();
    }

    if (contact.fields.timing.enabled) {
      schemaShape.timing = contact.fields.timing.required
        ? z.string().trim().min(1, contact.validation.timingRequired)
        : z.string().trim().optional();
    }

    if (contact.fields.message.enabled) {
      schemaShape.message = contact.fields.message.required
        ? z.string().trim().min(10, contact.validation.messageMinLength || contact.validation.messageRequired)
        : z.string().trim().optional();
    }

    const dynamicSchema = z.object(schemaShape);
    const result = dynamicSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, company, projectTypes, budget, timing, message } = result.data as Record<string, any>;
    const recipient = process.env.CONTACT_TO_EMAIL || site.brand.email;

    // 3. Email dispatch attempt
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${site.brand.name} Enquiries <enquiries@kraqeninc.com>`,
            to: [recipient],
            reply_to: email,
            subject: `New Project Enquiry: ${name || 'Prospective Client'} (${company || 'Individual'})`,
            html: `
              <h2>New Project Enquiry</h2>
              <p><strong>Name:</strong> ${name || 'N/A'}</p>
              <p><strong>Email:</strong> ${email || 'N/A'}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Company:</strong> ${company || 'N/A'}</p>
              <p><strong>Project Types:</strong> ${Array.isArray(projectTypes) ? projectTypes.join(', ') : 'N/A'}</p>
              <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
              <p><strong>Timing:</strong> ${timing || 'N/A'}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message || 'N/A'}</p>
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
      console.log('--- [CONTACT FORM ENQUIRY RECEIVED] ---');
      console.log({
        to: recipient,
        from: email,
        name,
        company,
        phone,
        projectTypes,
        budget,
        timing,
        message,
        timestamp: new Date().toISOString(),
      });
      console.log('---------------------------------------');
    }

    return NextResponse.json({
      success: true,
      message: contact.success.message,
    });
  } catch (err: unknown) {
    console.error('Unexpected error in contact API:', err);
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}
