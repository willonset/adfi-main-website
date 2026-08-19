import type { ReactNode } from "react";
import { SiteLayout } from "./SiteLayout";
import { StaticHtml, getPageContent } from "./StaticHtml";
import { LeadForm } from "./LeadForm";
import type { Lang } from "@/i18n";

export function StaticPage({
  lang,
  page,
  role,
  bottom,
}: {
  lang: Lang;
  page: string;
  role?: string;
  bottom?: ReactNode;
}) {
  const { before, after } = getPageContent(lang, page);
  return (
    <SiteLayout lang={lang}>
      <StaticHtml html={before} />
      <LeadForm lang={lang} defaultRole={role} />
      <StaticHtml html={after} />
      {bottom}
    </SiteLayout>
  );
}
