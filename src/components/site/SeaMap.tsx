import { useState } from "react";
import baseAsset from "@/assets/sea-map-base.png.asset.json";
import { COUNTRY_PATHS, MAP_TRANSFORM, MAP_VIEWBOX } from "./sea-map-paths";
import type { Lang } from "@/i18n";

type Country = {
  id: keyof typeof COUNTRY_PATHS;
  name: Record<Lang, string>;
  stats: Record<Lang, string[]>;
  /** tooltip anchor in % of the map box */
  dot: { x: number; y: number };
  align?: "left" | "right";
};

const COUNTRIES: Country[] = [
  {
    id: "vn",
    name: { vi: "Việt Nam", en: "Vietnam" },
    stats: {
      vi: ["TOP 1 Shopee", "$200M+ GMV doanh số 2025", "66M+ đơn hàng mỗi năm"],
      en: ["TOP 1 Shopee", "$200M+ GMV in 2025", "66M+ orders per year"],
    },
    dot: { x: 28.5, y: 28.7 },
  },
  {
    id: "th",
    name: { vi: "Thái Lan", en: "Thailand" },
    stats: {
      vi: ["TOP 3 Lazada", "$45M+ GMV doanh số 2025", "12M+ đơn hàng mỗi năm"],
      en: ["TOP 3 Lazada", "$45M+ GMV in 2025", "12M+ orders per year"],
    },
    dot: { x: 16, y: 26 },
    align: "right",
  },
  {
    id: "my",
    name: { vi: "Malaysia", en: "Malaysia" },
    stats: {
      vi: ["TOP 5 Shopee", "$28M+ GMV doanh số 2025", "7M+ đơn hàng mỗi năm"],
      en: ["TOP 5 Shopee", "$28M+ GMV in 2025", "7M+ orders per year"],
    },
    dot: { x: 20, y: 58 },
    align: "right",
  },
  {
    id: "id",
    name: { vi: "Indonesia", en: "Indonesia" },
    stats: {
      vi: ["TOP 2 TikTok Shop", "$60M+ GMV doanh số 2025", "18M+ đơn hàng mỗi năm"],
      en: ["TOP 2 TikTok Shop", "$60M+ GMV in 2025", "18M+ orders per year"],
    },
    dot: { x: 31, y: 85 },
    align: "right",
  },
  {
    id: "ph",
    name: { vi: "Philippines", en: "Philippines" },
    stats: {
      vi: ["TOP 4 Shopee", "$32M+ GMV doanh số 2025", "9M+ đơn hàng mỗi năm"],
      en: ["TOP 4 Shopee", "$32M+ GMV in 2025", "9M+ orders per year"],
    },
    dot: { x: 58.4, y: 34.8 },
  },
];

export function SeaMap({ lang, className }: { lang: Lang; className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={`sea-map ${className ?? ""}`}>
      <img
        className="sea-map__img"
        src={baseAsset.url}
        alt={lang === "vi" ? "Bản đồ Đông Nam Á" : "Southeast Asia map"}
        loading="lazy"
      />
      <svg className="sea-map__svg" viewBox={MAP_VIEWBOX} role="presentation">
        <g transform={MAP_TRANSFORM}>
          {COUNTRIES.map((c) => (
            <path
              key={c.id}
              className={`sea-map__country${active === c.id ? " is-active" : ""}`}
              d={COUNTRY_PATHS[c.id]}
              tabIndex={0}
              role="button"
              aria-label={c.name[lang]}
              onMouseEnter={() => setActive(c.id)}
              onMouseLeave={() => setActive((p) => (p === c.id ? null : p))}
              onFocus={() => setActive(c.id)}
              onBlur={() => setActive((p) => (p === c.id ? null : p))}
            />
          ))}
        </g>
      </svg>
      {COUNTRIES.map((c) => (
        <div
          key={c.id}
          className={`sea-map__card sea-map__card--${c.align ?? "left"}${active === c.id ? " is-open" : ""}`}
          style={{ left: `${c.dot.x}%`, top: `${c.dot.y}%` }}
          aria-hidden={active !== c.id}
        >
          <span className="sea-map__pin" />
          <div className="sea-map__panel">
            <div className="sea-map__name">{c.name[lang]}</div>
            <ul>
              {c.stats[lang].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
