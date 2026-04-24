export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-3">Davis Cell Phone Repair</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Davis&apos; #1 rated phone repair shop.
              <br />
              Walk-ins always welcome.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-3">Hours</h3>
            <p className="text-white/60 text-sm">Mon – Sat: 10am – 7pm</p>
            <p className="text-white/60 text-sm">Sunday: 11am – 6pm</p>
          </div>
          <div>
            <h3 className="font-bold mb-3">Contact</h3>
            <p className="text-white/60 text-sm mb-1">
              1818 2nd St, Davis, CA 95616
            </p>
            <a
              href="tel:+15307534888"
              className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
            >
              (530) 753-4888
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-white/40 text-sm">
          © {year} Davis Cell Phone Repair. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
