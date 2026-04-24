import { Phone } from "lucide-react";

export default function MobileCallBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4 pt-3"
      style={{
        background: "linear-gradient(to top, rgba(255,255,255,1) 60%, rgba(255,255,255,0))",
      }}
    >
      <a
        href="tel:+15303413384"
        className="flex items-center justify-center gap-2.5 w-full text-white font-bold text-base py-4 rounded-2xl"
        style={{
          background: "#8B1A1A",
          boxShadow: "0 4px 24px rgba(139,26,26,0.35)",
        }}
      >
        <Phone size={18} strokeWidth={2.5} />
        Call Now — (530) 341-3384
      </a>
    </div>
  );
}
