import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/creator")({
  head: () => ({
    meta: [
      { title: "Giải pháp cho Creator | ADFI" },
      { name: "description", content: "Gia nhập mạng lưới Creator của ADFI để kiếm thu nhập từ affiliate, livestream và chiến dịch nhãn hàng." },
      { property: "og:title", content: "Giải pháp cho Creator | ADFI" },
      { property: "og:description", content: "Gia nhập mạng lưới Creator của ADFI để kiếm thu nhập từ affiliate, livestream và chiến dịch nhãn hàng." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <StaticPage lang="vi" page="creator" role="Creator" />;
}
