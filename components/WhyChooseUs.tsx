import { Zap, DollarSign, ShieldCheck, Users, GraduationCap } from "lucide-react";
import { LucideIcon } from "lucide-react";

type Pillar = { icon: LucideIcon; title: string; desc: string };

const pillars: Pillar[] = [
  { icon: Zap, title: "Same-Day Repairs", desc: "Most fixes done in under an hour while you wait." },
  { icon: DollarSign, title: "Fair Pricing", desc: "No hidden fees. We quote before we fix — always." },
  { icon: ShieldCheck, title: "1-Year Warranty", desc: "Every repair backed by our 12-month guarantee." },
  { icon: Users, title: "Walk-Ins Welcome", desc: "No appointment needed. Just come on in." },
  { icon: GraduationCap, title: "UC Davis Students", desc: "Proudly serving Aggies and the Davis community." },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-3xl md:text-4xl text-center mb-14 tracking-tight"
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
