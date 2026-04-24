"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { MapPin, Clock, Phone } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      body: new FormData(e.currentTarget),
      headers: { Accept: "application/json" },
    });
    setLoading(false);
    setSubmitted(true);
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow";

  return (
    <section id="contact" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-3xl md:text-4xl text-slate-900 text-center mb-14 tracking-tight"
          style={{ fontWeight: 900 }}
        >
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div
            className="bg-white rounded-2xl p-8 shadow-sm"
            style={{ border: "1.5px solid #e5e7eb" }}
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="#16a34a" strokeWidth={2.5}>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Got it!</h3>
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
                  className={inputClass}
                  style={{ ["--tw-ring-color" as string]: "#2563eb" }}
                />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Phone Number"
                  className={inputClass}
                />
                <input
                  name="device"
                  required
                  placeholder="Device (e.g. iPhone 14, Samsung S23)"
                  className={inputClass}
                />
                <textarea
                  name="issue"
                  required
                  placeholder="What's the issue?"
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="text-white font-bold py-4 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 text-base"
                  style={{ background: "#2563eb", boxShadow: "0 0 24px rgba(37,99,235,0.3)" }}
                >
                  {loading ? "Sending…" : "Submit Request"}
                </button>
              </form>
            )}
          </div>

          {/* Info + shop photo */}
          <div className="flex flex-col gap-6">
            {/* Shop photo */}
            <div className="relative rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-100 h-48">
              <Image
                src="/shop.jpg"
                alt="Davis Cell Phone Repair shop interior"
                fill
                className="object-cover"
              />
            </div>

            {/* Contact details */}
            <div
              className="bg-white rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
              style={{ border: "1.5px solid #e5e7eb" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,99,235,0.07)" }}>
                  <MapPin size={16} style={{ color: "#2563eb" }} strokeWidth={2} />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm mb-0.5">Location</div>
                  <div className="text-slate-500 text-sm">1818 2nd St, Davis, CA 95616</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,99,235,0.07)" }}>
                  <Clock size={16} style={{ color: "#2563eb" }} strokeWidth={2} />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm mb-0.5">Hours</div>
                  <div className="text-slate-500 text-sm">Mon – Sat: 10am – 7pm</div>
                  <div className="text-slate-500 text-sm">Sunday: 11am – 6pm</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(22,163,74,0.07)" }}>
                  <Phone size={16} style={{ color: "#16a34a" }} strokeWidth={2} />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm mb-0.5">Phone</div>
                  <a
                    href="tel:+15307534888"
                    className="font-bold text-xl hover:opacity-80 transition-opacity"
                    style={{ color: "#16a34a" }}
                  >
                    (530) 753-4888
                  </a>
                </div>
              </div>

              <a
                href="tel:+15307534888"
                className="text-white font-bold py-3.5 rounded-xl text-center text-base transition-all hover:opacity-90 mt-1"
                style={{ background: "#16a34a" }}
              >
                Call Now — (530) 753-4888
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
