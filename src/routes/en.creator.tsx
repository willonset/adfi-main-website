import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/en/creator")({
  head: () => ({
    meta: [
      { title: "Solutions for Creators | ADFI" },
      { name: "description", content: "Join ADFI"s creator network to earn from affiliate, livestream and brand campaigns." },
      { property: "og:title", content: "Solutions for Creators | ADFI" },
      { property: "og:description", content: "Join ADFI"s creator network to earn from affiliate, livestream and brand campaigns." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <StaticPage lang="en" page="creator" role="Creator" />;
}
