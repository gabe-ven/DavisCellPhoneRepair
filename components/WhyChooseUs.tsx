const pillars = [
  {
    icon: "⚡",
    title: "Same-Day Repairs",
    desc: "Most fixes done in under an hour while you wait.",
  },
  {
    icon: "💰",
    title: "Fair Pricing",
    desc: "No hidden fees. We quote before we fix — always.",
  },
  {
    icon: "🛡️",
    title: "1-Year Warranty",
    desc: "Every repair backed by our 12-month guarantee.",
  },
  {
    icon: "🚶",
    title: "Walk-Ins Welcome",
    desc: "No appointment needed. Just come on in.",
  },
  {
    icon: "🎓",
    title: "UC Davis Students",
    desc: "Proudly serving Aggies and the Davis community.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
          Why Davis Chooses Us
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100"
            >
              <div className="text-4xl mb-3">{p.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">
                {p.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
