const reviews = [
  {
    name: "Sarah M.",
    stars: 5,
    text: "Came in with a cracked iPhone 14 screen and it was fixed in under an hour. Price was way better than going to Apple. Friendly staff — highly recommend!",
  },
  {
    name: "Jake T.",
    stars: 5,
    text: "My battery was dying so fast I couldn't make it through the day. They replaced it in 30 minutes flat. Great price, great service. Will definitely be back.",
  },
  {
    name: "Priya K.",
    stars: 5,
    text: "Dropped my phone in the sink and brought it here. They saved it — I was sure it was gone. Honest pricing and they kept me updated the whole time.",
  },
  {
    name: "Chris L.",
    stars: 5,
    text: "Fixed my charging port same day. The 1-year warranty is the real deal — no one else in Davis offers that. Fast, affordable, and zero attitude.",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Rating badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5">
            <span className="text-5xl font-extrabold text-slate-900">4.6</span>
            <div>
              <div className="text-yellow-400 text-2xl leading-none mb-1">
                ★★★★★
              </div>
              <div className="text-slate-500 text-sm font-medium">
                131 Google Reviews
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-10">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
            >
              <div className="text-yellow-400 text-lg mb-3">
                {"★".repeat(r.stars)}
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">
                &ldquo;{r.text}&rdquo;
              </p>
              <p className="text-slate-900 font-semibold text-sm">
                — {r.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
