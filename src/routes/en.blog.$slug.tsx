import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogPostPage } from "@/components/site/BlogPage";
import { getPublicPost } from "@/lib/blog.functions";

export const Route = createFileRoute("/en/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPublicPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article not found — ADFI" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const title = post.title_en || post.title_vi;
    const desc = post.excerpt_en || post.excerpt_vi;
    const url = `https://adfi.vn/en/blog/${params.slug}`;
    const image = post.cover_url || "https://adfi.vn/og-adfi.jpg";
    return {
      meta: [
        { title: `${title} — ADFI Blog` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
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
            headline: title,
            description: desc,
            image,
            datePublished: post.published_at,
            inLanguage: "en",
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
  return <BlogPostPage lang="en" post={post} />;
}
