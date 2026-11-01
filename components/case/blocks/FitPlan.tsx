"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

/** A simplified plan written for this page. Limits from the project's README: 5 cm step, 2 cm plinth, 3 cm gap, 60 cm passage. */
const ROOM = { w: 400, h: 320 };
const STEP = 5;
const PLINTH = 2;
const MIN_GAP = 3;
const PASSAGE = 60;
const SLIT = 20;

type Rect = { x: number; y: number; w: number; h: number };
const bed: Rect = { x: 23, y: 22, w: 160, h: 200 };
// The swing arc is checked by its bounding box, which is coarser than the real app.
const door: Rect = { x: 240, y: 230, w: 90, h: 90 };
const WARDROBE = { w: 120, h: 60 };

const overlap = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

function gapBetween(a: Rect, b: Rect) {
  const dx = Math.max(a.x - (b.x + b.w), b.x - (a.x + a.w), 0);
  const dy = Math.max(a.y - (b.y + b.h), b.y - (a.y + a.h), 0);
  return Math.hypot(dx, dy);
}

type Finding = { kind: "error" | "warning"; text: L10n };

function validate(r: Rect): Finding[] {
  const out: Finding[] = [];
  const err = (text: L10n) => out.push({ kind: "error", text });
  if (r.x < PLINTH || r.y < PLINTH || r.x + r.w > ROOM.w - PLINTH || r.y + r.h > ROOM.h - PLINTH) {
    err({
      en: `Crosses the wall or the ${PLINTH} cm plinth.`,
      ru: `Заходит на стену или плинтус ${PLINTH} см.`,
      uz: `Devor yoki ${PLINTH} sm plintusga kirib ketadi.`,
    });
  }
  if (overlap(r, bed)) {
    err({ en: "Overlaps the bed.", ru: "Пересекается с кроватью.", uz: "Karavot bilan kesishadi." });
  } else {
    const gap = gapBetween(r, bed);
    if (gap < MIN_GAP) {
      err({
        en: `${Math.round(gap)} cm from the bed: the minimum gap is ${MIN_GAP} cm.`,
        ru: `${Math.round(gap)} см до кровати: минимальный зазор ${MIN_GAP} см.`,
        uz: `Karavotgacha ${Math.round(gap)} sm: eng kichik oraliq ${MIN_GAP} sm.`,
      });
    }
  }
  if (overlap(r, door)) {
    err({ en: "Blocks the door swing.", ru: "Мешает двери открыться.", uz: "Eshik ochilishiga xalaqit beradi." });
  }
  const sameRow = r.y < bed.y + bed.h && bed.y < r.y + r.h;
  const left = sameRow && bed.x + bed.w <= r.x ? r.x - (bed.x + bed.w) : r.x;
  const gaps = [left, r.y, ROOM.w - (r.x + r.w), ROOM.h - (r.y + r.h)];
  const narrow = gaps.filter((g) => g >= SLIT && g < PASSAGE);
  if (narrow.length) {
    const g = Math.min(...narrow);
    out.push({
      kind: "warning",
      text: {
        en: `Narrow passage ${g} cm (should be ${PASSAGE}+).`,
        ru: `Узкий проход ${g} см (нужно от ${PASSAGE}).`,
        uz: `Tor yo‘lak ${g} sm (${PASSAGE}+ bo‘lishi kerak).`,
      },
    });
  }
  return out;
}

const t = {
  heading: { en: "Will it fit?", ru: "Влезет?", uz: "Sig‘adimi?" },
  intro: {
    en: "A 4 × 3.2 m room. Drag the wardrobe, or focus it and use the arrow keys. R rotates it, as in the product.",
    ru: "Комната 4 × 3,2 м. Перетащите шкаф или выделите его и двигайте стрелками. R поворачивает, как в продукте.",
    uz: "4 × 3,2 m xona. Shkafni suring yoki tanlab, strelkalar bilan siljiting. R aylantiradi, mahsulotdagidek.",
  },
  wardrobe: { en: "Wardrobe", ru: "Шкаф", uz: "Shkaf" },
  bed: { en: "Bed", ru: "Кровать", uz: "Karavot" },
  door: { en: "Door", ru: "Дверь", uz: "Eshik" },
  rotate: { en: "Rotate", ru: "Повернуть", uz: "Aylantirish" },
  ok: { en: "Fits.", ru: "Влезает.", uz: "Sig‘adi." },
  walls: { en: "To the walls, cm", ru: "До стен, см", uz: "Devorlargacha, sm" },
  dirs: {
    en: "left, top, right, bottom",
    ru: "слева, сверху, справа, снизу",
    uz: "chapdan, yuqoridan, o‘ngdan, pastdan",
  },
  note: {
    en: "A simplified version for this page. The real app also checks heights on three axes, opening zones of doors and drawers, columns and ducts, and shows the room in 3D.",
    ru: "Упрощённая версия для этой страницы. Настоящее приложение ещё проверяет высоты по трём осям, зоны открывания дверей и ящиков, колонны и короба и показывает комнату в 3D.",
    uz: "Bu sahifa uchun soddalashtirilgan versiya. Haqiqiy ilova yana uch o‘q bo‘yicha balandlikni, eshik va tortmalar ochilish zonasini, ustun va qutilarni tekshiradi, xonani 3D’da ko‘rsatadi.",
  },
} satisfies Record<string, L10n>;

const ticks = (max: number, step: number) => Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);

/** SSR shows the wardrobe in the door swing, so the plan reads as a real error even without JS. */
export default function FitPlan({ locale }: { locale: Locale }) {
  const [pos, setPos] = useState({ x: 230, y: 240 });
  const [turned, setTurned] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const grab = useRef<{ dx: number; dy: number } | null>(null);

  const rect: Rect = { ...pos, w: turned ? WARDROBE.h : WARDROBE.w, h: turned ? WARDROBE.w : WARDROBE.h };
  const findings = validate(rect);
  const hasError = findings.some((f) => f.kind === "error");
  const hasWarning = findings.length > 0 && !hasError;

  const clamp = (v: number, max: number) => Math.max(0, Math.min(max, v));
  const place = (x: number, y: number) =>
    setPos({
      x: clamp(Math.round(x / STEP) * STEP, ROOM.w - rect.w),
      y: clamp(Math.round(y / STEP) * STEP, ROOM.h - rect.h),
    });

  const toRoom = (e: PointerEvent) => {
    const m = svg.current?.getScreenCTM();
    return m ? new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()) : { x: 0, y: 0 };
  };
  const rotate = () => {
    setTurned(!turned);
    setPos({
      x: clamp(pos.x, ROOM.w - (turned ? WARDROBE.w : WARDROBE.h)),
      y: clamp(pos.y, ROOM.h - (turned ? WARDROBE.h : WARDROBE.w)),
    });
  };
  const onKey = (e: KeyboardEvent) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-STEP, 0],
      ArrowRight: [STEP, 0],
      ArrowUp: [0, -STEP],
      ArrowDown: [0, STEP],
    };
    const m = moves[e.key];
    if (m) {
      e.preventDefault();
      place(pos.x + m[0], pos.y + m[1]);
    } else if (e.key === "r" || e.key === "R") {
      rotate();
    }
  };

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <div className="fp-grid">
          <svg
            ref={svg}
            className="fp-plan"
            viewBox={`-12 -12 ${ROOM.w + 24} ${ROOM.h + 24}`}
            role="group"
            aria-label={pick(t.heading, locale)}
          >
            {ticks(ROOM.w, 10).map((x) => (
              <line key={`x${x}`} className={x % 50 ? "fp-g" : "fp-G"} x1={x} x2={x} y1={0} y2={ROOM.h} />
            ))}
            {ticks(ROOM.h, 10).map((y) => (
              <line key={`y${y}`} className={y % 50 ? "fp-g" : "fp-G"} x1={0} x2={ROOM.w} y1={y} y2={y} />
            ))}
            <rect className="fp-wall" x={0} y={0} width={ROOM.w} height={ROOM.h} />
            <rect className="fp-item" x={bed.x} y={bed.y} width={bed.w} height={bed.h} />
            <text className="fp-label" x={bed.x + bed.w / 2} y={bed.y + bed.h / 2}>
              {pick(t.bed, locale)}
            </text>
            <path className="fp-swing" d={`M240 320 L240 230 A90 90 0 0 1 330 320`} />
            <text className="fp-label" x={285} y={306}>
              {pick(t.door, locale)}
            </text>
            <rect
              className="fp-wardrobe"
              data-state={hasError ? "error" : hasWarning ? "warning" : "ok"}
              x={rect.x}
              y={rect.y}
              width={rect.w}
              height={rect.h}
              tabIndex={0}
              role="button"
              aria-label={`${pick(t.wardrobe, locale)}: ${rect.x}, ${rect.y}`}
              onKeyDown={onKey}
              onPointerDown={(e) => {
                const p = toRoom(e);
                grab.current = { dx: p.x - rect.x, dy: p.y - rect.y };
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!grab.current) return;
                const p = toRoom(e);
                place(p.x - grab.current.dx, p.y - grab.current.dy);
              }}
              onPointerUp={() => (grab.current = null)}
              onPointerCancel={() => (grab.current = null)}
            />
            <text className="fp-label fp-w" x={rect.x + rect.w / 2} y={rect.y + rect.h / 2}>
              {pick(t.wardrobe, locale)}
            </text>
          </svg>
          <div className="fp-side" aria-live="polite">
            {findings.length === 0 && (
              <p className="fp-f" data-kind="ok">
                ✓ {pick(t.ok, locale)}
              </p>
            )}
            {findings.map((f) => (
              <p className="fp-f" data-kind={f.kind} key={pick(f.text, locale)}>
                {f.kind === "error" ? "✕" : "!"} {pick(f.text, locale)}
              </p>
            ))}
            <p className="fp-dist">
              {pick(t.walls, locale)}: <b>{rect.x}</b>, <b>{rect.y}</b>, <b>{ROOM.w - rect.x - rect.w}</b>,{" "}
              <b>{ROOM.h - rect.y - rect.h}</b>
              <br />
              <small>{pick(t.dirs, locale)}</small>
            </p>
            <button type="button" className="fp-rot" onClick={rotate}>
              {pick(t.rotate, locale)} (R)
            </button>
          </div>
        </div>
        <p className="block-note">{pick(t.note, locale)}</p>
      </div>
    </section>
  );
}
