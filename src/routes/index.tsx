import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";
import { BlogHighlights } from "@/components/site/BlogHighlights";
import { listPublicPosts } from "@/lib/blog.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ADFI — Hệ sinh thái Affiliate Marketing Đông Nam Á" },
      { name: "description", content: "Tăng trưởng bền vững cùng ADFI: quảng cáo hiệu suất, mạng lưới MCN và livestream commerce cho Marketplace, Brand, Advertiser và Creator." },
      { property: "og:title", content: "ADFI — Hệ sinh thái Affiliate Marketing Đông Nam Á" },
      { property: "og:description", content: "Tăng trưởng bền vững cùng ADFI: quảng cáo hiệu suất, mạng lưới MCN và livestream commerce cho Marketplace, Brand, Advertiser và Creator." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listPublicPosts(),
  component: Page,
});

function Page() {
  const posts = Route.useLoaderData();
  return (
    <StaticPage
      lang="vi"
      page="index"
      bottom={<BlogHighlights lang="vi" posts={posts} />}
    />
  );
}
