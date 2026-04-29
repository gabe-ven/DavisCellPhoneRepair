import RepairWizardV2 from "./ServicesSection/RepairWizardV2";

export default function Services() {
  return (
    <section id="services" className="v2-services grain v2-section">
      <div className="container">
        <div className="v2-section-head">
          <div className="mono micro muted">01 — WHAT WE FIX</div>
          <h2 className="v2-section-title">
            <span className="serif-it">Tell us what&apos;s broken.</span>
            <br />
            <span className="serif-r">We&apos;ll quote you in seconds.</span>
          </h2>
          <p className="v2-section-lede">
            Pick your device and the issue. We&apos;ll give you an honest range up front — and a confirmed quote within the hour during shop hours.
          </p>
        </div>
        <div className="v2-wizard-stage">
          <RepairWizardV2 />
        </div>
      </div>
    </section>
  );
}
