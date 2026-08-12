import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { assets } from "@/lib/assets";
import viPages from "@/content/pages-vi.json";
import enPages from "@/content/pages-en.json";
import type { Lang } from "@/i18n";

type Section = { before: string; after: string };
type PageMap = Record<string, Section>;

const CONTENT: Record<Lang, PageMap> = {
  vi: viPages as PageMap,
  en: enPages as PageMap,
};

export function getPageContent(lang: Lang, page: string): Section {
  return CONTENT[lang][page] ?? { before: "", after: "" };
}

/**
 * Renders the ported static markup and keeps internal anchor clicks on the
 * client router instead of triggering a full page reload.
 */
export function StaticHtml({ html }: { html: string }) {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const anchor = (e.target as HTMLElement).closest("a");
      const href = anchor?.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      e.preventDefault();
      void navigate({ to: href as never });
    },
    [navigate],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const figure = root.querySelector<HTMLElement>(".team-photo");
    const img = figure?.querySelector("img");
    const dots = root.querySelector<HTMLElement>(".team-dots");
    if (!figure || !img || !dots) return;

    const slides = Array.from(
      new Set([
        img.getAttribute("src") ?? "",
        assets.teamBig,
        assets.office1,
        assets.office2,
      ].filter(Boolean)),
    );
    if (slides.length < 2) return;

    let index = 0;
    figure.classList.add("team-photo--slider");

    dots.innerHTML = "";
    const dotEls = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Ảnh ${i + 1}`);
      b.addEventListener("click", () => go(i, true));
      dots.appendChild(b);
      return b;
    });

    const mkArrow = (dir: -1 | 1, label: string, path: string) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `team-nav team-nav--${dir === -1 ? "prev" : "next"}`;
      b.setAttribute("aria-label", label);
      b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="${path}"/></svg>`;
      b.addEventListener("click", () => go(index + dir, true));
      figure.appendChild(b);
      return b;
    };
    const prev = mkArrow(-1, "Ảnh trước", "15 18 9 12 15 6");
    const next = mkArrow(1, "Ảnh tiếp theo", "9 6 15 12 9 18");

    function go(i: number, manual = false) {
      index = (i + slides.length) % slides.length;
      img!.src = slides[index]!;
      dotEls.forEach((d, n) => d.classList.toggle("is-active", n === index));
      if (manual) restart();
    }

    let timer: ReturnType<typeof setInterval>;
    const start = () => {
      timer = setInterval(() => go(index + 1), 3000);
    };
    const restart = () => {
      clearInterval(timer);
      start();
    };
    go(0);
    start();
    figure.addEventListener("mouseenter", () => clearInterval(timer));
    figure.addEventListener("mouseleave", restart);

    return () => {
      clearInterval(timer);
      prev.remove();
      next.remove();
      figure.classList.remove("team-photo--slider");
    };
  }, [html]);

  if (!html) return null;
  return (
    <div
      ref={rootRef}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

