import { useState } from "react";
import mapAsset from "@/assets/sea-map-interactive.png.asset.json";
import type { Lang } from "@/i18n";

type Country = {
  id: string;
  name: Record<Lang, string>;
  stats: Record<Lang, string[]>;
  /** hotspot box in % of the map image */
  box: { left: number; top: number; width: number; height: number };
  /** tooltip anchor in % of the map image */
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
    box: { left: 37.5, top: 18, width: 7.5, height: 30 },
    dot: { x: 42, y: 32 },
  },
  {
    id: "th",
    name: { vi: "Thái Lan", en: "Thailand" },
    stats: {
      vi: ["TOP 3 Lazada", "$45M+ GMV doanh số 2025", "12M+ đơn hàng mỗi năm"],
      en: ["TOP 3 Lazada", "$45M+ GMV in 2025", "12M+ orders per year"],
    },
    box: { left: 30, top: 24, width: 7, height: 26 },
    dot: { x: 34, y: 34 },
    align: "right",
  },
  {
    id: "my",
    name: { vi: "Malaysia", en: "Malaysia" },
    stats: {
      vi: ["TOP 5 Shopee", "$28M+ GMV doanh số 2025", "7M+ đơn hàng mỗi năm"],
      en: ["TOP 5 Shopee", "$28M+ GMV in 2025", "7M+ orders per year"],
    },
    box: { left: 44, top: 52, width: 12, height: 14 },
    dot: { x: 50, y: 58 },
  },
  {
    id: "id",
    name: { vi: "Indonesia", en: "Indonesia" },
    stats: {
      vi: ["TOP 2 TikTok Shop", "$60M+ GMV doanh số 2025", "18M+ đơn hàng mỗi năm"],
      en: ["TOP 2 TikTok Shop", "$60M+ GMV in 2025", "18M+ orders per year"],
    },
    box: { left: 28, top: 66, width: 26, height: 20 },
    dot: { x: 38, y: 74 },
    align: "right",
  },
  {
    id: "ph",
    name: { vi: "Philippines", en: "Philippines" },
    stats: {
      vi: ["TOP 4 Shopee", "$32M+ GMV doanh số 2025", "9M+ đơn hàng mỗi năm"],
      en: ["TOP 4 Shopee", "$32M+ GMV in 2025", "9M+ orders per year"],
    },
    box: { left: 54, top: 26, width: 10, height: 28 },
    dot: { x: 60, y: 40 },
  },
];

export function SeaMap({ lang, className }: { lang: Lang; className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={`sea-map ${className ?? ""}`}>
      <img
        className="sea-map__img"
        src={mapAsset.url}
        alt={lang === "vi" ? "Bản đồ Đông Nam Á" : "Southeast Asia map"}
        loading="lazy"
      />
      {COUNTRIES.map((c) => {
        const open = active === c.id;
        return (
          <div key={c.id}>
            <button
              type="button"
              className={`sea-map__hit${open ? " is-active" : ""}`}
              style={{
                left: `${c.box.left}%`,
                top: `${c.box.top}%`,
                width: `${c.box.width}%`,
                height: `${c.box.height}%`,
              }}
              aria-label={c.name[lang]}
              onMouseEnter={() => setActive(c.id)}
              onMouseLeave={() => setActive((p) => (p === c.id ? null : p))}
              onFocus={() => setActive(c.id)}
              onBlur={() => setActive((p) => (p === c.id ? null : p))}
            />
            <div
              className={`sea-map__card sea-map__card--${c.align ?? "left"}${open ? " is-open" : ""}`}
              style={{ left: `${c.dot.x}%`, top: `${c.dot.y}%` }}
              aria-hidden={!open}
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
          </div>
        );
      })}
    </div>
  );
}
