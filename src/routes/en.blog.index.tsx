import { createFileRoute } from "@tanstack/react-router";
import { BlogListPage } from "@/components/site/BlogPage";
import { listPublicPosts } from "@/lib/blog.functions";

export const Route = createFileRoute("/en/blog/")({
  loader: () => listPublicPosts(),
  head: () => ({
    meta: [
      { title: "ADFI Blog — Affiliate Marketing & E-commerce insights" },
      { name: "description", content: "Affiliate marketing playbooks, livestream commerce tips and e-commerce growth notes from the ADFI team." },
      { property: "og:title", content: "ADFI Blog — Affiliate Marketing & E-commerce insights" },
      { property: "og:description", content: "Affiliate marketing playbooks, livestream commerce tips and e-commerce growth notes from the ADFI team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const posts = Route.useLoaderData();
  return <BlogListPage lang="en" posts={posts} />;
}
