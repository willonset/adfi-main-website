import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogPostPage } from "@/components/site/BlogPage";
import { getPost } from "@/content/blog";

export const Route = createFileRoute("/en/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article not found — ADFI" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title.en} — ADFI Blog` },
        { name: "description", content: post.excerpt.en },
        { property: "og:title", content: post.title.en },
        { property: "og:description", content: post.excerpt.en },
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
