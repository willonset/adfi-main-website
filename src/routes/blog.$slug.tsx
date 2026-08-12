import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogPostPage } from "@/components/site/BlogPage";
import { getPublicPost } from "@/lib/blog.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPublicPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Không tìm thấy bài viết — ADFI" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title_vi} — Blog ADFI` },
        { name: "description", content: post.excerpt_vi },
        { property: "og:title", content: post.title_vi },
        { property: "og:description", content: post.excerpt_vi },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Page,
});

function Page() {
  const { post } = Route.useLoaderData();
  return <BlogPostPage lang="vi" post={post} />;
}
