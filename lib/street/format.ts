import type { Locale } from "@/lib/i18n";
import type { Project } from "@/lib/schema";

/** "2026-10" → "October 2026"; a range → "September – October 2026" (an em dash in Russian). */
export function periodLabel(period: Project["period"], months: readonly string[], locale: Locale): string {
  const name = (ym: string) => months[Number(ym.slice(5, 7)) - 1];
  const year = period.to.slice(0, 4);
  if (period.from === period.to) return `${name(period.from)} ${year}`;
  const dash = locale === "ru" ? " — " : " – ";
  return `${name(period.from)}${dash}${name(period.to)} ${year}`;
}

/** Two-digit ordinal for the flagship numbering: 1 → "01". */
export function num(i: number): string {
  return String(i + 1).padStart(2, "0");
}
