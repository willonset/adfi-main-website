import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/brand")({
  head: () => ({
    meta: [
      { title: "Giải pháp cho Nhãn hàng | ADFI" },
      { name: "description", content: "ADFI giúp nhãn hàng tăng doanh số trên sàn TMĐT qua affiliate, KOC và livestream commerce tại Đông Nam Á." },
      { property: "og:title", content: "Giải pháp cho Nhãn hàng | ADFI" },
      { property: "og:description", content: "ADFI giúp nhãn hàng tăng doanh số trên sàn TMĐT qua affiliate, KOC và livestream commerce tại Đông Nam Á." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <StaticPage lang="vi" page="brand" role="Brand" />;
}
