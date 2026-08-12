import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/en/advertiser")({
  head: () => ({
    meta: [
      { title: "Solutions for Advertisers | ADFI" },
      { name: "description", content: "Scale conversions with ADFI’s publisher network and real-time optimisation data." },
      { property: "og:title", content: "Solutions for Advertisers | ADFI" },
      { property: "og:description", content: "Scale conversions with ADFI’s publisher network and real-time optimisation data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <StaticPage lang="en" page="advertiser" role="Advertiser" />;
}
