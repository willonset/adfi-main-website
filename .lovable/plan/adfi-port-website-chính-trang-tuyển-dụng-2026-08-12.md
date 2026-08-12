# ADFI — Port website chính + Trang tuyển dụng

## Mục tiêu
Chuyển toàn bộ website tĩnh hiện tại (slimmaddy.github.io/adfi) sang dự án này, giữ nguyên 100% giao diện, rồi bổ sung trang Tuyển dụng đồng bộ thiết kế, có bộ lọc, thẻ job, trang JD và form ứng tuyển.

## Phần 1 — Port web chính

Các trang được chuyển sang route riêng, giữ nguyên bố cục, nội dung, ảnh:

```text
/                     Home (index.html)
/about                Về chúng tôi
/marketplace          For Marketplace
/brand                For Brand
/advertiser           For Advertiser
/creator              For Creator
/tuyen-dung           Tuyển dụng (mới)
```

- Header (nav pill, nút Contact Us, menu mobile) và Footer dùng chung, thêm mục "Tuyển dụng" trỏ tới `/tuyen-dung` trong footer và nav.
- Toàn bộ design system hiện tại (màu đỏ #EC221F, font Plus Jakarta Sans, bo góc, spacing, hiệu ứng glow) được đưa vào hệ token của dự án — không đổi phong cách.
- Ảnh/SVG trong `assets/` được tải về và đưa vào dự án.
- Form liên hệ ở trang chủ giữ nguyên hành vi gửi về Google Apps Script như hiện tại.
- Mỗi trang có tiêu đề/mô tả SEO riêng.

## Phần 2 — Trang tuyển dụng `/tuyen-dung`

**Hero** ngắn theo phong cách ADFI: tiêu đề "Cơ hội nghề nghiệp / Job Opportunities", mô tả ngắn về văn hóa công ty.

**Bộ lọc** (dạng chip/dropdown, đỏ khi active, lọc tức thì, có nút xóa lọc):
- Bộ phận: Sales, Marketing, Digital, Logistic, E-commerce, Hành chính văn phòng
- Hình thức: Full-time, Remote, CTV
- Kèm ô tìm kiếm theo tên vị trí và bộ đếm "N vị trí đang mở".

**Lưới thẻ job** 3 cột (2 cột tablet, 1 cột mobile), theo ảnh tham chiếu nhưng dùng màu/typo ADFI: tên vị trí, địa điểm, hạn nộp, bộ phận + hình thức dạng badge, nút "Apply Now".

**Trang chi tiết JD** `/tuyen-dung/$slug`: mô tả công việc, yêu cầu, quyền lợi, thông tin lương/địa điểm/hạn nộp, nút CTA "Apply Now" (sticky trên mobile).

**Form ứng tuyển** (modal, đúng cấu trúc ảnh mẫu):
- Fullname*, Email*, Phone number*
- "Giới thiệu ngắn gọn về bản thân để gây ấn tượng với ADFI?"*
- Vị trí ứng tuyển (điền sẵn theo job, có thể đổi)
- "Bạn biết đến ADFI qua đâu?"* — checkbox: Fanpage, TikTok, LinkedIn, Job Posting, Jobsite, Bạn bè, Khác (ô nhập tự do)
- File CV* — .doc, .docx, .pdf, tối đa 5MB, kèm ghi chú đặt tên file
- Nút SUBMIT, trạng thái đang gửi / thành công / lỗi, validate đầy đủ bằng Zod.

## Phần 3 — Dữ liệu & gửi hồ sơ

**Job quản lý trong Lovable Cloud**
- Bảng `jobs`: tiêu đề (VI/EN), slug, bộ phận, hình thức, địa điểm, hạn nộp, mô tả/yêu cầu/quyền lợi, trạng thái mở-đóng, thứ tự.
- Khách truy cập chỉ đọc được job đang mở.
- Trang quản trị `/admin/jobs` (đăng nhập bằng email/mật khẩu, phân quyền admin qua bảng vai trò riêng) để thêm/sửa/đóng tin tuyển dụng.
- Seed sẵn ~12 vị trí mẫu trải đều các bộ phận để trang có nội dung ngay.

**Hồ sơ ứng tuyển gửi qua Google Apps Script**
- Form gửi JSON (gồm file CV mã hóa base64) tới một Web App Apps Script; script lưu file vào Google Drive và ghi 1 dòng vào Google Sheet.
- Tôi sẽ cung cấp sẵn đoạn code Apps Script để bạn dán vào Google Sheet và deploy; sau đó bạn gửi tôi URL `/exec` để gắn vào ứng dụng (lưu dưới dạng biến cấu hình, không hard-code lộ liễu).
- Trước khi có URL đó, form sẽ hoạt động ở chế độ hiển thị lỗi thân thiện.

## Phần 4 — Website song ngữ Việt / Anh

- **Toàn bộ website** (Home, About, Marketplace, Brand, Advertiser, Creator, Tuyển dụng) có đủ hai bản nội dung: tiếng Việt và tiếng Anh.
- **Nút chuyển ngôn ngữ** đặt ở header (cạnh nút Contact Us) dạng gọn "VI | EN", có trong cả menu mobile. Đổi ngôn ngữ giữ nguyên trang đang xem và ghi nhớ lựa chọn cho lần truy cập sau.
- **URL theo ngôn ngữ**: tiếng Việt giữ đường dẫn hiện tại (`/`, `/about`, `/tuyen-dung`), tiếng Anh có tiền tố `/en` (`/en`, `/en/about`, `/en/careers`). Nhờ vậy mỗi ngôn ngữ được Google lập chỉ mục riêng, chia sẻ link đúng ngôn ngữ, và có thẻ `hreflang` liên kết hai bản.
- Tiêu đề/mô tả SEO, nhãn nút, form liên hệ, form ứng tuyển, thông báo lỗi đều dịch theo ngôn ngữ đang chọn.
- **Nội dung tuyển dụng song ngữ**: mỗi job trong Lovable Cloud có trường tiếng Việt và tiếng Anh (tiêu đề, mô tả, yêu cầu, quyền lợi); trang quản trị cho nhập cả hai. Nếu thiếu bản tiếng Anh, hệ thống tự hiển thị bản tiếng Việt thay thế.
- Toàn bộ chữ cố định trong giao diện được gom vào file từ điển VI/EN, dễ bổ sung/chỉnh sửa về sau.

## Ghi chú kỹ thuật
- TanStack Start + Tailwind v4; CSS ADFI được chuyển thành token trong `src/styles.css`, không dùng class màu cứng.
- Bộ lọc lưu trên URL (`?bo-phan=...&hinh-thuc=...`) để chia sẻ được link đã lọc.
- Job list đọc qua route loader + TanStack Query để SSR/SEO tốt; mỗi JD có metadata riêng và JSON-LD `JobPosting`.
- Upload CV giới hạn dung lượng/định dạng ở client trước khi encode base64.
- i18n: layout route `_lang` với hai nhánh `/` (vi) và `/en`, dùng chung component trang; từ điển đặt trong `src/i18n/{vi,en}.ts`; ngôn ngữ đọc từ route (không phụ thuộc `localStorage` khi render) để tránh lệch SSR, lựa chọn lưu lại chỉ dùng để điều hướng lần sau.

