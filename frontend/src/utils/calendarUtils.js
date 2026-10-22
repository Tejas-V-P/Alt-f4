/**
 * Utility to format events and generate Google Calendar URL / iCal files
 */

// Helper: Parse date (YYYY-MM-DD) and time string (e.g., '10:00 AM', '14:30', '2:30 PM') into a Date object
export const parseEventDateTime = (dateStr, timeStr = '10:00 AM') => {
  if (!dateStr) return new Date();

  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    let hours = 10;
    let minutes = 0;

    if (timeStr) {
      const trimmed = timeStr.trim().toUpperCase();
      const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/);
      if (match) {
        hours = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
        const meridiem = match[3];

        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
      }
    }

    return new Date(year, month - 1, day, hours, minutes);
  } catch (err) {
    console.error('Error parsing event datetime:', err);
    return new Date();
  }
};

// Format Date into Google Calendar ISO compact format (e.g. 20261022T100000)
export const toGoogleCalendarISO = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

/**
 * Generate a 1-click Google Calendar add link
 * Works seamlessly in real-time across Desktop and Mobile with no API keys or OAuth setup required.
 */
export const buildGoogleCalendarUrl = ({
  title,
  companyName,
  eventType,
  eventDate,
  time,
  notes,
  location,
  durationHours = 1
}) => {
  const startDate = parseEventDateTime(eventDate, time);
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

  const eventTitle = `${eventType ? `[${eventType}] ` : ''}${title || 'Interview'}${companyName ? ` - ${companyName}` : ''}`;
  
  const descriptionParts = [
    companyName ? `🏢 Company: ${companyName}` : '',
    eventType ? `🎯 Event Type: ${eventType}` : '',
    time ? `⏰ Scheduled Time: ${time}` : '',
    notes ? `\n📝 Notes & Instructions:\n${notes}` : '',
    `\n--\nScheduled via Placement Prep & Job Tracker Portal`
  ].filter(Boolean);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle,
    dates: `${toGoogleCalendarISO(startDate)}/${toGoogleCalendarISO(endDate)}`,
    details: descriptionParts.join('\n'),
    location: location || companyName || 'Online / Campus'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Download a standard .ics calendar file for Apple Calendar, Outlook, and offline calendar apps
 */
export const downloadIcsFile = ({
  title,
  companyName,
  eventType,
  eventDate,
  time,
  notes,
  location,
  durationHours = 1
}) => {
  const startDate = parseEventDateTime(eventDate, time);
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
  const summary = `${eventType ? `[${eventType}] ` : ''}${title || 'Interview'}${companyName ? ` - ${companyName}` : ''}`;
  const desc = `${companyName ? `Company: ${companyName}\\n` : ''}${eventType ? `Type: ${eventType}\\n` : ''}${notes ? `Notes: ${notes.replace(/\n/g, '\\n')}` : ''}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PlacementPortal//EventCalendar//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@placementportal.app`,
    `DTSTAMP:${toGoogleCalendarISO(new Date())}Z`,
    `DTSTART:${toGoogleCalendarISO(startDate)}`,
    `DTEND:${toGoogleCalendarISO(endDate)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${location || companyName || 'Online'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${companyName || 'Interview'}_${eventDate || 'event'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
