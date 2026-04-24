"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section id="contact" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Got it!
                </h3>
                <p className="text-slate-500">
                  We&apos;ll call or text you back shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  name="name"
                  required
                  placeholder="Your Name"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Phone Number"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="device"
                  required
                  placeholder="Device (e.g. iPhone 14, Samsung S23)"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="issue"
                  required
                  placeholder="What's the issue?"
                  rows={4}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-60 text-lg"
                >
                  {loading ? "Sending…" : "Submit Request"}
                </button>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div className="flex flex-col gap-8 justify-center">
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                📍 Location
              </h3>
              <p className="text-slate-600">1818 2nd St, Davis, CA 95616</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                🕐 Hours
              </h3>
              <p className="text-slate-600">Mon – Sat: 10am – 7pm</p>
              <p className="text-slate-600">Sunday: 11am – 6pm</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                📞 Phone
              </h3>
              <a
                href="tel:+15307534888"
                className="text-blue-600 font-bold text-2xl hover:underline"
              >
                (530) 753-4888
              </a>
            </div>
            <a
              href="tel:+15307534888"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-center text-lg transition-colors"
            >
              Call Now — (530) 753-4888
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
