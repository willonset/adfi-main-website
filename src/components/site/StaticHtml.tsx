import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
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

  if (!html) return null;
  return <div onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
