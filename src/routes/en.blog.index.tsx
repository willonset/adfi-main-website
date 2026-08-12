import { createFileRoute } from "@tanstack/react-router";
import { BlogListPage } from "@/components/site/BlogPage";

export const Route = createFileRoute("/en/blog/")({
  head: () => ({
    meta: [
      { title: "ADFI Blog — Affiliate Marketing & E-commerce Insights" },
      { name: "description", content: "Affiliate marketing playbooks, livestream commerce tips and e-commerce growth notes from the ADFI team." },
      { property: "og:title", content: "ADFI Blog — Affiliate Marketing & E-commerce Insights" },
      { property: "og:description", content: "Affiliate marketing playbooks, livestream commerce tips and e-commerce growth notes from the ADFI team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <BlogListPage lang="en" />,
});
