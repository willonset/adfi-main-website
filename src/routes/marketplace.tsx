import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Giải pháp cho Marketplace | ADFI" },
      { name: "description", content: "Tăng GMV cho sàn thương mại điện tử bằng traffic ngoại sàn chất lượng từ hệ sinh thái quảng cáo và MCN của ADFI." },
      { property: "og:title", content: "Giải pháp cho Marketplace | ADFI" },
      { property: "og:description", content: "Tăng GMV cho sàn thương mại điện tử bằng traffic ngoại sàn chất lượng từ hệ sinh thái quảng cáo và MCN của ADFI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <StaticPage lang="vi" page="marketplace" role="Marketplace" />;
}
