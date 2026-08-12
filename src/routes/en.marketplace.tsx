import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/en/marketplace")({
  head: () => ({
    meta: [
      { title: "Solutions for Marketplaces | ADFI" },
      { name: "description", content: "Grow marketplace GMV with high-quality off-platform traffic from ADFI’s advertising and MCN ecosystem." },
      { property: "og:title", content: "Solutions for Marketplaces | ADFI" },
      { property: "og:description", content: "Grow marketplace GMV with high-quality off-platform traffic from ADFI’s advertising and MCN ecosystem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <StaticPage lang="en" page="marketplace" role="Marketplace" />;
}
