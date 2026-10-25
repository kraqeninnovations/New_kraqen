import { NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/content';
import { getBookingsForDate } from '@/lib/storage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json({ error: 'Valid date query param (YYYY-MM-DD) is required' }, { status: 400 });
    }

    const site = await getSiteContent();
    const bookingConfig = site.booking || {
      businessTimezone: 'Asia/Kolkata',
      availability: {
        days: [1, 2, 3, 4, 5, 6],
        start: '10:00',
        end: '18:00',
        slotMinutes: 30,
        breaks: [{ start: '13:00', end: '14:00' }],
        minNoticeHours: 12,
        maxDaysAhead: 60,
      },
    };

    const availability = bookingConfig.availability;
    const [year, month, day] = dateStr.split('-').map(Number);
    const targetDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

    // Day of week: 0 = Sun, 1 = Mon, ..., 6 = Sat
    const dayOfWeek = targetDate.getUTCDay();
    if (!availability.days.includes(dayOfWeek)) {
      return NextResponse.json({ slots: [] });
    }

    // Check bounds against today
    const now = new Date();
    // Use India Standard Time reference date
    const todayStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: bookingConfig.businessTimezone || 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);

    if (dateStr < todayStr) {
      return NextResponse.json({ slots: [] });
    }

    // Check maxDaysAhead
    const diffTime = targetDate.getTime() - new Date(todayStr).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > availability.maxDaysAhead) {
      return NextResponse.json({ slots: [] });
    }

    // Generate slots in business time (e.g., 10:00 to 18:00 with slotMinutes)
    const [startH, startM] = availability.start.split(':').map(Number);
    const [endH, endM] = availability.end.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const step = availability.slotMinutes || 30;

    const breaks = (availability.breaks || []).map((b) => {
      const [bStartH, bStartM] = b.start.split(':').map(Number);
      const [bEndH, bEndM] = b.end.split(':').map(Number);
      return { start: bStartH * 60 + bStartM, end: bEndH * 60 + bEndM };
    });

    // Existing bookings
    const existingBookings = await getBookingsForDate(dateStr);
    const bookedTimes = new Set(existingBookings.map((b) => b.time));

    const candidateSlots: string[] = [];

    for (let m = startMinutes; m < endMinutes; m += step) {
      // Check break
      const inBreak = breaks.some((b) => m >= b.start && m < b.end);
      if (inBreak) continue;

      const hh = String(Math.floor(m / 60)).padStart(2, '0');
      const mm = String(m % 60).padStart(2, '0');
      const timeStr = `${hh}:${mm}`;

      // Check if slot already booked
      if (bookedTimes.has(timeStr)) continue;

      // If booking is today, check minNoticeHours
      if (dateStr === todayStr) {
        // Compute slot date in business timezone
        const slotDateTime = new Date(`${dateStr}T${timeStr}:00+05:30`);
        const hoursNotice = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursNotice < availability.minNoticeHours) {
          continue;
        }
      }

      candidateSlots.push(timeStr);
    }

    return NextResponse.json({ slots: candidateSlots });
  } catch (err: unknown) {
    console.error('Error in /api/booking/slots:', err);
    return NextResponse.json({ error: 'Failed to retrieve booking slots' }, { status: 500 });
  }
}
