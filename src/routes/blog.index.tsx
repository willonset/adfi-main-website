import { createFileRoute } from "@tanstack/react-router";
import { BlogListPage } from "@/components/site/BlogPage";
import { listPublicPosts } from "@/lib/blog.functions";

export const Route = createFileRoute("/blog/")({
  loader: () => listPublicPosts(),
  head: () => ({
    meta: [
      { title: "Blog ADFI — Affiliate Marketing & Thương mại điện tử" },
      { name: "description", content: "Kiến thức affiliate marketing, livestream commerce và kinh nghiệm tăng trưởng thương mại điện tử từ đội ngũ ADFI." },
      { property: "og:title", content: "Blog ADFI — Affiliate Marketing & Thương mại điện tử" },
      { property: "og:description", content: "Kiến thức affiliate marketing, livestream commerce và kinh nghiệm tăng trưởng thương mại điện tử từ đội ngũ ADFI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const posts = Route.useLoaderData();
  return <BlogListPage lang="vi" posts={posts} />;
}
