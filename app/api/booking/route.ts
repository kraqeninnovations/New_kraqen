import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSiteContent } from '@/lib/content';
import { saveBookingRecord, getBookingsForDate } from '@/lib/storage';

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

const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid date YYYY-MM-DD required'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Valid time HH:MM required'),
  timezone: z.string().min(1, 'Timezone is required'),
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().min(5, 'Contact number is required'),
  phoneCountry: z.string().optional().default('IN'),
  notes: z.string().optional().default(''),
  _hp: z.string().optional(),
});

function generateIcs(summary: string, description: string, startIso: string, durationMinutes: number) {
  const start = new Date(startIso);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const formatUtc = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kraqen Innovations//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:kraqen-${Date.now()}@kraqeninc.com`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
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

    // 1. Honeypot Check
    if (body._hp && body._hp.length > 0) {
      return NextResponse.json({ success: true });
    }

    // 2. Validate input
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const field = err.path[0]?.toString();
        if (field) fieldErrors[field] = err.message;
      });
      return NextResponse.json({ error: 'Please check your inputs.', fieldErrors }, { status: 400 });
    }

    const data = parsed.data;
    const bookingConfig = site.booking || {
      title: '30 Minute Meeting',
      durationMinutes: 30,
      businessTimezone: 'Asia/Kolkata',
      labels: {
        error: 'We could not book this time. Please pick another slot or email us.',
      },
    };

    // 3. Re-verify slot is free
    const existing = await getBookingsForDate(data.date);
    if (existing.some((b) => b.time === data.time)) {
      const errorMsg =
        bookingConfig.labels?.error ||
        'We could not book this time. Please pick another slot or email us.';
      return NextResponse.json({ error: errorMsg, code: 'SLOT_TAKEN' }, { status: 409 });
    }

    // 4. Save booking record
    const saveResult = await saveBookingRecord({
      date: data.date,
      time: data.time,
      timezone: data.timezone,
      name: data.name,
      email: data.email,
      phone: data.phone,
      phoneCountry: data.phoneCountry,
      notes: data.notes,
    });

    if (!saveResult.success) {
      return NextResponse.json(
        { error: bookingConfig.labels?.error || 'Could not save booking' },
        { status: 409 }
      );
    }

    // 5. Send notification email and confirmation email
    const recipient = process.env.CONTACT_TO_EMAIL || site.brand.email;
    const meetingTitle = `${bookingConfig.title || '30 Minute Meeting'} with ${data.name}`;
    const startIso = `${data.date}T${data.time}:00+05:30`;
    const icsContent = generateIcs(
      meetingTitle,
      `Discovery session with ${data.name} (${data.email}). Web conferencing details provided upon confirmation.`,
      startIso,
      bookingConfig.durationMinutes || 30
    );

    if (process.env.RESEND_API_KEY) {
      try {
        // Email to agency owner
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${site.brand.name} <enquiries@kraqeninc.com>`,
            to: [recipient],
            reply_to: data.email,
            subject: `[BOOKING CONFIRMED] ${data.name} - ${data.date} at ${data.time} IST`,
            html: `
              <h2>New Booking Scheduled</h2>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Phone:</strong> ${data.phone} (${data.phoneCountry || 'IN'})</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time} (${bookingConfig.businessTimezone || 'Asia/Kolkata'})</p>
              <p><strong>Visitor Timezone:</strong> ${data.timezone}</p>
              ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
            `,
          }),
        });

        // Email to visitor
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${site.brand.name} <enquiries@kraqeninc.com>`,
            to: [data.email],
            subject: `Confirmed: ${bookingConfig.title} with Kraqen Innovations`,
            html: `
              <h2>You Are Scheduled!</h2>
              <p>Hi ${data.name},</p>
              <p>Your 30-minute discovery session with Kraqen Innovations has been confirmed for <strong>${data.date} at ${data.time} IST</strong>.</p>
              <p>Web conferencing details (Google Meet) will follow shortly before our session.</p>
              <p>Looking forward to connecting!</p>
              <p><strong>Kraqen Innovations Team</strong><br/>${site.brand.url}</p>
            `,
          }),
        });
      } catch (emailErr) {
        console.error('Error dispatching booking emails via Resend:', emailErr);
      }
    } else {
      console.log('--- [BOOKING RECORDED] ---');
      console.log({
        date: data.date,
        time: data.time,
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: data.notes,
      });
      console.log('--------------------------');
    }

    return NextResponse.json({
      success: true,
      booking: saveResult.booking,
      icsContent,
    });
  } catch (err: unknown) {
    console.error('Error in /api/booking:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while booking. Please try again.' },
      { status: 500 }
    );
  }
}

