const items = [
  "DONE IN UNDER AN HOUR",
  "12-MONTH WARRANTY",
  "NO APPOINTMENT NEEDED",
  "FREE DIAGNOSIS",
  "UPFRONT PRICING",
  "STUDENT DISCOUNT",
];

function TickerRow() {
  return (
    <div className="v2-ticker-row">
      {items.map((it, i) => (
        <span key={i}>
          {it}
          <span className="v2-ticker-star"> ✦</span>
        </span>
      ))}
    </div>
  );
}

export default function TrustBar() {
  return (
    <div className="v2-ticker">
      <div className="v2-ticker-track">
        <TickerRow />
        <TickerRow />
        <TickerRow />
      </div>
    </div>
  );
}
