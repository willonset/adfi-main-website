import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

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
  component: Page,
});

function Page() {
  return <StaticPage lang="vi" page="index" />;
}
