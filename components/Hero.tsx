export default function Hero() {
  return (
    <section id="hero" className="bg-slate-900 text-white py-24 md:py-36 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Google review badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-8">
          <span className="text-yellow-400 text-sm tracking-wide">★★★★★</span>
          <span className="text-white/90 text-sm font-medium">
            4.6 · 131 Google Reviews
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5 tracking-tight">
          Davis&apos; #1 Rated
          <br />
          Phone Repair Shop
        </h1>

        <p className="text-lg md:text-xl text-white/65 mb-10 max-w-xl mx-auto leading-relaxed">
          Most repairs done same day while you wait. Walk-ins always welcome.
          Prices you&apos;ll actually like.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="bg-white text-slate-900 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Get a Quote
          </a>
          <a
            href="tel:+15307534888"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors"
          >
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
