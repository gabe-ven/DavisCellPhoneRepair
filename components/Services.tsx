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
    <section id="services" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl text-slate-900 mb-3 tracking-tight"
            style={{ fontWeight: 900 }}
          >
            What We Fix
          </h2>
          <p className="text-slate-500 text-lg">
            Transparent pricing. No hidden fees. Most repairs done while you
            wait.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {repairs.map(({ icon: Icon, name, price, time }) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200 group"
              style={{ border: "1.5px solid #e5e7eb" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200"
                style={{ background: "rgba(37,99,235,0.08)" }}
              >
                <Icon size={20} style={{ color: "#2563eb" }} strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">
                {name}
              </h3>
              <div
                className="font-bold text-lg mb-2"
                style={{ color: "#2563eb" }}
              >
                {price}
              </div>
              <div className="text-slate-400 text-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                {time}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-sm mt-10">
          Don&apos;t see your device?{" "}
          <a
            href="tel:+15307534888"
            className="font-semibold hover:underline"
            style={{ color: "#2563eb" }}
          >
            Call us
          </a>{" "}
          — we likely fix it.
        </p>
      </div>
    </section>
  );
}
