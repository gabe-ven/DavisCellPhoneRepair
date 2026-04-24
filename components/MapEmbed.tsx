export default function MapEmbed() {
  return (
    <section id="map" className="w-full h-80 md:h-96">
      <iframe
        title="Davis Cell Phone Repair location"
        src="https://maps.google.com/maps?q=1818+2nd+St+Davis+CA+95616&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
      />
    </section>
  );
}
