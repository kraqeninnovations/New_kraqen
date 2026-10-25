'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import PhoneInput from '@/components/PhoneInput';
import Button from '@/components/Button';
import type { BookingContent } from '@/lib/schemas/site';

interface BookingCardProps {
  data?: BookingContent;
}

export default function BookingCard({ data }: BookingCardProps) {
  const config = useMemo(() => {
    return (
      data || {
        provider: 'builtin',
        calendlyUrl: '',
        host: 'Kraqen Innovations',
        title: '30 Minute Meeting',
        durationMinutes: 30,
        durationLabel: '30 min',
        conferencingNote: 'Web conferencing details provided upon confirmation.',
        selectLabel: 'Select a Date & Time',
        timezoneLabel: 'Time zone',
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
        labels: {
          back: 'BACK',
          next: 'NEXT',
          noSlots: 'No times available on this day.',
          enterDetails: 'Enter Details',
          schedule: 'SCHEDULE EVENT',
          confirmedTitle: 'YOU ARE SCHEDULED',
          confirmedText:
            'A confirmation was sent to your email. Web conferencing details will follow after confirmation.',
          name: 'NAME',
          email: 'EMAIL',
          phone: 'CONTACT NUMBER',
          notes: 'ANYTHING ELSE WE SHOULD KNOW?',
          error: 'We could not book this time. Please pick another slot or email us.',
        },
      }
    );
  }, [data]);

  // Current client date & time
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedTimezone, setSelectedTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
    } catch {
      return 'Asia/Kolkata';
    }
  });

  // Month navigation (starts on current month)
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth()); // 0-indexed

  // Step state: 1 = date/time, 2 = details, 3 = confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form inputs
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPhoneCountry, setFormPhoneCountry] = useState('IN');
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [createdBooking, setCreatedBooking] = useState<{ id: string; icsContent?: string } | null>(null);

  // Live clock updating every 30s
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('');
  const [timezoneLongName, setTimezoneLongName] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: selectedTimezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
          .format(now)
          .toLowerCase()
          .replace(/\s+/g, '');

        const tzName = new Intl.DateTimeFormat('en-US', {
          timeZone: selectedTimezone,
          timeZoneName: 'long',
        })
          .formatToParts(now)
          .find((p) => p.type === 'timeZoneName')?.value || selectedTimezone;

        setCurrentTimeFormatted(`(${timeStr})`);
        setTimezoneLongName(tzName);
      } catch {
        setCurrentTimeFormatted('');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [selectedTimezone]);

  // Month boundary calculations
  const todayYear = currentDate.getFullYear();
  const todayMonth = currentDate.getMonth();
  const isCurrentMonthView = viewYear === todayYear && viewMonth === todayMonth;

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + (config.availability?.maxDaysAhead || 60));
  const isMaxMonthView =
    viewYear > maxDate.getFullYear() ||
    (viewYear === maxDate.getFullYear() && viewMonth >= maxDate.getMonth());

  const handlePrevMonth = () => {
    if (isCurrentMonthView) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (isMaxMonthView) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const monthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(viewYear, viewMonth, 1));

  // Calendar days generation (Monday first)
  const calendarCells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    // getDay() gives 0 for Sun, 1 for Mon... we want Mon=0, Tue=1 ... Sun=6
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: Array<{ dayNumber: number | null; dateStr: string | null; isSelectable: boolean; isToday: boolean }> = [];

    // Leading empty cells
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ dayNumber: null, dateStr: null, isSelectable: false, isToday: false });
    }

    const todayStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: config.businessTimezone || 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

    const maxDateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: config.businessTimezone || 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(maxDate);

    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dObj = new Date(Date.UTC(viewYear, viewMonth, d, 12, 0, 0));
      const dayOfWeek = dObj.getUTCDay();

      const isAllowedDay = (config.availability?.days || [1, 2, 3, 4, 5, 6]).includes(dayOfWeek);
      const isPast = dStr < todayStr;
      const isTooFar = dStr > maxDateStr;
      const isToday = dStr === todayStr;

      const isSelectable = isAllowedDay && !isPast && !isTooFar;

      cells.push({
        dayNumber: d,
        dateStr: dStr,
        isSelectable,
        isToday,
      });
    }

    return cells;
  }, [viewYear, viewMonth, config.availability, config.businessTimezone]);

  // Fetch slots whenever selectedDateStr changes
  useEffect(() => {
    if (!selectedDateStr) {
      setAvailableSlots([]);
      return;
    }

    let isMounted = true;
    setLoadingSlots(true);
    setSelectedSlot(null);

    fetch(`/api/booking/slots?date=${selectedDateStr}`)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) {
          setAvailableSlots(json.slots || []);
          setLoadingSlots(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAvailableSlots([]);
          setLoadingSlots(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDateStr]);

  // Convert business slot (e.g. "10:00" in Asia/Kolkata) to viewer timezone string
  const formatSlotDisplay = (slotTime: string) => {
    if (!selectedDateStr) return slotTime;
    try {
      const slotDate = new Date(`${selectedDateStr}T${slotTime}:00+05:30`);
      return new Intl.DateTimeFormat('en-US', {
        timeZone: selectedTimezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
        .format(slotDate)
        .toLowerCase()
        .replace(/\s+/g, '');
    } catch {
      return slotTime;
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateStr || !selectedSlot) return;

    setSubmitting(true);
    setBookingError('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDateStr,
          time: selectedSlot,
          timezone: selectedTimezone,
          name: formName,
          email: formEmail,
          phone: formPhone,
          phoneCountry: formPhoneCountry,
          notes: formNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setBookingError(json.error || config.labels?.error || 'Failed to book slot.');
        if (res.status === 409) {
          // Refresh slots
          fetch(`/api/booking/slots?date=${selectedDateStr}`)
            .then((r) => r.json())
            .then((d) => setAvailableSlots(d.slots || []));
        }
        setSubmitting(false);
        return;
      }

      setCreatedBooking({ id: json.booking?.id || 'bk', icsContent: json.icsContent });
      setStep(3);
    } catch {
      setBookingError(config.labels?.error || 'Failed to connect. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadIcs = () => {
    if (!createdBooking?.icsContent) return;
    const blob = new Blob([createdBooking.icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-${selectedDateStr}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const googleCalendarUrl = useMemo(() => {
    if (!selectedDateStr || !selectedSlot) return '#';
    const startIso = `${selectedDateStr}T${selectedSlot}:00+05:30`;
    const start = new Date(startIso);
    const end = new Date(start.getTime() + (config.durationMinutes || 30) * 60 * 1000);

    const formatG = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dates = `${formatG(start)}/${formatG(end)}`;
    const text = encodeURIComponent(`${config.title || '30 Minute Meeting'} - Kraqen Innovations`);
    const details = encodeURIComponent('Web conferencing details provided upon confirmation.');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
  }, [selectedDateStr, selectedSlot, config]);

  // Selected date formatted for summary
  const summaryDateFormatted = useMemo(() => {
    if (!selectedDateStr || !selectedSlot) return '';
    try {
      const start = new Date(`${selectedDateStr}T${selectedSlot}:00+05:30`);
      const datePart = new Intl.DateTimeFormat('en-US', {
        timeZone: selectedTimezone,
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(start);

      const timePart = new Intl.DateTimeFormat('en-US', {
        timeZone: selectedTimezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
        .format(start)
        .toLowerCase()
        .replace(/\s+/g, '');

      return `${datePart}, ${timePart} (${timezoneLongName || selectedTimezone})`;
    } catch {
      return `${selectedDateStr} at ${selectedSlot}`;
    }
  }, [selectedDateStr, selectedSlot, selectedTimezone, timezoneLongName]);

  return (
    <div className="rounded-[16px] bg-[#151515] border border-white/12 p-6 sm:p-8 text-white shadow-2xl font-mono">
      {/* Top Info Block */}
      <div className="border-b border-white/12 pb-5 mb-6">
        <span className="text-[11px] text-white/50 uppercase tracking-wider block mb-1">
          {config.host || 'Kraqen Innovations'}
        </span>
        <h3 className="font-tanker text-[clamp(26px,2.8vw,38px)] text-white uppercase tracking-wide leading-tight mb-3">
          {config.title || '30 Minute Meeting'}
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/70">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#3D5AFE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <polyline points="12 6 12 12 16 14" strokeWidth="2" />
            </svg>
            {config.durationLabel || '30 min'}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#3D5AFE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {config.conferencingNote || 'Web conferencing details provided upon confirmation.'}
          </span>
        </div>
      </div>

      {/* STEP 1: Select Date & Time */}
      {step === 1 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="font-tanker text-lg uppercase text-white tracking-wide">
              {config.selectLabel || 'Select a Date & Time'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isCurrentMonthView}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                aria-label="Previous month"
              >
                ←
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                disabled={isMaxMonthView}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                aria-label="Next month"
              >
                →
              </button>
            </div>
          </div>

          <div className="text-center font-bold text-sm tracking-wider uppercase mb-4 text-white" aria-live="polite">
            {monthName}
          </div>

          {/* Weekday Header (Mon, Tue, Wed, Thu, Fri, Sat, Sun) */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-white/40 uppercase mb-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {calendarCells.map((cell, idx) => {
              if (cell.dayNumber === null) {
                return <div key={`empty-${idx}`} className="h-10" />;
              }

              const isSelected = selectedDateStr === cell.dateStr;

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  disabled={!cell.isSelectable}
                  onClick={() => cell.dateStr && setSelectedDateStr(cell.dateStr)}
                  className={`h-10 w-full rounded-full flex items-center justify-center text-xs transition-colors duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#3D5AFE] text-white font-bold ring-2 ring-white/50'
                      : cell.isSelectable
                      ? 'text-white hover:bg-[#3D5AFE]/30 bg-[#3D5AFE]/10'
                      : 'text-white/25 cursor-not-allowed'
                  } ${cell.isToday && !isSelected ? 'ring-1 ring-white/40' : ''}`}
                >
                  {cell.dayNumber}
                </button>
              );
            })}
          </div>

          {/* Timezone row */}
          <div className="border-t border-white/10 pt-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-white/50 uppercase tracking-wider">{config.timezoneLabel || 'Time zone'}</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="bg-[#1e1e1e] border border-white/20 text-white text-xs px-2 py-1.5 rounded outline-none cursor-pointer"
              >
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT/BST)</option>
                <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
                <option value="Asia/Singapore">Singapore Time (SGT)</option>
                <option value="Australia/Sydney">Sydney Time (AEST)</option>
              </select>
              <span className="text-[#3D5AFE] font-mono text-[11px]">{currentTimeFormatted}</span>
            </div>
          </div>

          {/* Time Slots Area */}
          {selectedDateStr && (
            <div className="border-t border-white/10 pt-4">
              <span className="font-mono text-xs uppercase tracking-wider text-white/60 block mb-3">
                AVAILABLE TIMES FOR {selectedDateStr}
              </span>

              {loadingSlots ? (
                <div className="py-8 text-center text-xs text-white/40">Loading available times...</div>
              ) : availableSlots.length === 0 ? (
                <div className="py-6 text-center text-xs text-white/50">
                  {config.labels?.noSlots || 'No times available on this day.'}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    const displayTime = formatSlotDisplay(slot);

                    if (isSelected) {
                      return (
                        <div key={slot} className="col-span-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedSlot(null)}
                            className="flex-1 h-11 rounded-lg bg-[#3D5AFE] text-white text-xs font-bold uppercase tracking-wider"
                          >
                            {displayTime}
                          </button>
                          <Button
                            type="button"
                            onClick={() => setStep(2)}
                            className="flex-1 !h-11 !text-xs font-bold uppercase tracking-wider"
                          >
                            {config.labels?.next || 'NEXT'} →
                          </Button>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className="h-11 rounded-lg border border-white/20 text-white hover:border-[#3D5AFE] hover:text-[#3D5AFE] text-xs font-mono tracking-wider transition-colors"
                      >
                        {displayTime}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Enter Details */}
      {step === 2 && (
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="font-tanker text-lg uppercase text-white">
              {config.labels?.enterDetails || 'Enter Details'}
            </span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-white/60 hover:text-white underline uppercase cursor-pointer"
            >
              ← {config.labels?.back || 'BACK'}
            </button>
          </div>

          {/* Chosen Date Summary */}
          <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-[#B7A8FF]">
            {summaryDateFormatted}
          </div>

          {bookingError && (
            <div className="p-3 rounded bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
              {bookingError}
            </div>
          )}

          <div>
            <label className="text-[10px] text-white/60 uppercase tracking-wider block mb-1">
              {config.labels?.name || 'NAME'} *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Your full name"
              className="w-full h-11 px-3 bg-[#111] border border-white/20 rounded text-xs text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-[10px] text-white/60 uppercase tracking-wider block mb-1">
              {config.labels?.email || 'EMAIL'} *
            </label>
            <input
              type="email"
              required
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full h-11 px-3 bg-[#111] border border-white/20 rounded text-xs text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-[10px] text-white/60 uppercase tracking-wider block mb-1">
              {config.labels?.phone || 'CONTACT NUMBER'} *
            </label>
            <PhoneInput
              value={formPhone}
              onChange={(data) => {
                setFormPhone(data.nationalNumber);
                setFormPhoneCountry(data.country);
              }}
              required
              className="rounded"
            />
          </div>

          <div>
            <label className="text-[10px] text-white/60 uppercase tracking-wider block mb-1">
              {config.labels?.notes || 'ANYTHING ELSE WE SHOULD KNOW?'}
            </label>
            <textarea
              rows={3}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Tell us briefly about your brand, timeline, or objectives"
              className="w-full p-3 bg-[#111] border border-white/20 rounded text-xs text-white outline-none focus:border-white resize-none"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full !h-12 !text-xs font-bold"
            >
              {submitting ? 'SCHEDULING...' : config.labels?.schedule || 'SCHEDULE EVENT'}
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: Confirmed Screen */}
      {step === 3 && (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-xl font-bold">
            ✓
          </div>
          <h4 className="font-tanker text-2xl md:text-3xl uppercase tracking-wide text-white">
            {config.labels?.confirmedTitle || 'YOU ARE SCHEDULED'}
          </h4>
          <p className="text-xs text-[#B7A8FF] max-w-sm mx-auto leading-relaxed">
            {summaryDateFormatted}
          </p>
          <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
            {config.labels?.confirmedText ||
              'A confirmation was sent to your email. Web conferencing details will follow after confirmation.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn !h-10 !px-4 !text-[11px]"
            >
              ADD TO GOOGLE CALENDAR
            </a>
            <button
              type="button"
              onClick={downloadIcs}
              className="btn !bg-transparent border border-white/20 hover:!bg-white/10 !h-10 !px-4 !text-[11px]"
            >
              DOWNLOAD .ICS
            </button>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setSelectedSlot(null);
              }}
              className="text-xs text-white/40 hover:text-white underline uppercase"
            >
              BOOK ANOTHER SESSION
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

