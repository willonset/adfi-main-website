import { createFileRoute } from "@tanstack/react-router";
import { CareersPage } from "@/components/site/CareersPage";

export const Route = createFileRoute("/tuyen-dung")({
  head: () => ({
    meta: [
      { title: "Tuyển dụng tại ADFI | Cơ hội nghề nghiệp" },
      { name: "description", content: "Khám phá các vị trí đang mở tại ADFI: Sales, Marketing, Digital, Logistic, E-commerce và Hành chính. Ứng tuyển trực tuyến ngay." },
      { property: "og:title", content: "Tuyển dụng tại ADFI | Cơ hội nghề nghiệp" },
      { property: "og:description", content: "Khám phá các vị trí đang mở tại ADFI: Sales, Marketing, Digital, Logistic, E-commerce và Hành chính. Ứng tuyển trực tuyến ngay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <CareersPage lang="vi" />;
}
