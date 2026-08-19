import { assets } from "@/lib/assets";
import { type Lang, routes, makeT } from "@/i18n";
import { SiteLink } from "./SiteLink";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#010205"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function Footer({ lang }: { lang: Lang }) {
  const t = makeT(lang);
  return (
    <footer className="footer-block" id="contact">
      <div className="cta-wrap">
        <div className="cta-banner">
          <div className="glow">
            <span className="glow-inner">
              <img src={assets.ctaGlow} alt="" />
            </span>
          </div>
          <div className="cta-bloom"></div>
          <div className="cta-noise"></div>
          <h2>{t("cta.title")}</h2>
          <SiteLink className="btn-white" to={routes.careers[lang]}>
            {t("cta.button")} <ArrowIcon />
          </SiteLink>
        </div>
      </div>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <SiteLink className="logo" to={routes.home[lang]}>
              <img src={assets.logoWhite} alt="ADFI" />
            </SiteLink>
            <p>{t("footer.tagline")}</p>
            <div className="socials">
              <a
                href="https://www.facebook.com/adfi.official"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg width="7" height="14" viewBox="0 0 7 14" fill="currentColor">
                  <path d="M1.78695 14V7.43079H1.46697e-05V5.06556H1.78695V3.04535C1.78695 1.45785 2.84251 0 5.27472 0C6.25948 0 6.98767 0.09177 6.98767 0.09177L6.9303 2.30049C6.9303 2.30049 6.18766 2.29347 5.37726 2.29347C4.50017 2.29347 4.35965 2.68638 4.35965 3.33851V5.06556H7.00002L6.88513 7.43079H4.35965V14H1.78695Z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/adfivn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg width="16" height="15" viewBox="0 0 16 15" fill="currentColor">
                  <path d="M3.63269 15V4.87947H0.202386V15H3.63269ZM1.91798 3.49686C3.11419 3.49686 3.85877 2.71972 3.85877 1.74856C3.83648 0.755501 3.11423 -6.37172e-05 1.94068 -6.37172e-05C0.767312 -6.37172e-05 0 0.755516 0 1.74856C0 2.71977 0.744398 3.49686 1.89559 3.49686H1.91787H1.91798ZM5.53135 15H8.96165V9.34818C8.96165 9.0457 8.98394 8.74354 9.07452 8.52732C9.32251 7.92298 9.88693 7.29706 10.8345 7.29706C12.0758 7.29706 12.5724 8.22514 12.5724 9.58564V14.9999H16.0025V9.19689C16.0025 6.08827 14.3101 4.64187 12.0532 4.64187C10.2027 4.64187 9.39021 5.6562 8.93883 6.34705H8.96173V4.87926H5.53143C5.57644 5.82891 5.53143 14.9997 5.53143 14.9997L5.53135 15Z" />
                </svg>
              </a>

            </div>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>{t("footer.solutions")}</h4>
              <ul>
                <li>
                  <SiteLink to={routes.marketplace[lang]}>{t("footer.forMarketplace")}</SiteLink>
                </li>
                <li>
                  <SiteLink to={routes.brand[lang]}>{t("footer.forBrand")}</SiteLink>
                </li>
                <li>
                  <SiteLink to={routes.advertiser[lang]}>{t("footer.forAdvertiser")}</SiteLink>
                </li>
                <li>
                  <SiteLink to={routes.creator[lang]}>{t("footer.forCreator")}</SiteLink>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>{t("footer.company")}</h4>
              <ul>
                <li>
                  <SiteLink to={routes.about[lang]}>{t("footer.about")}</SiteLink>
                </li>
                <li>
                  <SiteLink to={routes.careers[lang]}>{t("footer.careers")}</SiteLink>
                </li>
                <li>
                  <SiteLink to={routes.blog[lang]}>{t("footer.blog")}</SiteLink>
                </li>
                <li>
                  <a href="#contact">{t("footer.support")}</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>{t("footer.contact")}</h4>
              <ul>
                <li>(+84) 123 456 789</li>
                <li>contact@adfi.vn</li>
                <li>Imperia Garden Nguyễn Tuân, Thanh Xuân, Hà Nội</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-watermark">
          <img src={assets.watermark} alt="" />
        </div>
        <div className="footer-bottom">
          <span>{t("footer.rights")}</span>
          <span>{t("footer.policy")}</span>
        </div>
      </div>
    </footer>
  );
}
