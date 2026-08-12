import { createFileRoute } from "@tanstack/react-router";
import { CareersPage } from "@/components/site/CareersPage";

export const Route = createFileRoute("/en/careers")({
  head: () => ({
    meta: [
      { title: "Careers at ADFI | Job Opportunities" },
      { name: "description", content: "Explore open roles at ADFI across Sales, Marketing, Digital, Logistics, E-commerce and Administration. Apply online today." },
      { property: "og:title", content: "Careers at ADFI | Job Opportunities" },
      { property: "og:description", content: "Explore open roles at ADFI across Sales, Marketing, Digital, Logistics, E-commerce and Administration. Apply online today." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <CareersPage lang="en" />;
}
