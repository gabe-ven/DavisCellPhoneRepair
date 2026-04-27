import RepairWizard from "./ServicesSection/RepairWizard";

export default function Services() {
  return (
    <section
      id="services"
      className="py-20 px-4"
      style={{ background: "#f9f9f9" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section heading — matches Reviews / WhyChooseUs treatment */}
        <div className="text-center mb-10">
          <h2
            className="section-heading text-3xl md:text-4xl mb-3 tracking-tight"
            style={{ fontWeight: 900, color: "#111111", letterSpacing: "-0.02em" }}
          >
            What We Fix
          </h2>
          <p style={{ color: "#6b7280" }} className="text-lg">
            Tell us what you have and what&apos;s wrong — get a real quote in under a minute.
          </p>
        </div>

        {/* Wizard housing — white card, brand border, soft shadow (matches site card pattern) */}
        <div
          className="bg-white rounded-xl mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-12"
          style={{
            border: "1.5px solid #e5e7eb",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <RepairWizard />
        </div>

        <p className="text-center text-sm mt-8" style={{ color: "#9ca3af" }}>
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
