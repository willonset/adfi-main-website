import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Về ADFI | Hệ sinh thái Affiliate Marketing" },
      { name: "description", content: "Câu chuyện, tầm nhìn và đội ngũ ADFI — đối tác tăng trưởng thương mại số tại Đông Nam Á." },
      { property: "og:title", content: "Về ADFI | Hệ sinh thái Affiliate Marketing" },
      { property: "og:description", content: "Câu chuyện, tầm nhìn và đội ngũ ADFI — đối tác tăng trưởng thương mại số tại Đông Nam Á." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <StaticPage lang="vi" page="about" />;
}
