"use client";

import { useState, useEffect } from "react";

// ── Devices ───────────────────────────────────────────────────────
const DEVICES = [
  {
    name: "iPhone",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <rect x="6" y="2" width="12" height="20" rx="2.5"/>
        <line x1="12" y1="18.5" x2="12.01" y2="18.5" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: "Android",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M6 18V9a6 6 0 0 1 12 0v9"/>
        <rect x="3" y="12" width="3.5" height="6.5" rx="1"/>
        <rect x="17.5" y="12" width="3.5" height="6.5" rx="1"/>
        <line x1="8.5" y1="6.5" x2="7" y2="4.5"/>
        <line x1="15.5" y1="6.5" x2="17" y2="4.5"/>
      </svg>
    ),
  },
  {
    name: "iPad / Tablet",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="12" y1="18.5" x2="12.01" y2="18.5" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: "Other",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <circle cx="12" cy="12" r="9.5"/>
        <path d="M9 9.5a3 3 0 0 1 5.83 1c0 2-3 2.5-3 4"/>
        <line x1="12" y1="17.5" x2="12.01" y2="17.5" strokeWidth="2"/>
      </svg>
    ),
  },
];

// ── Brands per device ─────────────────────────────────────────────
const BRANDS: Record<string, string[]> = {
  // iPhone has no brand step — brand is always Apple, auto-set on device select
  Android: ["Samsung Galaxy", "Google Pixel", "OnePlus", "Motorola", "Other"],
  "iPad / Tablet": ["Apple iPad", "Samsung Galaxy Tab", "Other"],
  Other: ["Console", "Smartwatch", "Earbuds", "Camera", "Other"],
};

// ── Models per brand ──────────────────────────────────────────────
const MODELS: Record<string, string[]> = {
  Apple: ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16", "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro", "iPhone 13", "iPhone 12", "iPhone 11", "iPhone XR / XS", "Older iPhone"],
  "Samsung Galaxy": ["S24 Ultra", "S24+", "S24", "S23 Ultra", "S23", "S22", "A55", "A54", "Note 20", "Older Galaxy"],
  "Google Pixel": ["Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9", "Pixel 8 Pro", "Pixel 8", "Pixel 7", "Older Pixel"],
  OnePlus: ["OnePlus 12", "OnePlus 11", "OnePlus 10", "Older OnePlus"],
  Motorola: ["Edge", "Razr", "G Series", "Other Motorola"],
  "Apple iPad": ['iPad Pro 13" (M4)', 'iPad Pro 11" (M4)', 'iPad Air 13"', 'iPad Air 11"', "iPad Mini 7", "iPad (10th gen)", "iPad (older)"],
  "Samsung Galaxy Tab": ["Tab S9 Ultra", "Tab S9+", "Tab S9", "Tab A9", "Older Tab"],
  Console: ["PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Nintendo Switch", "Other"],
  Smartwatch: ["Apple Watch", "Galaxy Watch", "Pixel Watch", "Garmin", "Other"],
  Earbuds: ["AirPods Pro", "AirPods", "Galaxy Buds", "Other"],
  Camera: ["Sony", "Canon", "Nikon", "GoPro", "Other"],
  Other: ["Other Device"],
};

const STORAGE = ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "Don't know"];

// ── Issues ────────────────────────────────────────────────────────
const ISSUES = [
  { label: "Cracked Screen", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="6" y="2" width="12" height="20" rx="2"/><polyline points="9 7 11 11 8 13 13 17"/></svg> },
  { label: "Dead Battery",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="2" y="7" width="18" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="10" x2="6" y2="14"/></svg> },
  { label: "Charging Port",  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><polyline points="13 2 7 14 12 14 11 22 17 10 12 10 13 2"/></svg> },
  { label: "Water Damage",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M12 2.5C8 7 5 11 5 14a7 7 0 0 0 14 0c0-3-3-7-7-11.5z"/></svg> },
  { label: "Camera Issue",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="3.5"/></svg> },
  { label: "Speaker / Mic",  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15 9a3 3 0 0 1 0 6"/><path d="M18 6a7 7 0 0 1 0 12"/></svg> },
  { label: "Button / Switch",icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/></svg> },
  { label: "Software",       icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.86-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.56 1.7 1.7 0 0 0-1.86.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.86l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6h0a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.86-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9V9a1.7 1.7 0 0 0 1.56 1h.04a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.56 1z"/></svg> },
  { label: "Other",          icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M14.7 6.3a4 4 0 0 0-5.66 5.66l-7.07 7.07 2.83 2.83 7.07-7.07a4 4 0 0 0 5.66-5.66l-2.83 2.83-2.83-2.83 2.83-2.83z"/></svg> },
];

// ── Pricing ───────────────────────────────────────────────────────
const PRICES: Record<string, Record<string, string> & { _?: string }> = {
  "Cracked Screen":  { iPhone: "$89—$189", Android: "$79—$149", "iPad / Tablet": "$99—$229", Other: "Quote on call" },
  "Dead Battery":    { iPhone: "$59—$89",  Android: "$49—$79",  "iPad / Tablet": "$79—$129", Other: "Quote on call" },
  "Charging Port":   { iPhone: "$59—$89",  Android: "$49—$79",  "iPad / Tablet": "$69—$99",  Other: "Quote on call" },
  "Water Damage":    { _: "$49 diagnostic" },
  "Camera Issue":    { iPhone: "$69—$129", Android: "$59—$109", "iPad / Tablet": "$79—$149", Other: "Quote on call" },
  "Speaker / Mic":   { iPhone: "$59—$89",  Android: "$49—$79",  "iPad / Tablet": "$59—$99",  Other: "Quote on call" },
  "Button / Switch": { iPhone: "$49—$79",  Android: "$39—$69",  "iPad / Tablet": "$59—$89",  Other: "Quote on call" },
  Software:          { _: "Free diagnostic" },
  Other:             { _: "Quote on call" },
};

function priceFor(device: string | null, issue: string): string {
  const r = PRICES[issue] || {};
  return (device ? r[device] : undefined) || r._ || "Quote on call";
}

// ── Calendar helpers ──────────────────────────────────────────────
const CAL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CAL_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getTimeSlots(dateStr: string): string[] {
  const d = new Date(dateStr + "T12:00:00");
  const dow = d.getDay();
  if (dow === 0) return ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"];
  return ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
}

function formatApptDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).toUpperCase();
}

function CalendarPicker({ value, onDateChange }: { value: string | null; onDateChange: (d: string) => void }) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function makeDateStr(d: number): string {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const isPrevDisabled = viewYear < now.getFullYear() || (viewYear === now.getFullYear() && viewMonth <= now.getMonth());

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <button
          type="button"
          onClick={prevMonth}
          disabled={isPrevDisabled}
          style={{
            opacity: isPrevDisabled ? 0.25 : 1,
            background: "none", border: "none", cursor: isPrevDisabled ? "default" : "pointer",
            fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink)", padding: "4px 8px",
            letterSpacing: "0.08em",
          }}
        >
          ← PREV
        </button>
        <div className="mono" style={{ fontWeight: 700, letterSpacing: "0.12em", fontSize: 13 }}>
          {CAL_MONTHS[viewMonth].toUpperCase()} {viewYear}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink)", padding: "4px 8px",
            letterSpacing: "0.08em",
          }}
        >
          NEXT →
        </button>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 4 }}>
        {CAL_DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.07em", color: "rgba(10,10,10,0.4)", paddingBottom: 2 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const ds = makeDateStr(d);
          const isPast = ds < todayStr;
          const isSel = ds === value;
          const isToday = ds === todayStr;
          return (
            <button
              key={d}
              type="button"
              disabled={isPast}
              onClick={() => onDateChange(ds)}
              style={{
                aspectRatio: "1",
                border: isSel ? "1.5px solid var(--cr)" : isToday ? "1.5px solid rgba(10,10,10,0.25)" : "1.5px solid transparent",
                background: isSel ? "var(--cr)" : "var(--card)",
                color: isPast ? "rgba(10,10,10,0.18)" : isSel ? "#fff" : "var(--ink)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: isSel ? 700 : 500,
                cursor: isPast ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.12s ease",
              }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Select component ──────────────────────────────────────────────
function TicketSelect({
  label, value, onChange, options, placeholder, disabled,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span className="mono micro muted">{label}</span>
      <div className="v2-select-wrap" data-disabled={disabled || undefined}>
        <select
          className="v2-ticket-select"
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          disabled={disabled}
        >
          <option value="">{placeholder || "Select…"}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <svg className="v2-select-caret" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="7">
          <polyline points="1 1.5 6 6.5 11 1.5"/>
        </svg>
      </div>
    </label>
  );
}

// ── Wizard ────────────────────────────────────────────────────────
type WizardState = {
  device: string | null;
  brand: string | null;
  model: string | null;
  trim: string | null;
  issues: string[];
  apptDate: string | null;
  apptTime: string | null;
  name: string;
  email: string;
  phone: string;
  notes: string;
  files: File[];
};

export default function RepairWizardV2() {
  const [step, setStep] = useState(0);
  const [s, setS] = useState<WizardState>({
    device: null, brand: null, model: null, trim: null,
    issues: [], apptDate: null, apptTime: null,
    name: "", email: "", phone: "", notes: "", files: [],
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [serverTicketId, setServerTicketId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [today, setToday] = useState("---");
  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase());
  }, []);

  function next() { setStep((x) => x + 1); }
  function back() { setStep((x) => Math.max(0, x - 1)); }
  function toggleIssue(i: string) {
    setS((p) => ({
      ...p,
      issues: p.issues.includes(i) ? p.issues.filter((x) => x !== i) : [...p.issues, i],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!s.name.trim() || !s.email.trim() || !s.phone.trim()) return;
    setLoading(true);
    setSubmitError(null);

    try {
      const images = await Promise.all(
        s.files.map(async (file) => {
          if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} is over 5 MB. Please attach a smaller file.`);
          const base64 = await new Promise<string>((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.onerror = rej;
            r.readAsDataURL(file);
          });
          return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: file.name, type: file.type, base64, sizeKb: Math.round(file.size / 1024) };
        })
      );

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device:      s.device,
          brand:       s.brand,
          modelNumber: s.model,
          modelTrim:   s.trim,
          modelCustom: null,
          issues:      s.issues,
          images,
          appointment: { date: s.apptDate, timeSlot: s.apptTime },
          customer:    { name: s.name, email: s.email, phone: s.phone },
          notes:       s.notes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");

      setServerTicketId(data.ticketId);
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again or call us.");
    } finally {
      setLoading(false);
    }
  }

  const headers = ["SELECT DEVICE", "SELECT MODEL", "DESCRIBE ISSUE", "PICK A TIME", "CONFIRM & SUBMIT"];
  const isIphone = s.device === "iPhone";
  const brands = s.device ? (BRANDS[s.device] || []) : [];
  const models = s.brand ? (MODELS[s.brand] || []) : [];
  const displayName = isIphone
    ? [s.model, s.trim].filter(Boolean).join(" · ")
    : [s.brand, s.model, s.trim].filter(Boolean).join(" · ");

  const timeSlots = s.apptDate ? getTimeSlots(s.apptDate) : [];

  return (
    <div className="v2-ticket">
      <div className="v2-ticket-perf" />

      {/* Header */}
      <div className="v2-ticket-head">
        <div>
          <div className="mono micro muted">REPAIR TICKET</div>
          <div className="mono micro" style={{ marginTop: 4, letterSpacing: "0.08em" }}>140 B ST · DAVIS, CA</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="mono micro muted">{today}</div>
          <div className="mono micro" style={{ color: "var(--cr)" }}>
            {done ? "COMPLETE" : `STEP ${step + 1}/5`}
          </div>
        </div>
      </div>

      <div className="v2-ticket-rule" />

      {done ? (
        /* Success state */
        <div className="v2-ticket-body">
          <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
            <div className="v2-stamp">RECEIVED</div>
          </div>
          <h3 className="serif-it" style={{ fontSize: "clamp(28px,4vw,40px)", textAlign: "center", lineHeight: 1.05, marginTop: 16, color: "var(--ink)" }}>
            Your repair is in the queue.
          </h3>
          <p className="muted" style={{ textAlign: "center", fontSize: 14, marginTop: 10, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
            We&apos;ll reach out within an hour during shop hours with a precise quote and timeline.
          </p>

          <div className="v2-ticket-rule" style={{ margin: "24px 0" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, fontSize: 12, fontFamily: "var(--font-mono)" }}>
            <div>
              <div className="muted micro">TICKET</div>
              <div style={{ marginTop: 4, fontWeight: 700, fontSize: 15, color: "var(--cr)" }}>{serverTicketId}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="muted micro">PHONE</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{s.phone}</div>
            </div>
            <div>
              <div className="muted micro">DEVICE</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{displayName || s.device}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="muted micro">NAME</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{s.name}</div>
            </div>
            {s.apptDate && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="muted micro">APPOINTMENT</div>
                <div style={{ marginTop: 4, fontWeight: 600 }}>{formatApptDate(s.apptDate)}{s.apptTime ? ` · ${s.apptTime}` : ""}</div>
              </div>
            )}
            <div style={{ gridColumn: "1 / -1" }}>
              <div className="muted micro">TICKET SENT TO</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{s.email}</div>
            </div>
            {s.files.length > 0 && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="muted micro">ATTACHMENTS</div>
                <div style={{ marginTop: 4 }}>{s.files.length} file{s.files.length > 1 ? "s" : ""} attached</div>
              </div>
            )}
            <div style={{ gridColumn: "1 / -1" }}>
              <div className="muted micro">ISSUES</div>
              <div style={{ marginTop: 4 }}>{s.issues.join(" · ")}</div>
            </div>
          </div>

          <div className="v2-ticket-rule" style={{ margin: "24px 0 20px" }} />
          <div style={{ textAlign: "center" }}>
            <a href="tel:+15303413384" className="btn-cr-out" style={{ display: "inline-flex" }}>
              OR CALL — (530) 341-3384
            </a>
          </div>
        </div>
      ) : (
        <div className="v2-ticket-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <div className="mono micro" style={{ letterSpacing: "0.15em" }}>{headers[step]}</div>
            {step > 0 && (
              <button onClick={back} className="v2-link-back">← BACK</button>
            )}
          </div>

          {/* Step 0: Device tiles */}
          {step === 0 && (
            <div className="v2-grid-5" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {DEVICES.map((d) => (
                <button
                  key={d.name}
                  onClick={() => {
                    setS((p) => ({
                      ...p,
                      device: d.name,
                      brand: d.name === "iPhone" ? "Apple" : null,
                      model: null,
                      trim: null,
                    }));
                    next();
                  }}
                  className={"v2-tile" + (s.device === d.name ? " sel" : "")}
                >
                  {d.icon}
                  <span>{d.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Model dropdowns */}
          {step === 1 && (
            <div>
              <p className="muted" style={{ fontSize: 13, marginBottom: 18 }}>
                {isIphone ? "Pick your model and (if known) storage." : "Pick your make, model, and (if known) storage."}
              </p>
              <div className="v2-dropdown-stack">
                {!isIphone && (
                  <TicketSelect
                    label="BRAND / MAKE"
                    value={s.brand}
                    onChange={(v) => setS((p) => ({ ...p, brand: v, model: null }))}
                    options={brands}
                    placeholder={`Choose ${s.device || "device"} brand…`}
                  />
                )}
                <TicketSelect
                  label="MODEL"
                  value={s.model}
                  onChange={(v) => setS((p) => ({ ...p, model: v }))}
                  options={models}
                  placeholder={isIphone || s.brand ? "Choose model…" : "Pick a brand first"}
                  disabled={!isIphone && !s.brand}
                />
                <TicketSelect
                  label="STORAGE / TRIM"
                  value={s.trim}
                  onChange={(v) => setS((p) => ({ ...p, trim: v }))}
                  options={STORAGE}
                  placeholder="Optional — choose storage…"
                />
              </div>
              <button
                onClick={next}
                disabled={!s.model}
                className="btn-cr"
                style={{ width: "100%", marginTop: 22, opacity: s.model ? 1 : 0.4 }}
              >
                CONTINUE TO ISSUE →
              </button>
            </div>
          )}

          {/* Step 2: Issue tiles */}
          {step === 2 && (
            <div>
              <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>Tap all that apply.</p>
              <div className="v2-grid-3" style={{ marginBottom: 22 }}>
                {ISSUES.map(({ label, icon }) => {
                  const sel = s.issues.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleIssue(label)}
                      className={"v2-tile-issue" + (sel ? " sel" : "")}
                    >
                      <span style={{ width: 22, height: 22, color: sel ? "var(--cr)" : "var(--ink)", display: "flex", flexShrink: 0 }}>
                        {icon}
                      </span>
                      <span style={{ flex: 1 }}>{label}</span>
                      <span className="mono micro" style={{ color: sel ? "var(--cr)" : "rgba(10,10,10,0.25)" }}>
                        {sel ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={next}
                disabled={s.issues.length === 0}
                className="btn-cr"
                style={{ width: "100%", opacity: s.issues.length ? 1 : 0.4 }}
              >
                CONTINUE TO APPOINTMENT →
              </button>
            </div>
          )}

          {/* Step 3: Appointment calendar */}
          {step === 3 && (
            <div>
              <p className="muted" style={{ fontSize: 13, marginBottom: 20 }}>
                Pick a preferred drop-off date and time. Walk-ins always welcome — skip below if you prefer to just show up.
              </p>

              <CalendarPicker
                value={s.apptDate}
                onDateChange={(d) => setS((p) => ({ ...p, apptDate: d, apptTime: null }))}
              />

              {/* Time slots */}
              {s.apptDate && (
                <div style={{ marginTop: 22 }}>
                  <div className="v2-ticket-rule" style={{ margin: "0 0 16px" }} />
                  <div className="mono micro muted" style={{ marginBottom: 10 }}>
                    {formatApptDate(s.apptDate)} — AVAILABLE TIMES
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {timeSlots.map((slot) => {
                      const isSel = s.apptTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setS((p) => ({ ...p, apptTime: slot }))}
                          style={{
                            border: isSel ? "1.5px solid var(--cr)" : "1.5px solid var(--border)",
                            background: isSel ? "var(--cr)" : "var(--card)",
                            color: isSel ? "#fff" : "var(--ink)",
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            fontWeight: isSel ? 700 : 500,
                            letterSpacing: "0.08em",
                            padding: "7px 14px",
                            cursor: "pointer",
                            transition: "all 0.12s ease",
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="v2-ticket-rule" style={{ margin: "22px 0 18px" }} />

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    setS((p) => ({ ...p, apptDate: null, apptTime: null }));
                    next();
                  }}
                  className="btn-cr-out"
                  style={{ flex: 1, fontSize: 12 }}
                >
                  SKIP — WALK IN ANYTIME
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!s.apptDate || !s.apptTime}
                  className="btn-cr"
                  style={{ flex: 2, opacity: s.apptDate && s.apptTime ? 1 : 0.4 }}
                >
                  CONFIRM TIME →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Receipt + contact */}
          {step === 4 && (
            <form onSubmit={submit}>
              <div className="v2-receipt">
                <div className="mono micro muted" style={{ marginBottom: 10 }}>ESTIMATED PRICING</div>
                <div className="mono" style={{ fontSize: 13, marginBottom: 14, fontWeight: 600 }}>{displayName || s.device}</div>
                {s.issues.map((issue) => (
                  <div key={issue} className="v2-receipt-row">
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{issue}</span>
                    <span style={{ flex: 1, borderBottom: "1px dotted rgba(10,10,10,0.25)", margin: "0 10px", height: "0.7em" }} />
                    <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: "var(--cr)" }}>
                      {priceFor(s.device, issue)}
                    </span>
                  </div>
                ))}
                {s.apptDate && (
                  <div className="v2-receipt-row" style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(10,10,10,0.1)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>APPOINTMENT</span>
                    <span style={{ flex: 1, borderBottom: "1px dotted rgba(10,10,10,0.25)", margin: "0 10px", height: "0.7em" }} />
                    <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--ink)" }}>
                      {formatApptDate(s.apptDate)}{s.apptTime ? ` ${s.apptTime}` : ""}
                    </span>
                  </div>
                )}
                <div className="mono micro muted" style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(10,10,10,0.12)" }}>
                  FREE DIAGNOSIS · 12-MO WARRANTY · NO HIDDEN FEES
                </div>
              </div>

              <div className="v2-contact-fields" style={{ marginTop: 20 }}>
                <input
                  required
                  placeholder="YOUR NAME"
                  value={s.name}
                  onChange={(e) => setS((p) => ({ ...p, name: e.target.value }))}
                  className="v2-ticket-input"
                />
                <input
                  required
                  placeholder="PHONE NUMBER"
                  type="tel"
                  value={s.phone}
                  onChange={(e) => setS((p) => ({ ...p, phone: e.target.value }))}
                  className="v2-ticket-input"
                />
              </div>
              <input
                required
                placeholder="EMAIL — WE'LL SEND YOUR TICKET HERE"
                type="email"
                value={s.email}
                onChange={(e) => setS((p) => ({ ...p, email: e.target.value }))}
                className="v2-ticket-input"
                style={{ marginTop: 12, width: "100%" }}
              />
              <textarea
                placeholder="ANYTHING ELSE WE SHOULD KNOW? (OPTIONAL)"
                rows={2}
                value={s.notes}
                onChange={(e) => setS((p) => ({ ...p, notes: e.target.value }))}
                className="v2-ticket-input"
                style={{ marginTop: 12, resize: "none", width: "100%" }}
              />
              {/* File attachment */}
              <label style={{ marginTop: 12, display: "block", cursor: "pointer" }}>
                <span className="mono micro muted" style={{ display: "block", marginBottom: 6 }}>ATTACHMENTS (OPTIONAL)</span>
                <div
                  style={{
                    border: "1.5px dashed var(--border)",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "border-color 0.18s ease",
                    background: "var(--card)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" style={{ flexShrink: 0, color: "var(--muted)" }}>
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                  <span className="mono" style={{ fontSize: 12, color: s.files.length ? "var(--ink)" : "var(--muted-2)", letterSpacing: "0.1em" }}>
                    {s.files.length
                      ? `${s.files.length} file${s.files.length > 1 ? "s" : ""} selected — ${s.files.map(f => f.name).join(", ")}`
                      : "ADD PHOTOS OF THE DAMAGE"}
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf"
                  style={{ display: "none" }}
                  onChange={(e) => setS((p) => ({ ...p, files: Array.from(e.target.files || []) }))}
                />
              </label>
              {submitError && (
                <div className="mono" style={{ marginTop: 12, padding: "12px 14px", border: "1.5px solid var(--cr)", color: "var(--cr)", fontSize: 12, letterSpacing: "0.05em", lineHeight: 1.5 }}>
                  {submitError}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-cr"
                style={{ width: "100%", marginTop: 12 }}
              >
                {loading ? "SUBMITTING…" : "SUBMIT REPAIR TICKET →"}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="v2-ticket-perf bottom" />
    </div>
  );
}
