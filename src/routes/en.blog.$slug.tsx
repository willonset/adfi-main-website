import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogPostPage } from "@/components/site/BlogPage";
import { getPublicPost } from "@/lib/blog.functions";

export const Route = createFileRoute("/en/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPublicPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article not found — ADFI" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const title = post.title_en || post.title_vi;
    const desc = post.excerpt_en || post.excerpt_vi;
    return {
      meta: [
        { title: `${title} — ADFI Blog` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Page,
});

function Page() {
  const { post } = Route.useLoaderData();
  return <BlogPostPage lang="en" post={post} />;
}
