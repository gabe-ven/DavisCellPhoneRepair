import { Zap, DollarSign, ShieldCheck, Users, GraduationCap } from "lucide-react";
import { LucideIcon } from "lucide-react";

type Pillar = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const pillars: Pillar[] = [
  {
    icon: Zap,
    title: "Same-Day Repairs",
    desc: "Most fixes done in under an hour while you wait.",
  },
  {
    icon: DollarSign,
    title: "Fair Pricing",
    desc: "No hidden fees. We quote before we fix — always.",
  },
  {
    icon: ShieldCheck,
    title: "1-Year Warranty",
    desc: "Every repair backed by our 12-month guarantee.",
  },
  {
    icon: Users,
    title: "Walk-Ins Welcome",
    desc: "No appointment needed. Just come on in.",
  },
  {
    icon: GraduationCap,
    title: "UC Davis Students",
    desc: "Proudly serving Aggies and the Davis community.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-3xl md:text-4xl text-slate-900 text-center mb-14 tracking-tight"
          style={{ fontWeight: 900 }}
        >
          Why Davis Chooses Us
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              style={{ border: "1.5px solid #f1f5f9" }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(37,99,235,0.07)" }}
              >
                <Icon size={22} style={{ color: "#2563eb" }} strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base leading-snug">
                {title}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
