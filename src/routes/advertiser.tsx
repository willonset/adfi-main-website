import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/advertiser")({
  head: () => ({
    meta: [
      { title: "Giải pháp cho Advertiser | ADFI" },
      { name: "description", content: "Mở rộng chuyển đổi với mạng lưới publisher và dữ liệu tối ưu theo thời gian thực của ADFI." },
      { property: "og:title", content: "Giải pháp cho Advertiser | ADFI" },
      { property: "og:description", content: "Mở rộng chuyển đổi với mạng lưới publisher và dữ liệu tối ưu theo thời gian thực của ADFI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <StaticPage lang="vi" page="advertiser" role="Advertiser" />;
}
