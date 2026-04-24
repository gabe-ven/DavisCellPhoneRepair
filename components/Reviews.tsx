function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill="#facc15"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const reviews = [
  {
    name: "Sarah M.",
    text: "Came in with a cracked iPhone 14 screen and it was fixed in under an hour. Price was way better than going to Apple. Friendly staff — highly recommend!",
  },
  {
    name: "Jake T.",
    text: "My battery was dying so fast I couldn't make it through the day. They replaced it in 30 minutes flat. Great price, great service. Will definitely be back.",
  },
  {
    name: "Priya K.",
    text: "Dropped my phone in the sink and brought it here. They saved it — I was sure it was gone. Honest pricing and they kept me updated the whole time.",
  },
  {
    name: "Chris L.",
    text: "Fixed my charging port same day. The 1-year warranty is the real deal — no one else in Davis offers that. Fast, affordable, and zero attitude.",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Rating badge */}
        <div className="flex justify-center mb-10">
          <div
            className="inline-flex items-center gap-5 rounded-2xl px-8 py-5"
            style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
          >
            <span
              className="text-5xl text-slate-900 tracking-tight"
              style={{ fontWeight: 900 }}
            >
              4.6
            </span>
            <div>
              <StarRating count={5} />
              <div className="text-slate-500 text-sm font-medium mt-1">
                131 Google Reviews
              </div>
            </div>
          </div>
        </div>

        <h2
          className="text-3xl md:text-4xl text-slate-900 text-center mb-10 tracking-tight"
          style={{ fontWeight: 900 }}
        >
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl p-6"
              style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
            >
              <StarRating />
              <p className="text-slate-700 my-4 leading-relaxed text-[15px]">
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
