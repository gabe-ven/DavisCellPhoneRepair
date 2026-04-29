"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  X, Package, Search, Wrench, CheckCircle2, Award, Check,
  Smartphone, Layers, Battery, Camera, CameraOff, Plug, Volume2,
  Mic, Droplets, Wifi, Bluetooth, PowerOff, Flame, HardDrive,
  KeyRound, Fingerprint, Scan, Loader2, Hash, MapPin, Clock,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TicketStatus } from "./ServicesSection/types/wizard";

// ── Types ────────────────────────────────────────────────────────────

interface TrackTicket {
  id: string;
  status: TicketStatus;
  deviceType: string;
  brand: string | null;
  modelNumber: string | null;
  modelTrim: string | null;
  modelCustom: string | null;
  issues: string[];
  assignedTo: string | null;
  createdAt: string;
  appointmentDate: string | null;
  customerName: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ── Static maps ──────────────────────────────────────────────────────

const STATUS_ORDER: TicketStatus[] = ["received", "reviewing", "in_repair", "ready", "completed"];

const STATUS_META: Record<TicketStatus, { label: string; verb: string; Icon: LucideIcon }> = {
  received:   { label: "Received",   verb: "received and queued",  Icon: Package      },
  reviewing:  { label: "Reviewing",  verb: "being reviewed",       Icon: Search       },
  in_repair:  { label: "In Repair",  verb: "actively being fixed", Icon: Wrench       },
  ready:      { label: "Ready",      verb: "repaired & ready",     Icon: CheckCircle2 },
  completed:  { label: "Completed",  verb: "completed",            Icon: Award        },
};

const ISSUE_META: Record<string, { label: string; Icon: LucideIcon }> = {
  screen:          { label: "Screen",         Icon: Smartphone },
  "back-glass":    { label: "Back Glass",     Icon: Layers     },
  battery:         { label: "Battery",        Icon: Battery    },
  "camera-front":  { label: "Front Camera",   Icon: CameraOff  },
  "camera-back":   { label: "Back Camera",    Icon: Camera     },
  "charging-port": { label: "Charging Port",  Icon: Plug       },
  earpiece:        { label: "Earpiece",       Icon: Volume2    },
  speaker:         { label: "Speaker",        Icon: Volume2    },
  microphone:      { label: "Microphone",     Icon: Mic        },
  "water-damage":  { label: "Water Damage",   Icon: Droplets   },
  "face-id":       { label: "Face ID",        Icon: Scan       },
  "touch-id":      { label: "Touch ID",       Icon: Fingerprint},
  wifi:            { label: "WiFi",           Icon: Wifi       },
  bluetooth:       { label: "Bluetooth",      Icon: Bluetooth  },
  signal:          { label: "No Signal",      Icon: Smartphone },
  vibration:       { label: "Vibration",      Icon: Smartphone },
  "wont-turn-on":  { label: "Won't Turn On",  Icon: PowerOff   },
  overheats:       { label: "Overheating",    Icon: Flame      },
  "data-recovery": { label: "Data Recovery",  Icon: HardDrive  },
  "password-reset":{ label: "Password Reset", Icon: KeyRound   },
  other:           { label: "Other",          Icon: Wrench     },
};

// ── Helpers ──────────────────────────────────────────────────────────

function getDeviceLabel(t: TrackTicket): string {
  if (t.deviceType === "iphone") {
    const parts = ["iPhone", t.modelNumber, t.modelTrim].filter(Boolean);
    return parts.length > 1 ? parts.join(" ") : "iPhone";
  }
  if (t.deviceType === "ipad") {
    const parts = ["iPad", t.modelNumber, t.modelTrim].filter(Boolean);
    return parts.length > 1 ? parts.join(" ") : "iPad";
  }
  if (t.modelCustom) return t.modelCustom;
  const parts = [t.brand, t.modelNumber].filter(Boolean);
  return parts.join(" ") || "Your Device";
}

function getLiveMessage(t: TrackTicket, deviceLabel: string): string {
  const tech = t.assignedTo ?? "our team";
  switch (t.status) {
    case "received":   return `We've received your ${deviceLabel}. You're in the queue!`;
    case "reviewing":  return `Your ${deviceLabel} is being carefully assessed by ${tech}.`;
    case "in_repair":  return `Your ${deviceLabel} is on the bench — ${tech} is repairing it now.`;
    case "ready":      return `Your ${deviceLabel} is fixed and ready for pickup! Come grab it.`;
    case "completed":  return `Repair complete. Thank you for choosing Davis Cell Phone Repair!`;
  }
}

// ── Sub-components ───────────────────────────────────────────────────

function IssueChip({ issueId, status }: { issueId: string; status: TicketStatus }) {
  const meta = ISSUE_META[issueId] ?? { label: issueId, Icon: Wrench };
  const { Icon } = meta;
  const active = status === "in_repair" || status === "reviewing";
  const done   = status === "ready" || status === "completed";
  return (
    <div className={`tr-issue-chip ${done ? "tr-issue-done" : active ? "tr-issue-active" : ""}`}>
      {done ? (
        <Check size={14} strokeWidth={3} className="tr-issue-check" />
      ) : active ? (
        <Icon size={14} className="tr-icon-pulse-soft" />
      ) : (
        <Icon size={14} />
      )}
      <span>{meta.label}</span>
    </div>
  );
}

// ── Status view (main found state) ──────────────────────────────────

function StatusView({ ticket, onReset }: { ticket: TrackTicket; onReset: () => void }) {
  const deviceLabel = getDeviceLabel(ticket);
  const liveMsg = getLiveMessage(ticket, deviceLabel);
  const { Icon: StatusIcon } = STATUS_META[ticket.status];
  const isActive = ticket.status === "reviewing" || ticket.status === "in_repair";

  return (
    <div className="tr-status-view">
      <p className="tr-ticket-num">
        <Hash size={12} style={{ opacity: 0.4 }} />
        {ticket.id}
        {isActive && <span className="tr-active-dot" />}
      </p>

      <h2 className="tr-device-name">{deviceLabel}</h2>

      <div className="tr-status-pill-row">
        <div className={`tr-status-pill tr-status-pill-${ticket.status}`}>
          <StatusIcon
            size={18}
            className={
              ticket.status === "in_repair" ? "tr-icon-spin" :
              ticket.status === "reviewing" ? "tr-icon-pulse" : ""
            }
          />
          {STATUS_META[ticket.status].label}
        </div>
      </div>

      <div className={`tr-live-message ${isActive ? "tr-live-message-glow" : ""}`}>
        <p>{liveMsg}</p>
        {ticket.assignedTo && (
          <p className="tr-assigned">
            <Wrench size={13} /> Technician: <strong>{ticket.assignedTo}</strong>
          </p>
        )}
      </div>

      {ticket.issues.length > 0 && (
        <div className="tr-issues-section">
          <p className="tr-section-label">Reported Issues</p>
          <div className="tr-issues-grid">
            {ticket.issues.map(id => (
              <IssueChip key={id} issueId={id} status={ticket.status} />
            ))}
          </div>
        </div>
      )}

      <div className="tr-info-row">
        {ticket.appointmentDate && (
          <span className="tr-info-chip">
            <Clock size={13} /> Appt: {ticket.appointmentDate}
          </span>
        )}
        <span className="tr-info-chip">
          <MapPin size={13} /> 140 B St Suite 4, Davis
        </span>
      </div>

      <button className="tr-back-btn" onClick={onReset}>
        <RefreshCw size={13} /> Look up a different ticket
      </button>
    </div>
  );
}

// ── Lookup form ──────────────────────────────────────────────────────

type Phase = "lookup" | "loading" | "found" | "not_found";

function LookupForm({ onSubmit }: { onSubmit: (ticketId: string, contact: string) => void }) {
  const [ticketNum, setTicketNum] = useState("");
  const [contact,   setContact]   = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (ticketNum.trim() && contact.trim()) {
      onSubmit(`DCR-${ticketNum.trim()}`, contact.trim());
    }
  }

  return (
    <form className="tr-lookup-form" onSubmit={handleSubmit}>
      <div className="tr-form-icon-wrap">
        <Wrench size={28} strokeWidth={1.5} className="tr-icon-pulse-soft" />
      </div>
      <h2 className="tr-lookup-title">Track Your Repair</h2>
      <p className="tr-lookup-sub">
        Enter your ticket number and the email or phone number you used when booking.
      </p>

      <label className="tr-label">
        Ticket Number
        <div className="tr-input-wrap">
          <span className="tr-input-prefix">DCR-</span>
          <input
            className="tr-input tr-input-prefixed"
            type="text"
            placeholder="1234567890"
            value={ticketNum}
            onChange={e => setTicketNum(e.target.value.replace(/\D/g, ''))}
            autoComplete="off"
            spellCheck={false}
            inputMode="numeric"
            required
          />
        </div>
      </label>

      <label className="tr-label">
        Email or Phone
        <div className="tr-input-wrap">
          <Search size={16} className="tr-input-icon" />
          <input
            className="tr-input"
            type="text"
            placeholder="you@email.com or (530) 555-0100"
            value={contact}
            onChange={e => setContact(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
      </label>

      <button type="submit" className="btn-cr tr-submit-btn">
        <Search size={16} /> Find My Repair
      </button>
    </form>
  );
}

// ── Root modal ───────────────────────────────────────────────────────

export default function TrackRepairModal({ isOpen, onClose }: Props) {
  const [phase,   setPhase]   = useState<Phase>("lookup");
  const [ticket,  setTicket]  = useState<TrackTicket | null>(null);
  const [contact, setContact] = useState<string>("");

  // Poll every 20 s when a ticket is showing and status is still active
  useEffect(() => {
    if (phase !== "found" || !ticket || !contact) return;
    if (ticket.status === "ready" || ticket.status === "completed") return;
    const id = ticket.id;
    const interval = setInterval(async () => {
      try {
        const res  = await fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticketId: id, contact }) });
        const json = await res.json();
        if (json.found) setTicket(json.ticket as TrackTicket);
      } catch { /* silent — keep showing last known state */ }
    }, 20_000);
    return () => clearInterval(interval);
  }, [phase, ticket, contact]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  async function handleLookup(ticketId: string, contact: string) {
    setPhase("loading");
    try {
      const res  = await fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticketId, contact }) });
      const json = await res.json();
      if (json.found) {
        setTicket(json.ticket as TrackTicket);
        setContact(contact);
        setPhase("found");
      } else {
        setPhase("not_found");
      }
    } catch {
      setPhase("not_found");
    }
  }

  function handleReset() {
    setPhase("lookup");
    setTicket(null);
  }

  if (!isOpen) return null;

  return (
    <div className="tr-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="tr-modal" onClick={e => e.stopPropagation()}>
        <button className="tr-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {phase === "lookup" && (
          <LookupForm onSubmit={handleLookup} />
        )}

        {phase === "loading" && (
          <div className="tr-loading">
            <Loader2 size={36} className="tr-icon-spin" style={{ color: "var(--cr)" }} />
            <p>Checking your ticket…</p>
          </div>
        )}

        {phase === "not_found" && (
          <div className="tr-not-found">
            <div className="tr-not-found-icon">
              <Search size={32} strokeWidth={1.5} />
            </div>
            <h2>No ticket found</h2>
            <p>
              Double-check your ticket number (e.g.&nbsp;<code>DCR-1234567890</code>) and the
              exact email or phone you used when booking.
            </p>
            <button className="btn-cr tr-submit-btn" onClick={handleReset}>
              Try Again
            </button>
            <a href="tel:+15303413384" className="tr-call-link">
              Or call us — (530) 341-3384
            </a>
          </div>
        )}

        {phase === "found" && ticket && (
          <StatusView ticket={ticket} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
