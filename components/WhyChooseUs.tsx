import { Zap, DollarSign, ShieldCheck, CalendarOff, MapPin } from "lucide-react";
import { LucideIcon } from "lucide-react";

type Pillar = { icon: LucideIcon; title: string; desc: string };

const pillars: Pillar[] = [
  {
    icon: Zap,
    title: "Done in Under an Hour",
    desc: "Screen, battery, port — most repairs finished while you wait. Grab lunch next door and come back.",
  },
  {
    icon: DollarSign,
    title: "You Hear the Price First",
    desc: "We quote before we touch anything. No surprise charges when you pick it up.",
  },
  {
    icon: ShieldCheck,
    title: "12-Month Warranty",
    desc: "Every repair is covered for a year. If it fails, we fix it free — no questions asked.",
  },
  {
    icon: CalendarOff,
    title: "No Appointment Needed",
    desc: "Open Mon–Sat 10–6, Sun 12–4. Walk in any time — there's no schedule to fight.",
  },
  {
    icon: MapPin,
    title: "Half a Mile from Campus",
    desc: "On B Street — easy walk or bike ride from the UC Davis main entrance.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2
          className="section-heading text-3xl md:text-4xl text-center mb-14 tracking-tight"
          style={{ fontWeight: 900, color: "#111111", letterSpacing: "-0.02em" }}
        >
          Why Davis Chooses Us
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl p-6 text-center"
              style={{
                background: "#f9f9f9",
                border: "1.5px solid #e5e7eb",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(139,26,26,0.07)" }}
              >
                <Icon size={22} style={{ color: "#8B1A1A" }} strokeWidth={1.75} />
              </div>
              <h3
                className="font-semibold mb-2 text-sm sm:text-base leading-snug"
                style={{ color: "#111111" }}
              >
                {title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
