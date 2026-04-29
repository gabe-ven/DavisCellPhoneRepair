export default function Footer() {
  return (
    <footer className="v2-footer">
      <div className="container">
        <div className="v2-footer-mast">
          <div className="v2-footer-davis serif-it">Davis</div>
          <div className="v2-footer-sub">CELL · PHONE · REPAIR</div>
        </div>
        <div className="v2-footer-rule" />
        <div className="v2-footer-grid">
          <div>
            <div className="micro">VISIT</div>
            <div className="v2-footer-val">140 B St, Suite 4<br />Davis, CA 95616</div>
          </div>
          <div>
            <div className="micro">CALL</div>
            <a href="tel:+15303413384" className="v2-footer-val v2-footer-link">(530) 341-3384</a>
          </div>
          <div>
            <div className="micro">HOURS</div>
            <div className="v2-footer-val mono" style={{ fontSize: 13 }}>MON–SAT · 10A–6P<br />SUNDAY · 12P–4P</div>
          </div>
          <div>
            <div className="micro">FIND US</div>
            <div className="v2-footer-val">Google · Yelp</div>
          </div>
        </div>
        <div className="v2-footer-rule" />
        <div className="v2-footer-fine mono micro">
          <span>© 2017–{new Date().getFullYear()} DAVIS CELL PHONE REPAIR · ALL REPAIRS WARRANTIED</span>
          <span className="hide-sm">FAMILY-OWNED · DAVIS, CA · ★ 4.6 / 131 REVIEWS</span>
        </div>
      </div>
    </footer>
  );
}
