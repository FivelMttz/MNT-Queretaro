import { Play, AcademicActivity } from '../data/mntData';

/**
 * Genera el enlace directo para añadir a Google Calendar una Puesta en Escena
 */
export function getGoogleCalendarUrl(play: Play): string {
  const start = new Date(play.dateIso + 'T' + play.time + ':00');
  const end = new Date(start.getTime() + play.durationMinutes * 60 * 1000);

  const formatGCalDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const datesParam = `${formatGCalDate(start)}/${formatGCalDate(end)}`;
  const title = encodeURIComponent(`46 MNT: ${play.title} (${play.company})`);
  const details = encodeURIComponent(
    `${play.title}\n${play.company} (${play.state})\nDuración: ${play.durationMinutes} min\nClasificación: ${play.ageRecommendation}\n\n${play.synopsis}\n\n46 Muestra Nacional de Teatro Querétaro 2026`
  );
  const location = encodeURIComponent(`${play.venue}, Querétaro, México`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
}

/**
 * Genera y descarga un archivo .ics para iCal / Apple Calendar / Outlook de una Puesta en Escena
 */
export function downloadIcsFile(play: Play) {
  const start = new Date(play.dateIso + 'T' + play.time + ':00');
  const end = new Date(start.getTime() + play.durationMinutes * 60 * 1000);

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//46 Muestra Nacional de Teatro//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:46mnt-${play.id}@mnt.inba.gob.mx`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:46 MNT: ${play.title} - ${play.company}`,
    `DESCRIPTION:${play.synopsis.replace(/\n/g, ' ')}`,
    `LOCATION:${play.venue}, Querétaro`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `46MNT_${play.slug}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Genera el enlace directo para añadir a Google Calendar una Actividad Académica
 */
export function getActivityGoogleCalendarUrl(activity: AcademicActivity): string {
  const start = new Date(activity.dateIso + 'T' + activity.time + ':00');
  const end = new Date(start.getTime() + activity.durationMinutes * 60 * 1000);

  const formatGCalDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const datesParam = `${formatGCalDate(start)}/${formatGCalDate(end)}`;
  const title = encodeURIComponent(`46 MNT [${activity.category}]: ${activity.title}`);
  const details = encodeURIComponent(
    `${activity.title}\nCategoría: ${activity.category}\n${activity.facilitators}\nAcceso: ${activity.accessRequirement}\nSede: ${activity.venue}\n\n${activity.description}\n\n46 Muestra Nacional de Teatro Querétaro 2026`
  );
  const location = encodeURIComponent(`${activity.venue}, Querétaro, México`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
}

/**
 * Genera y descarga un archivo .ics para iCal de una Actividad Académica
 */
export function downloadActivityIcsFile(activity: AcademicActivity) {
  const start = new Date(activity.dateIso + 'T' + activity.time + ':00');
  const end = new Date(start.getTime() + activity.durationMinutes * 60 * 1000);

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//46 Muestra Nacional de Teatro//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:46mnt-academic-${activity.id}@mnt.inba.gob.mx`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:46 MNT [${activity.category}]: ${activity.title}`,
    `DESCRIPTION:${activity.description.replace(/\n/g, ' ')}`,
    `LOCATION:${activity.venue}, Querétaro`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `46MNT_Academica_${activity.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
