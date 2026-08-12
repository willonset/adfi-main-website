import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/en/about")({
  head: () => ({
    meta: [
      { title: "About ADFI | Affiliate Marketing Ecosystem" },
      { name: "description", content: "The story, vision and team behind ADFI — a digital commerce growth partner in Southeast Asia." },
      { property: "og:title", content: "About ADFI | Affiliate Marketing Ecosystem" },
      { property: "og:description", content: "The story, vision and team behind ADFI — a digital commerce growth partner in Southeast Asia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <StaticPage lang="en" page="about" />;
}
