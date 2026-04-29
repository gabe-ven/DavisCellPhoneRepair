const PILLARS = [
  { n: "01", t: "Done in under an hour", d: "Most repairs — screens, batteries, ports — finish while you grab a coffee at Mishka's next door." },
  { n: "02", t: "You hear the price first", d: "Up-front quotes. No surprise add-ons. If we can't fix it, you don't pay a cent." },
  { n: "03", t: "Twelve-month warranty", d: "Every repair is backed for a full year. Something fails? Walk back in. We make it right." },
  { n: "04", t: "No appointment needed", d: "Just walk in. Mon–Sat 10–6, Sun 12–4. Half a mile from campus, two blocks off the Square." },
  { n: "05", t: "UC Davis students welcome", d: "Show your student ID — discount on every repair. We know what midterms with a broken phone feels like." },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="v2-why v2-section">
      <div className="container">
        <div className="v2-section-head">
          <div className="mono micro muted">02 — WHY DAVIS CHOOSES US</div>
          <h2 className="v2-section-title">
            <span className="serif-it">Five reasons </span>
            <span className="serif-r">people keep walking back.</span>
          </h2>
        </div>
        <div className="v2-pillars">
          {PILLARS.map((p) => (
            <div key={p.n} className="v2-pillar">
              <div className="v2-pillar-num">{p.n}</div>
              <div>
                <h3 className="v2-pillar-title">{p.t}</h3>
                <p className="v2-pillar-desc">{p.d}</p>
              </div>
              <div className="v2-pillar-mark mono micro">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
