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
          <a className="btn-white" href="#lead-form">
            {t("cta.button")} <ArrowIcon />
          </a>
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
              <a href="#" aria-label="Facebook">
                <svg width="7" height="14" viewBox="0 0 7 14" fill="currentColor">
                  <path d="M1.78695 14V7.43079H1.46697e-05V5.06556H1.78695V3.04535C1.78695 1.45785 2.84251 0 5.27472 0C6.25948 0 6.98767 0.09177 6.98767 0.09177L6.9303 2.30049C6.9303 2.30049 6.18766 2.29347 5.37726 2.29347C4.50017 2.29347 4.35965 2.68638 4.35965 3.33851V5.06556H7.00002L6.88513 7.43079H4.35965V14H1.78695Z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="16" height="15" viewBox="0 0 16 15" fill="currentColor">
                  <path d="M3.63269 15V4.87947H0.202386V15H3.63269ZM1.91798 3.49686C3.11419 3.49686 3.85877 2.71972 3.85877 1.74856C3.83648 0.755501 3.11423 -6.37172e-05 1.94068 -6.37172e-05C0.767312 -6.37172e-05 0 0.755516 0 1.74856C0 2.71977 0.744398 3.49686 1.89559 3.49686H1.91787H1.91798ZM5.53135 15H8.96165V9.34818C8.96165 9.0457 8.98394 8.74354 9.07452 8.52732C9.32251 7.92298 9.88693 7.29706 10.8345 7.29706C12.0758 7.29706 12.5724 8.22514 12.5724 9.58564V14.9999H16.0025V9.19689C16.0025 6.08827 14.3101 4.64187 12.0532 4.64187C10.2027 4.64187 9.39021 5.6562 8.93883 6.34705H8.96173V4.87926H5.53143C5.57644 5.82891 5.53143 14.9997 5.53143 14.9997L5.53135 15Z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor">
                  <path d="M8.00331 4.95732C5.73189 4.95732 3.89975 6.76084 3.89975 8.99677C3.89975 11.2327 5.73189 13.0362 8.00331 13.0362C10.2747 13.0362 12.1069 11.2327 12.1069 8.99677C12.1069 6.76084 10.2747 4.95732 8.00331 4.95732ZM8.00331 11.6229C6.53546 11.6229 5.33546 10.4452 5.33546 8.99677C5.33546 7.54834 6.53189 6.3706 8.00331 6.3706C9.47474 6.3706 10.6712 7.54834 10.6712 8.99677C10.6712 10.4452 9.47117 11.6229 8.00331 11.6229V11.6229ZM13.2319 4.79209C13.2319 5.31592 12.8033 5.73428 12.2747 5.73428C11.7426 5.73428 11.3176 5.3124 11.3176 4.79209C11.3176 4.27178 11.7462 3.8499 12.2747 3.8499C12.8033 3.8499 13.2319 4.27178 13.2319 4.79209ZM15.9497 5.74834C15.889 4.48623 15.5962 3.36826 14.6569 2.44717C13.7212 1.52607 12.5855 1.23779 11.3033 1.17451C9.98189 1.10068 6.02117 1.10068 4.69975 1.17451C3.42118 1.23428 2.28546 1.52256 1.34618 2.44365C0.406892 3.36474 0.117606 4.48271 0.0533203 5.74482C-0.0216797 7.0456 -0.0216797 10.9444 0.0533203 12.2452C0.114035 13.5073 0.406892 14.6253 1.34618 15.5464C2.28546 16.4675 3.4176 16.7558 4.69975 16.819C6.02117 16.8929 9.98189 16.8929 11.3033 16.819C12.5855 16.7593 13.7212 16.471 14.6569 15.5464C15.5926 14.6253 15.8855 13.5073 15.9497 12.2452C16.0247 10.9444 16.0247 7.04912 15.9497 5.74834V5.74834ZM14.2426 13.6409C13.964 14.33 13.4247 14.8608 12.7212 15.1386C11.6676 15.5499 9.1676 15.455 8.00331 15.455C6.83903 15.455 4.33546 15.5464 3.28546 15.1386C2.58546 14.8643 2.04618 14.3335 1.76403 13.6409C1.34618 12.6038 1.44261 10.1429 1.44261 8.99677C1.44261 7.85068 1.34975 5.38623 1.76403 4.35263C2.0426 3.66357 2.58189 3.13271 3.28546 2.85498C4.33903 2.44365 6.83903 2.53857 8.00331 2.53857C9.1676 2.53857 11.6712 2.44717 12.7212 2.85498C13.4212 3.1292 13.9605 3.66006 14.2426 4.35263C14.6605 5.38974 14.564 7.85068 14.564 8.99677C14.564 10.1429 14.6605 12.6073 14.2426 13.6409Z" />
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
                  <a href="#">{t("footer.blog")}</a>
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
