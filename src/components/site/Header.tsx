import { useRouterState } from "@tanstack/react-router";
import { SiteLink } from "./SiteLink";
import { useEffect, useState } from "react";
import { assets } from "@/lib/assets";
import { type Lang, type PageKey, routes, makeT, switchLangPath } from "@/i18n";

const NAV: { key: PageKey; label: string }[] = [
  { key: "marketplace", label: "nav.marketplace" },
  { key: "brand", label: "nav.brand" },
  { key: "advertiser", label: "nav.advertiser" },
  { key: "creator", label: "nav.creator" },
  { key: "about", label: "nav.about" },
  { key: "careers", label: "nav.careers" },
  { key: "blog", label: "nav.blog" },
];

export function Header({ lang, dark = false }: { lang: Lang; dark?: boolean }) {
  const t = makeT(lang);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);


  const isActive = (key: PageKey) => {
    const target = routes[key][lang];
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  const langSwitch = (
    <div className="lang-switch">
      <SiteLink to={switchLangPath(pathname, "vi")} className={lang === "vi" ? "active" : ""}>
        VI
      </SiteLink>
      <SiteLink to={switchLangPath(pathname, "en")} className={lang === "en" ? "active" : ""}>
        EN
      </SiteLink>
    </div>
  );

  return (
    <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
      <div className="wrap-header">
        <SiteLink className="logo" to={routes.home[lang]}>
          <img src={assets.logoDark} alt="ADFI" />
        </SiteLink>
        <nav className="nav-pill">
          {NAV.map((item) => (
            <SiteLink
              key={item.key}
              to={routes[item.key][lang]}
              className={isActive(item.key) ? "active" : ""}
            >
              {t(item.label)}
            </SiteLink>
          ))}
        </nav>
        <div className="header-actions">
          {langSwitch}
          <a className="btn-contact" href="#contact">
            {t("nav.contact")}
          </a>
        </div>
        <button
          className={dark ? "nav-toggle nav-toggle-dark" : "nav-toggle"}
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div className="mobile-menu">
        <nav>
          {NAV.map((item) => (
            <SiteLink
              key={item.key}
              to={routes[item.key][lang]}
              className={isActive(item.key) ? "active" : ""}
            >
              {t(item.label)}
            </SiteLink>
          ))}
        </nav>
        {langSwitch}
        <a className="btn-contact" href="#contact" onClick={() => setOpen(false)}>
          {t("nav.contact")}
        </a>
      </div>
    </header>
  );
}
