import { AcademicActivity, FESTIVAL_DAYS } from '../data/mntData';

/**
 * Convierte el texto libre de `dates` en la lista de días del festival (5..14)
 * en los que se imparte la actividad.
 *
 * Patrones soportados en los datos actuales:
 *   - 'Viernes 6 Noviembre'                    -> [6]
 *   - 'Viernes 6 al Sábado 14 Noviembre'       -> [6,7,8,9,10,11,12,13,14]
 *   - 'Lunes 9 y Miércoles 11 Noviembre'       -> [9,11]
 *   - 'Lunes 9 al Viernes 13 Noviembre'        -> [9,10,11,12,13]
 *   - 'Viernes 6, Sábado 7 y Domingo 8 Nov'    -> [6,7,8]
 *
 * Si el texto no se puede interpretar, se usa `dayNumber` como respaldo
 * para no perder nunca la actividad en la agenda.
 */
export function getActivityDayNumbers(activity: AcademicActivity): number[] {
  const MIN_DAY = FESTIVAL_DAYS[0].day;
  const MAX_DAY = FESTIVAL_DAYS[FESTIVAL_DAYS.length - 1].day;

  const normalize = (days: number[]) =>
    Array.from(new Set(days.filter((d) => d >= MIN_DAY && d <= MAX_DAY))).sort((a, b) => a - b);

  const fallback = normalize([activity.dayNumber]);

  const raw = (activity.dates || '').trim();
  if (!raw) return fallback;

  // Quitamos el nombre del mes para que no interfiera con los números.
  const text = raw.replace(/noviembre/gi, ' ');

  // 1) Rangos continuos: "6 al Sábado 14", "9 al Viernes 13", "6 - 8".
  //    Entre ambos números puede ir una palabra de día ("al Sábado"),
  //    por eso usamos `.*?` con el conector "al" como ancla.
  const ranges = [...text.matchAll(/(\d{1,2})\s+al\b.*?(\d{1,2})(?!\w)/gi)];
  if (ranges.length > 0) {
    const days: number[] = [];
    for (const match of ranges) {
      const from = parseInt(match[1], 10);
      const to = parseInt(match[2], 10);
      if (Number.isNaN(from) || Number.isNaN(to)) continue;
      const start = Math.min(from, to);
      const end = Math.max(from, to);
      for (let d = start; d <= end; d++) days.push(d);
    }
    const result = normalize(days);
    if (result.length > 0) return result;
  }

  // 2) Listas o día único: tomamos todos los números sueltos del texto.
  //    Ej: "Lunes 9 y Miércoles 11", "Viernes 6, Sábado 7 y Domingo 8"
  const singles = [...text.matchAll(/\b(\d{1,2})\b/g)]
    .map((m) => parseInt(m[1], 10))
    .filter((n) => !Number.isNaN(n));

  const result = normalize(singles);
  return result.length > 0 ? result : fallback;
}

/** Devuelve true si la actividad se imparte ese día del festival. */
export function activityOccursOnDay(activity: AcademicActivity, day: number): boolean {
  return getActivityDayNumbers(activity).includes(day);
}

/** Etiqueta corta de los días en que se imparte: "6, 7 y 8 Nov" o "Día único". */
export function formatActivityDaysLabel(activity: AcademicActivity): string {
  const days = getActivityDayNumbers(activity);
  if (days.length === 0) return activity.dates || '';
  if (days.length === 1) return `Día ${days[0]} Nov`;
  if (days.length === 2) return `Días ${days[0]} y ${days[1]} Nov`;
  return `Días ${days[0]} al ${days[days.length - 1]} Nov`;
}
