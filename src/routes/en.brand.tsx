import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/en/brand")({
  head: () => ({
    meta: [
      { title: "Solutions for Brands | ADFI" },
      { name: "description", content: "ADFI helps brands grow marketplace sales through affiliate, KOC and livestream commerce across Southeast Asia." },
      { property: "og:title", content: "Solutions for Brands | ADFI" },
      { property: "og:description", content: "ADFI helps brands grow marketplace sales through affiliate, KOC and livestream commerce across Southeast Asia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <StaticPage lang="en" page="brand" role="Brand" />;
}
