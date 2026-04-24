import {
  Smartphone,
  BatteryCharging,
  Plug,
  Droplets,
  Camera,
  Layers,
  Volume2,
  Tablet,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

type Repair = {
  icon: LucideIcon;
  name: string;
  price: string;
  time: string;
};

const repairs: Repair[] = [
  { icon: Smartphone, name: "iPhone Screen", price: "$79 – $149", time: "~1 hour" },
  { icon: Tablet, name: "Android Screen", price: "$69 – $129", time: "~1–2 hours" },
  { icon: BatteryCharging, name: "Battery Replacement", price: "$49 – $79", time: "~30 min" },
  { icon: Plug, name: "Charging Port", price: "$59 – $89", time: "~1 hour" },
  { icon: Droplets, name: "Water Damage", price: "$89 – $149", time: "24–48 hours" },
  { icon: Camera, name: "Camera Repair", price: "$59 – $99", time: "~1–2 hours" },
  { icon: Layers, name: "Back Glass", price: "$79 – $129", time: "~1–2 hours" },
  { icon: Volume2, name: "Speaker / Mic", price: "$49 – $79", time: "~1 hour" },
];

export default function Services() {
  return (
    <section id="services" className="py-20 px-4" style={{ background: "#f9f9f9" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl mb-3 tracking-tight"
            style={{ fontWeight: 900, color: "#111111", letterSpacing: "-0.02em" }}
          >
            What We Fix
          </h2>
          <p style={{ color: "#6b7280" }} className="text-lg">
            Transparent pricing. No hidden fees. Most repairs done while you wait.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {repairs.map(({ icon: Icon, name, price, time }) => (
            <div
              key={name}
              className="card-lift bg-white rounded-xl p-6"
              style={{
                border: "1.5px solid #e5e7eb",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(139,26,26,0.07)" }}
              >
                <Icon size={20} style={{ color: "#8B1A1A" }} strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-base mb-1" style={{ color: "#111111" }}>
                {name}
              </h3>
              <div className="font-bold text-lg mb-2" style={{ color: "#8B1A1A" }}>
                {price}
              </div>
              <div
                className="text-sm flex items-center gap-1.5"
                style={{ color: "#9ca3af" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ background: "#16a34a" }}
                />
                {time}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm mt-10" style={{ color: "#9ca3af" }}>
          Don&apos;t see your device?{" "}
          <a
            href="tel:+15303413384"
            className="font-semibold hover:underline"
            style={{ color: "#8B1A1A" }}
          >
            Call us
          </a>{" "}
          — we likely fix it.
        </p>
      </div>
    </section>
  );
}
