"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
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
  {
    name: "Marcus D.",
    text: "As a student I was worried about the cost, but the price was totally fair. They fixed my screen while I grabbed lunch and it looked brand new when I got back.",
  },
  {
    name: "Emily R.",
    text: "I've been here twice now — once for a screen, once for a battery. Both times were fast, cheap, and hassle-free. This is the only place I'll go in Davis.",
  },
  {
    name: "Tom N.",
    text: "My roommate recommended this place and I'm so glad he did. Fixed my back glass same day. The shop is clean, the staff is knowledgeable, and no upselling whatsoever.",
  },
  {
    name: "Aisha B.",
    text: "They diagnosed my phone for free and were upfront that it might not be fixable. It ended up being fine and they only charged me for the repair. Really trustworthy.",
  },
  {
    name: "Ryan C.",
    text: "Walked in on a Saturday morning with a completely shattered screen. Was out the door in 45 minutes with a phone that looked like it just came out of the box. Incredible.",
  },
  {
    name: "Jasmine H.",
    text: "Camera was blurry and kept crashing the app. They swapped the module and it's sharper than ever. Cheaper than any other quote I got. Come here first — save yourself time.",
  },
  {
    name: "Daniel W.",
    text: "Brought in my Galaxy S22 with a busted screen. Other shops said 3 days, these guys did it in 90 minutes. Quality feels OEM. Can't ask for more.",
  },
  {
    name: "Lily T.",
    text: "The staff actually explained what was wrong before touching anything. No surprise charges. Got my phone back the same afternoon. 10/10 experience, will tell everyone.",
  },
];

export default function Reviews() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fading, setFading] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (fading) return;
      setFading(true);
      setTimeout(() => {
        setCurrent((index + reviews.length) % reviews.length);
        setFading(false);
      }, 250);
    },
    [fading]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  }

  const r = reviews[current];

  return (
    <section id="reviews" className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Rating badge */}
        <div className="flex justify-center mb-10">
          <div
            className="inline-flex items-center gap-5 rounded-2xl px-8 py-5"
            style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
          >
            <span className="text-5xl text-slate-900 tracking-tight" style={{ fontWeight: 900 }}>
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

        {/* Carousel */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Card */}
          <div
            className="rounded-2xl p-8 md:p-10 min-h-[220px] flex flex-col justify-between transition-opacity duration-[250ms]"
            style={{
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              opacity: fading ? 0 : 1,
            }}
          >
            <div>
              <StarRating />
              <p className="text-slate-700 mt-5 mb-6 leading-relaxed text-[16px] md:text-[17px]">
                &ldquo;{r.text}&rdquo;
              </p>
            </div>
            <p className="text-slate-900 font-semibold text-sm">— {r.name}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            {/* Prev */}
            <button
              onClick={prev}
              aria-label="Previous review"
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 20 : 8,
                    height: 8,
                    background: i === current ? "#2563eb" : "#cbd5e1",
                  }}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={next}
              aria-label="Next review"
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Count */}
          <p className="text-center text-slate-400 text-xs mt-4">
            {current + 1} of {reviews.length}
          </p>
        </div>
      </div>
    </section>
  );
}
