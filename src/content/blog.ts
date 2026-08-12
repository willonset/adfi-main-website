import type { Lang } from "@/i18n";

export type BlogPost = {
  slug: string;
  date: string; // ISO
  category: { vi: string; en: string };
  title: { vi: string; en: string };
  excerpt: { vi: string; en: string };
  /** Simple markdown-ish blocks: "## Heading", "- bullet", or paragraph text. */
  body: { vi: string; en: string };
};

export const blogPosts: BlogPost[] = [
  {
    slug: "affiliate-marketing-la-gi",
    date: "2026-07-28",
    category: { vi: "Kiến thức", en: "Fundamentals" },
    title: {
      vi: "Affiliate Marketing là gì và vì sao thương hiệu nên bắt đầu ngay",
      en: "What is affiliate marketing and why brands should start now",
    },
    excerpt: {
      vi: "Giải thích mô hình affiliate marketing, các bên tham gia và lý do đây là kênh tăng trưởng đo lường được cho thương hiệu tại Đông Nam Á.",
      en: "How affiliate marketing works, who is involved, and why it is a measurable growth channel for brands in Southeast Asia.",
    },
    body: {
      vi: `Affiliate Marketing là mô hình tiếp thị dựa trên hiệu quả: thương hiệu chỉ trả chi phí khi có kết quả thực tế như đơn hàng, lượt đăng ký hoặc lượt cài đặt.

## Các bên tham gia
- Nhà quảng cáo (Advertiser/Brand): người có sản phẩm, dịch vụ cần bán.
- Nhà sáng tạo & publisher (Creator): người giới thiệu sản phẩm tới người dùng.
- Nền tảng/Network: nơi kết nối, theo dõi và đối soát hiệu quả.

## Vì sao mô hình này phù hợp với thương hiệu
- Chi phí gắn với kết quả, dễ kiểm soát ngân sách.
- Mở rộng độ phủ nhờ mạng lưới creator thay vì chỉ dựa vào quảng cáo trả phí.
- Dữ liệu minh bạch theo từng nguồn traffic, từng creator, từng chiến dịch.

## Bắt đầu như thế nào
- Xác định mục tiêu chuyển đổi và mức hoa hồng bền vững theo biên lợi nhuận.
- Chuẩn hoá tracking để mọi đơn hàng đều được ghi nhận đúng nguồn.
- Tuyển chọn creator phù hợp tệp khách hàng, cung cấp brief và tư liệu rõ ràng.
- Đo lường theo chu kỳ, tối ưu nhóm creator và nhóm sản phẩm hiệu quả nhất.

Nếu bạn muốn triển khai affiliate cho thương hiệu của mình, đội ngũ ADFI có thể tư vấn lộ trình phù hợp với ngành hàng và quy mô hiện tại.`,
      en: `Affiliate marketing is a performance model: the brand pays only when a real result happens, such as an order, a signup or an install.

## Who is involved
- Advertisers and brands: they own the product or service.
- Creators and publishers: they introduce the product to their audience.
- Networks and platforms: they connect, track and reconcile performance.

## Why it fits brands
- Spend is tied to outcomes, so budgets stay under control.
- Reach expands through a creator network instead of paid media alone.
- Reporting is transparent per traffic source, per creator and per campaign.

## How to start
- Define the conversion goal and a commission that fits your margin.
- Set up clean tracking so every order is attributed to the right source.
- Recruit creators who match your audience and give them clear briefs and assets.
- Review results on a fixed cycle and scale the creators and SKUs that work.

If you want to launch an affiliate program, the ADFI team can help you design a roadmap for your category and current scale.`,
    },
  },
  {
    slug: "livestream-commerce-checklist",
    date: "2026-08-05",
    category: { vi: "Thương mại điện tử", en: "E-commerce" },
    title: {
      vi: "Checklist chuẩn bị một phiên livestream bán hàng hiệu quả",
      en: "A practical checklist for a high-performing livestream session",
    },
    excerpt: {
      vi: "Những việc cần chuẩn bị trước, trong và sau phiên live để tăng tỷ lệ chốt đơn trên các sàn thương mại điện tử.",
      en: "What to prepare before, during and after a live session to improve conversion on marketplace platforms.",
    },
    body: {
      vi: `Một phiên livestream hiệu quả không đến từ may mắn mà đến từ khâu chuẩn bị.

## Trước phiên live
- Chốt danh mục sản phẩm: sản phẩm phễu, sản phẩm chủ lực, sản phẩm biên cao.
- Chuẩn bị kịch bản theo khung giờ, gồm điểm chốt đơn và các mốc tung ưu đãi.
- Kiểm tra tồn kho, mã giảm giá và đường dẫn sản phẩm trong giỏ hàng.
- Chạy traffic hâm nóng trước giờ live để có lượng người xem ban đầu.

## Trong phiên live
- Lặp lại lợi ích sản phẩm theo chu kỳ ngắn vì người xem vào ra liên tục.
- Ghim sản phẩm đang nói tới và nhắc thao tác đặt hàng cụ thể.
- Theo dõi số liệu theo thời gian thực để đổi thứ tự sản phẩm khi cần.

## Sau phiên live
- Đối soát đơn, tỷ lệ huỷ và tỷ lệ hoàn để tính hiệu quả thực.
- Cắt các đoạn nội dung tốt thành video ngắn để tiếp tục kéo đơn.
- Ghi lại bài học cho phiên kế tiếp: khung giờ, sản phẩm, kịch bản, host.`,
      en: `A strong livestream is the result of preparation, not luck.

## Before the session
- Lock the product line-up: traffic drivers, hero products and high-margin items.
- Write a run-of-show with clear closing moments and promo drops.
- Check stock, vouchers and product links inside the live cart.
- Warm up traffic before going live so the session opens with viewers.

## During the session
- Repeat the key benefits in short cycles because viewers keep joining.
- Pin the product being discussed and give explicit ordering steps.
- Watch live metrics and reorder the line-up when something underperforms.

## After the session
- Reconcile orders, cancellations and returns to get the real result.
- Cut the best moments into short videos to keep driving orders.
- Document learnings for the next session: time slot, products, script, host.`,
    },
  },
];

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function formatDate(date: string, lang: Lang) {
  return new Date(date).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
