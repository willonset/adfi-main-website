import { SiteLayout } from "./SiteLayout";
import { StaticHtml, getPageContent } from "./StaticHtml";
import { LeadForm } from "./LeadForm";
import type { Lang } from "@/i18n";

export function StaticPage({
  lang,
  page,
  role,
}: {
  lang: Lang;
  page: string;
  role?: string;
}) {
  const { before, after } = getPageContent(lang, page);
  return (
    <SiteLayout lang={lang}>
      <StaticHtml html={before} lang={lang} />
      <LeadForm lang={lang} defaultRole={role} />
      <StaticHtml html={after} lang={lang} />
    </SiteLayout>
  );

}
