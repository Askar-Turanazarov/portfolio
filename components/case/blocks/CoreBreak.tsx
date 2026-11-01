"use client";

import { useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

/** Parts, messages and formulas from corecraft-pcmarket: prisma/seed, src/messages, src/lib/compat, src/lib/fps. */
type Gpu = { model: string; lengthMm: number; tdpW: number; score: number; vramGb: number };
type Board = { model: string; socket: string; formFactor: string; memoryType: string };
type Cooler = { model: string; heightMm: number; tdpW: number; sockets: string[] };
type Psu = { model: string; wattage: number; has12vhpwr: boolean };
type Case = { model: string; lengthMm: number; heightMm: number; formFactors: string[] };

const cpu = { model: "Ryzen 7 9800X3D", socket: "AM5", tdpW: 120, score: 100 };
const ram = { model: "G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5-6000", memoryType: "DDR5" };
const drive = { model: "Samsung 990 PRO 2TB", powerW: 8 };

const boards: Board[] = [
  { model: "MAG X870 Tomahawk WiFi", socket: "AM5", formFactor: "ATX", memoryType: "DDR5" },
  { model: "MAG B550 Tomahawk", socket: "AM4", formFactor: "ATX", memoryType: "DDR4" },
];
const gpus: Gpu[] = [
  { model: "GeForce RTX 4070 Ti Super 16GB", lengthMm: 305, tdpW: 285, score: 68, vramGb: 16 },
  { model: "GeForce RTX 4090 24GB", lengthMm: 336, tdpW: 450, score: 100, vramGb: 24 },
];
const coolers: Cooler[] = [
  { model: "NH-D15 G2", heightMm: 168, tdpW: 280, sockets: ["AM5", "AM4", "LGA1700", "LGA1851"] },
  { model: "Freezer 7 X", heightMm: 134, tdpW: 100, sockets: ["AM4", "LGA1700"] },
];
const psus: Psu[] = [
  { model: "RM850x, 850 W", wattage: 850, has12vhpwr: true },
  { model: "CX650, 650 W", wattage: 650, has12vhpwr: false },
  { model: "Core GM-600, 600 W", wattage: 600, has12vhpwr: false },
];
const pcCases: Case[] = [
  { model: "Lancool 216", lengthMm: 392, heightMm: 180, formFactors: ["ATX", "MATX", "ITX"] },
  { model: "O11 Dynamic EVO", lengthMm: 423, heightMm: 167, formFactors: ["ATX", "MATX", "ITX"] },
  { model: "CH370", lengthMm: 320, heightMm: 165, formFactors: ["MATX", "ITX"] },
];

const BASE_POWER_W = 60;
const PSU_HEADROOM = 1.3;
const HIGH_POWER_GPU_W = 300;

const messages = {
  socketMismatch: {
    en: "CPU socket {cpu} does not match the motherboard socket {board}",
    ru: "Сокет процессора {cpu} не совпадает с сокетом платы {board}",
    uz: "Protsessor soketi {cpu} plata soketi {board} bilan mos emas",
  },
  ramTypeMismatch: {
    en: "{ram} memory does not fit: the motherboard supports {board}",
    ru: "Память {ram} не подходит: плата поддерживает {board}",
    uz: "{ram} xotira mos emas: plata {board} ni qo‘llab-quvvatlaydi",
  },
  caseFormFactor: {
    en: "A {board} motherboard does not fit this case (supports: {supported})",
    ru: "Плата {board} не встанет в корпус (поддерживает: {supported})",
    uz: "{board} plata korpusga sig‘maydi (qo‘llab-quvvatlaydi: {supported})",
  },
  gpuTooLong: {
    en: "The graphics card is {gpu} mm long, the case fits up to {max} mm",
    ru: "Видеокарта длиной {gpu} мм, а корпус вмещает до {max} мм",
    uz: "Videokarta uzunligi {gpu} mm, korpusga {max} mm gacha sig‘adi",
  },
  coolerTooTall: {
    en: "The cooler is {cooler} mm tall, the case fits up to {max} mm",
    ru: "Кулер высотой {cooler} мм, а корпус вмещает до {max} мм",
    uz: "Kuler balandligi {cooler} mm, korpusga {max} mm gacha sig‘adi",
  },
  coolerSocket: {
    en: "The cooler does not support the {socket} socket",
    ru: "Кулер не поддерживает сокет {socket}",
    uz: "Kuler {socket} soketini qo‘llab-quvvatlamaydi",
  },
  psuTooWeak: {
    en: "The {psu} W power supply is below the estimated {need} W draw",
    ru: "Блок питания {psu} Вт слабее расчётного потребления {need} Вт",
    uz: "{psu} Vt quvvat bloki hisoblangan {need} Vt iste’moldan kuchsiz",
  },
  coolerWeak: {
    en: "The cooler is rated for {cooler} W while the CPU puts out {cpu} W",
    ru: "Кулер рассчитан на {cooler} Вт, а процессор выделяет {cpu} Вт",
    uz: "Kuler {cooler} Vt ga mo‘ljallangan, protsessor esa {cpu} Vt issiqlik chiqaradi",
  },
  psuMarginal: {
    en: "The {psu} W power supply has little headroom — we recommend {recommended} W or more",
    ru: "Блок питания {psu} Вт — впритык, рекомендуем от {recommended} Вт",
    uz: "{psu} Vt quvvat bloki — zaxirasiz, {recommended} Vt dan tavsiya etamiz",
  },
  psuNeeds12vhpwrAdapter: {
    en: "The {gpu} W graphics card needs 12VHPWR — this PSU lacks it, an adapter is required",
    ru: "Видеокарте на {gpu} Вт нужен разъём 12VHPWR — у этого БП его нет, понадобится переходник",
    uz: "{gpu} Vt videokartaga 12VHPWR ulagichi kerak — bu blokda u yo‘q, adapter kerak bo‘ladi",
  },
} satisfies Record<string, L10n>;

type Issue = { key: keyof typeof messages; params: Record<string, string | number> };
type Picks = { board: Board; gpu: Gpu; cooler: Cooler; psu: Psu; pcCase: Case };

function check({ board, gpu, cooler, psu, pcCase }: Picks) {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  if (cpu.socket !== board.socket) errors.push({ key: "socketMismatch", params: { cpu: cpu.socket, board: board.socket } });
  if (ram.memoryType !== board.memoryType) errors.push({ key: "ramTypeMismatch", params: { ram: ram.memoryType, board: board.memoryType } });
  if (!pcCase.formFactors.includes(board.formFactor)) {
    errors.push({ key: "caseFormFactor", params: { board: board.formFactor, supported: pcCase.formFactors.join(", ") } });
  }
  if (gpu.lengthMm > pcCase.lengthMm) errors.push({ key: "gpuTooLong", params: { gpu: gpu.lengthMm, max: pcCase.lengthMm } });
  if (cooler.heightMm > pcCase.heightMm) errors.push({ key: "coolerTooTall", params: { cooler: cooler.heightMm, max: pcCase.heightMm } });
  if (!cooler.sockets.includes(cpu.socket)) errors.push({ key: "coolerSocket", params: { socket: cpu.socket } });
  if (cooler.tdpW < cpu.tdpW) warnings.push({ key: "coolerWeak", params: { cooler: cooler.tdpW, cpu: cpu.tdpW } });

  const need = cpu.tdpW + gpu.tdpW + BASE_POWER_W + drive.powerW;
  const recommended = Math.ceil((need * PSU_HEADROOM) / 50) * 50;
  if (psu.wattage < need) errors.push({ key: "psuTooWeak", params: { psu: psu.wattage, need } });
  else if (psu.wattage < recommended) warnings.push({ key: "psuMarginal", params: { psu: psu.wattage, recommended } });
  if (gpu.tdpW >= HIGH_POWER_GPU_W && !psu.has12vhpwr) warnings.push({ key: "psuNeeds12vhpwrAdapter", params: { gpu: gpu.tdpW } });
  return { errors, warnings, need, recommended };
}

const games = [
  { name: "Cyberpunk 2077", demand: [18, 24, 32, 40], cpuDemand: 30, vram: [6, 7, 8, 9.5] },
  { name: "Microsoft Flight Simulator 2024", demand: [28, 38, 52, 67], cpuDemand: 75, vram: [6, 8, 10, 12] },
  { name: "Elden Ring", demand: [13, 18, 24, 30], cpuDemand: 25, vram: [3.5, 4.5, 5.5, 6.5] },
  { name: "Counter-Strike 2", demand: [5, 7, 9, 11], cpuDemand: 10, vram: [2.5, 3, 3.5, 4] },
];
const presets = ["low", "medium", "high", "ultra"];
const resolutions = [
  { name: "1080p", mult: 1, vram: 1 },
  { name: "1440p", mult: 1.72, vram: 1.1 },
  { name: "4K", mult: 3.35, vram: 1.25 },
];
const K = 60;
const C = 60;
const softMin = (a: number, b: number, p = 3) => (a ** -p + b ** -p) ** (-1 / p);

function fps(game: (typeof games)[number], preset: number, res: (typeof resolutions)[number], gpu: Gpu) {
  const gpuFps = (K * gpu.score) / (game.demand[preset] * res.mult);
  const cpuFps = (C * cpu.score) / game.cpuDemand;
  const penalty = gpu.vramGb < game.vram[preset] * res.vram ? 0.55 : 1;
  const ratio = gpuFps / cpuFps;
  return { avg: Math.round(softMin(gpuFps, cpuFps) * penalty), bound: ratio < 0.8 ? "GPU" : ratio > 1.25 ? "CPU" : "=" };
}

const t = {
  heading: { en: "Break this build", ru: "Сломайте эту сборку", uz: "Bu yig‘mani buzing" },
  intro: {
    en: "Real parts from the catalog. Change a part and the project's own rules answer, in its own words.",
    ru: "Настоящие детали из каталога. Смените деталь, и ответят правила самого проекта, его же словами.",
    uz: "Katalogdagi haqiqiy detallar. Detalni almashtiring, loyihaning o‘z qoidalari o‘z so‘zlari bilan javob beradi.",
  },
  fixed: { en: "Fixed", ru: "Не меняются", uz: "O‘zgarmaydi" },
  board: { en: "Motherboard", ru: "Плата", uz: "Plata" },
  gpu: { en: "Graphics card", ru: "Видеокарта", uz: "Videokarta" },
  cooler: { en: "Cooler", ru: "Кулер", uz: "Kuler" },
  psu: { en: "Power supply", ru: "Блок питания", uz: "Quvvat bloki" },
  case: { en: "Case", ru: "Корпус", uz: "Korpus" },
  ok: { en: "Compatible", ru: "Совместимо", uz: "Mos" },
  error: { en: "Error", ru: "Ошибка", uz: "Xato" },
  warning: { en: "Warning", ru: "Предупреждение", uz: "Ogohlantirish" },
  power: { en: "Estimated draw", ru: "Расчётное потребление", uz: "Hisoblangan iste’mol" },
  recommended: { en: "recommended", ru: "рекомендуется", uz: "tavsiya" },
  watt: { en: "W", ru: "Вт", uz: "Vt" },
  rules: {
    en: "This block carries 10 of the project's 16 rules: the ones these parts can trigger.",
    ru: "В этом блоке 10 из 16 правил проекта: те, что могут сработать на этих деталях.",
    uz: "Bu blokda loyihaning 16 qoidasidan 10 tasi: shu detallarda ishga tushishi mumkin bo‘lganlari.",
  },
  fpsHeading: { en: "A model estimate, not a benchmark", ru: "Модельная оценка, не бенчмарк", uz: "Benchmark emas, model bahosi" },
  game: { en: "Game", ru: "Игра", uz: "O‘yin" },
  resolution: { en: "Resolution", ru: "Разрешение", uz: "Ruxsat" },
  fpsNote: {
    en: "Average FPS for the selected card, without ray tracing or upscaling. CPU or GPU after a number marks the bottleneck.",
    ru: "Средний FPS для выбранной карты, без трассировки и апскейла. CPU или GPU рядом с числом показывает узкое место.",
    uz: "Tanlangan karta uchun o‘rtacha FPS, treysing va apskeylsiz. Raqam yonidagi CPU yoki GPU tor joyni ko‘rsatadi.",
  },
} satisfies Record<string, L10n>;

const base: Picks = { board: boards[0], gpu: gpus[0], cooler: coolers[0], psu: psus[0], pcCase: pcCases[0] };
const examples: Picks[] = [
  { ...base, board: boards[1] },
  { ...base, pcCase: pcCases[1] },
  { ...base, gpu: gpus[1], psu: psus[2] },
];

function format(template: string, params: Issue["params"]) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(params[k]));
}

/** SSR shows the working build; the select options and the table are all plain HTML. */
export default function CoreBreak({ locale }: { locale: Locale }) {
  const [picks, setPicks] = useState({ board: 0, gpu: 0, cooler: 0, psu: 0, pcCase: 0 });
  const [res, setRes] = useState(1);

  const build: Picks = {
    board: boards[picks.board],
    gpu: gpus[picks.gpu],
    cooler: coolers[picks.cooler],
    psu: psus[picks.psu],
    pcCase: pcCases[picks.pcCase],
  };
  const { errors, warnings, need, recommended } = check(build);

  const slots = [
    { id: "board", label: t.board, options: boards },
    { id: "gpu", label: t.gpu, options: gpus },
    { id: "cooler", label: t.cooler, options: coolers },
    { id: "psu", label: t.psu, options: psus },
    { id: "pcCase", label: t.case, options: pcCases },
  ] as const;

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <div className="cc-break">
          <div className="cc-slots">
            {slots.map((s) => (
              <label key={s.id}>
                <span>{pick(s.label, locale)}</span>
                <select value={picks[s.id]} onChange={(e) => setPicks({ ...picks, [s.id]: Number(e.target.value) })}>
                  {s.options.map((o, i) => (
                    <option key={o.model} value={i}>
                      {o.model}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <p className="block-note">
              {pick(t.fixed, locale)}: {cpu.model}, {ram.model}, {drive.model}
            </p>
          </div>
          <div className="cc-result" aria-live="polite">
            {errors.length + warnings.length === 0 && <p className="cc-issue" data-kind="ok">✓ {pick(t.ok, locale)}</p>}
            {errors.map((e) => (
              <p className="cc-issue" data-kind="error" key={e.key}>
                <b>✕ {pick(t.error, locale)}.</b> {format(pick(messages[e.key], locale), e.params)}
              </p>
            ))}
            {warnings.map((e) => (
              <p className="cc-issue" data-kind="warning" key={e.key}>
                <b>! {pick(t.warning, locale)}.</b> {format(pick(messages[e.key], locale), e.params)}
              </p>
            ))}
            <p className="cc-power">
              {pick(t.power, locale)}: <b>{need} {pick(t.watt, locale)}</b> · {pick(t.recommended, locale)}: <b>{recommended} {pick(t.watt, locale)}</b>
            </p>
          </div>
        </div>
        <noscript>
          <ul className="cc-examples">
            {examples.map((b) =>
              check(b).errors.map((e) => (
                <li key={`${b.board.model}${b.pcCase.model}${b.psu.model}${e.key}`}>
                  {format(pick(messages[e.key], locale), e.params)}
                </li>
              )),
            )}
          </ul>
        </noscript>
        <p className="block-note">{pick(t.rules, locale)}</p>

        <h3 className="cc-h3">{pick(t.fpsHeading, locale)}</h3>
        <p className="cc-formula">
          <code>fps = softMin(gpuFps, cpuFps) · ramPenalty · vramPenalty</code>
        </p>
        <div className="cc-res" role="group" aria-label={pick(t.resolution, locale)}>
          {resolutions.map((r, i) => (
            <button type="button" key={r.name} aria-pressed={res === i} onClick={() => setRes(i)}>
              {r.name}
            </button>
          ))}
        </div>
        <div className="cc-table">
          <table className="measures">
            <thead>
              <tr>
                <th scope="col">{pick(t.game, locale)}</th>
                {presets.map((p) => (
                  <th scope="col" key={p}>
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {games.map((g) => (
                <tr key={g.name}>
                  <th scope="row">{g.name}</th>
                  {presets.map((p, i) => {
                    const f = fps(g, i, resolutions[res], build.gpu);
                    return (
                      <td className="val" key={p}>
                        {f.avg} {f.bound !== "=" && <small>{f.bound}</small>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="block-note">{pick(t.fpsNote, locale)}</p>
      </div>
    </section>
  );
}
