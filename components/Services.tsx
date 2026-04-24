const repairs = [
  { icon: "📱", name: "iPhone Screen", price: "$79 – $149", time: "~1 hour" },
  { icon: "📲", name: "Android Screen", price: "$69 – $129", time: "~1–2 hours" },
  { icon: "🔋", name: "Battery Replacement", price: "$49 – $79", time: "~30 min" },
  { icon: "⚡", name: "Charging Port", price: "$59 – $89", time: "~1 hour" },
  { icon: "💧", name: "Water Damage", price: "$89 – $149", time: "24–48 hours" },
  { icon: "📷", name: "Camera Repair", price: "$59 – $99", time: "~1–2 hours" },
  { icon: "🔙", name: "Back Glass", price: "$79 – $129", time: "~1–2 hours" },
  { icon: "🔊", name: "Speaker / Mic", price: "$49 – $79", time: "~1 hour" },
];

export default function Services() {
  return (
    <section id="services" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            What We Fix
          </h2>
          <p className="text-slate-500 text-lg">
            Transparent pricing. No hidden fees. Most repairs done while you
            wait.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {repairs.map((r) => (
            <div
              key={r.name}
              className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">{r.icon}</div>
              <h3 className="font-semibold text-slate-900 text-lg mb-1">
                {r.name}
              </h3>
              <div className="text-blue-600 font-bold text-lg mb-2">
                {r.price}
              </div>
              <div className="text-slate-400 text-sm flex items-center gap-1">
                <span>⏱</span>
                <span>{r.time}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          Don&apos;t see your device?{" "}
          <a
            href="tel:+15307534888"
            className="text-blue-600 font-medium hover:underline"
          >
            Call us
          </a>{" "}
          — we likely fix it.
        </p>
      </div>
    </section>
  );
}
