function StarRating() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="#facc15" className="w-4 h-4" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const reviews = [
  {
    name: "Sarah M.",
    text: "Came in with a cracked iPhone 14 screen and it was fixed in under an hour. Way cheaper than Apple. Friendly staff — highly recommend!",
  },
  {
    name: "Jake T.",
    text: "Battery was dying so fast I couldn't make it through the day. Replaced in 30 minutes flat. Great price, great service. Will definitely be back.",
  },
  {
    name: "Priya K.",
    text: "Dropped my phone in the sink. Brought it here and they saved it — I was sure it was gone. Honest pricing and kept me updated the whole time.",
  },
  {
    name: "Chris L.",
    text: "Fixed my charging port same day. The 1-year warranty is the real deal — no one else in Davis offers that. Fast, affordable, zero attitude.",
  },
  {
    name: "Marcus D.",
    text: "As a student I was worried about cost, but the price was totally fair. They fixed my screen while I grabbed lunch and it looked brand new.",
  },
  {
    name: "Emily R.",
    text: "Been here twice — once for a screen, once for a battery. Both times fast, cheap, and hassle-free. Only place I'll go in Davis.",
  },
  {
    name: "Tom N.",
    text: "My roommate recommended this place and I'm so glad he did. Fixed my back glass same day. Clean shop, knowledgeable staff, no upselling.",
  },
  {
    name: "Aisha B.",
    text: "They diagnosed my phone for free and were upfront about the options. Only charged me for the repair. Really trustworthy shop.",
  },
  {
    name: "Ryan C.",
    text: "Walked in Saturday morning with a completely shattered screen. Out the door in 45 minutes with a phone that looked like it just came out of the box.",
  },
  {
    name: "Jasmine H.",
    text: "Camera was blurry and kept crashing. They swapped the module and it's sharper than ever. Cheaper than any other quote I got.",
  },
  {
    name: "Daniel W.",
    text: "Brought in my Galaxy S22 with a busted screen. Other shops said 3 days — these guys did it in 90 minutes. Quality feels OEM.",
  },
  {
    name: "Lily T.",
    text: "Staff explained what was wrong before touching anything. No surprise charges. Got my phone back the same afternoon. 10/10, will tell everyone.",
  },
];

// Duplicate so the loop seams invisibly
const doubled = [...reviews, ...reviews];

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 bg-white overflow-hidden">
      {/* Rating badge */}
      <div className="flex justify-center mb-10 px-4">
        <div
          className="inline-flex items-center gap-5 rounded-2xl px-8 py-5"
          style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
        >
          <span className="text-5xl text-slate-900 tracking-tight" style={{ fontWeight: 900 }}>
            4.6
          </span>
          <div>
            <StarRating />
            <div className="text-slate-500 text-sm font-medium mt-1">
              131 Google Reviews
            </div>
          </div>
        </div>
      </div>

      <h2
        className="text-3xl md:text-4xl text-slate-900 text-center mb-10 tracking-tight px-4"
        style={{ fontWeight: 900 }}
      >
        What Our Customers Say
      </h2>

      {/* Marquee track — fades at edges */}
      <div
        className="marquee-container relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          className="marquee-track flex gap-5"
          style={{
            animation: "marquee 40s linear infinite",
            width: "max-content",
            willChange: "transform",
          }}
        >
          {doubled.map((r, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[320px] md:w-[360px] rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
            >
              <StarRating />
              <p className="text-slate-700 leading-relaxed text-[15px] flex-1">
                &ldquo;{r.text}&rdquo;
              </p>
              <p className="text-slate-900 font-semibold text-sm">— {r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
