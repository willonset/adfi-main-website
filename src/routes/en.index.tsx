import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/en")({
  head: () => ({
    meta: [
      { title: "ADFI — Southeast Asia Affiliate Marketing Ecosystem" },
      { name: "description", content: "Grow sustainably with ADFI: performance advertising, MCN networks and livestream commerce for marketplaces, brands, advertisers and creators." },
      { property: "og:title", content: "ADFI — Southeast Asia Affiliate Marketing Ecosystem" },
      { property: "og:description", content: "Grow sustainably with ADFI: performance advertising, MCN networks and livestream commerce for marketplaces, brands, advertisers and creators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <StaticPage lang="en" page="index" />;
}
