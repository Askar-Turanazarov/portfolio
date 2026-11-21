/**
 * Receives Content Security Policy violation reports and writes a short line per violation to the runtime log.
 * Two formats arrive: `application/csp-report` ({"csp-report": {...}}, Safari and Firefox through report-uri)
 * and `application/reports+json` ([{type: "csp-violation", body: {...}}], Chromium through report-to).
 * Only the directive, the blocked origin and the page path are kept: no query strings, no user agent.
 */

const MAX_BYTES = 16_384;

type Fields = Record<string, unknown>;

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : undefined);

/** A URL reduced to origin + path (query and hash can carry anything); keywords like "inline" pass as they are. */
function bare(v: unknown): string | undefined {
  const s = str(v, 500);
  if (!s) return undefined;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:" ? `${u.origin}${u.pathname}`.slice(0, 200) : u.protocol;
  } catch {
    return s.slice(0, 60);
  }
}

function line(r: Fields) {
  return {
    directive: str(r["effectiveDirective"] ?? r["effective-directive"] ?? r["violated-directive"], 60),
    blocked: bare(r["blockedURL"] ?? r["blocked-uri"]),
    page: bare(r["documentURL"] ?? r["document-uri"]),
    source: bare(r["sourceFile"] ?? r["source-file"]),
    line: typeof (r["lineNumber"] ?? r["line-number"]) === "number" ? (r["lineNumber"] ?? r["line-number"]) : undefined,
    sample: str(r["sample"] ?? r["script-sample"], 40),
  };
}

export async function POST(request: Request) {
  const text = (await request.text()).slice(0, MAX_BYTES);
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const reports: Fields[] = Array.isArray(data)
    ? data
        .filter((r): r is { type: string; body: Fields } => !!r && typeof r === "object" && r.type === "csp-violation" && !!r.body)
        .map((r) => r.body)
    : data && typeof data === "object" && "csp-report" in data && data["csp-report"] && typeof data["csp-report"] === "object"
      ? [data["csp-report"] as Fields]
      : [];
  for (const r of reports.slice(0, 10)) console.warn("csp-violation", JSON.stringify(line(r)));
  return new Response(null, { status: 204 });
}
