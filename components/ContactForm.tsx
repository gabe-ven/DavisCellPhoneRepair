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
    "w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-shadow";
  const inputStyle = {
    border: "1.5px solid #e5e7eb",
    color: "#111111",
  };

  return (
    <section id="contact" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-3xl md:text-4xl text-center mb-14 tracking-tight"
          style={{ fontWeight: 900, color: "#111111", letterSpacing: "-0.02em" }}
        >
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div
            className="bg-white rounded-2xl p-8"
            style={{ border: "1.5px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            {submitted ? (
              <div className="text-center py-12">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(139,26,26,0.07)" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="#8B1A1A" strokeWidth={2.5}>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#111111" }}>Got it!</h3>
                <p style={{ color: "#6b7280" }}>We&apos;ll call or text you back shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input name="name" required placeholder="Your Name" className={inputClass} style={inputStyle} />
                <input name="phone" type="tel" required placeholder="Phone Number" className={inputClass} style={inputStyle} />
                <input name="device" required placeholder="Device (e.g. iPhone 14, Samsung S23)" className={inputClass} style={inputStyle} />
                <textarea
                  name="issue"
                  required
                  placeholder="What's the issue?"
                  rows={4}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-crimson text-white font-bold py-4 rounded-lg disabled:opacity-50 text-base"
                  style={{ boxShadow: "0 4px 20px rgba(139,26,26,0.25)" }}

                >
                  {loading ? "Sending…" : "Submit Request"}
                </button>
              </form>
            )}
          </div>

          {/* Info + photo */}
          <div className="flex flex-col gap-6">
            <div className="relative rounded-2xl overflow-hidden h-48" style={{ border: "1.5px solid #e5e7eb" }}>
              <Image src="/shop.jpg" alt="Davis Cell Phone Repair shop interior" fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "#8B1A1A" }} />
            </div>

            <div
              className="bg-white rounded-2xl p-6 flex flex-col gap-5"
              style={{ border: "1.5px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              {[
                { icon: MapPin, label: "Location", value: "140 B St Suite 4, Davis, CA 95616", href: undefined },
                { icon: Clock, label: "Hours", value: "Mon – Sat: 10am – 6pm\nSunday: 12pm – 4pm", href: undefined },
                { icon: Phone, label: "Phone", value: "(530) 341-3384", href: "tel:+15303413384" },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(139,26,26,0.07)" }}
                  >
                    <Icon size={16} style={{ color: "#8B1A1A" }} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-0.5" style={{ color: "#111111" }}>{label}</div>
                    {href ? (
                      <a href={href} className="font-bold text-xl hover:opacity-75 transition-opacity" style={{ color: "#8B1A1A" }}>
                        {value}
                      </a>
                    ) : (
                      <div className="text-sm whitespace-pre-line" style={{ color: "#6b7280" }}>{value}</div>
                    )}
                  </div>
                </div>
              ))}

              <a
                href="tel:+15303413384"
                className="btn-crimson text-white font-bold py-3.5 rounded-lg text-center text-base mt-1"
              >
                Call Now — (530) 341-3384
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
