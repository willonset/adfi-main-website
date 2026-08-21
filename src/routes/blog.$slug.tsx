import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogPostPage } from "@/components/site/BlogPage";
import { getPublicPost } from "@/lib/blog.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPublicPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Không tìm thấy bài viết — ADFI" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const url = `https://adfi.vn/blog/${params.slug}`;
    const image = post.cover_url || "https://adfi.vn/og-adfi.jpg";
    return {
      meta: [
        { title: `${post.title_vi} — Blog ADFI` },
        { name: "description", content: post.excerpt_vi },
        { property: "og:title", content: post.title_vi },
        { property: "og:description", content: post.excerpt_vi },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title_vi,
            description: post.excerpt_vi,
            image,
            datePublished: post.published_at,
            inLanguage: "vi-VN",
            mainEntityOfPage: url,
            author: { "@type": "Organization", name: "ADFI" },
            publisher: {
              "@type": "Organization",
              name: "ADFI",
              logo: { "@type": "ImageObject", url: "https://adfi.vn/og-adfi.jpg" },
            },
          }),
        },
      ],
    };
  },

  component: Page,
});

function Page() {
  const { post } = Route.useLoaderData();
  return <BlogPostPage lang="vi" post={post} />;
}
