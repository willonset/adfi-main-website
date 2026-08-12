CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','owner'))
$$;

CREATE POLICY "Anyone can submit leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff can view leads" ON public.leads FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update leads" ON public.leads FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete leads" ON public.leads FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Anyone can submit applications" ON public.job_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff can view applications" ON public.job_applications FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update applications" ON public.job_applications FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete applications" ON public.job_applications FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Staff can view all posts" ON public.blog_posts FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update posts" ON public.blog_posts FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete posts" ON public.blog_posts FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- jobs: staff (owner too) manage
CREATE POLICY "Staff can view all jobs" ON public.jobs FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update jobs" ON public.jobs FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete jobs" ON public.jobs FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- user_roles management
CREATE POLICY "Staff can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Owner can grant roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Owner can revoke roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'owner') AND user_id <> auth.uid());

CREATE OR REPLACE FUNCTION public.claim_owner()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'owner') THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'owner') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.claim_owner() FROM anon;

INSERT INTO public.blog_posts (slug, category_vi, category_en, title_vi, title_en, excerpt_vi, excerpt_en, body_vi, body_en, published_at)
VALUES
('affiliate-marketing-la-gi','Kiến thức','Fundamentals',
 'Affiliate Marketing là gì và vì sao thương hiệu nên bắt đầu ngay',
 'What is affiliate marketing and why brands should start now',
 'Giải thích mô hình affiliate marketing, các bên tham gia và lý do đây là kênh tăng trưởng đo lường được cho thương hiệu tại Đông Nam Á.',
 'How affiliate marketing works, who is involved, and why it is a measurable growth channel for brands in Southeast Asia.',
 E'Affiliate Marketing là mô hình tiếp thị dựa trên hiệu quả: thương hiệu chỉ trả chi phí khi có kết quả thực tế như đơn hàng, lượt đăng ký hoặc lượt cài đặt.\n\n## Các bên tham gia\n- Nhà quảng cáo (Advertiser/Brand): người có sản phẩm, dịch vụ cần bán.\n- Nhà sáng tạo & publisher (Creator): người giới thiệu sản phẩm tới người dùng.\n- Nền tảng/Network: nơi kết nối, theo dõi và đối soát hiệu quả.\n\n## Vì sao mô hình này phù hợp với thương hiệu\n- Chi phí gắn với kết quả, dễ kiểm soát ngân sách.\n- Mở rộng độ phủ nhờ mạng lưới creator thay vì chỉ dựa vào quảng cáo trả phí.\n- Dữ liệu minh bạch theo từng nguồn traffic, từng creator, từng chiến dịch.\n\n## Bắt đầu như thế nào\n- Xác định mục tiêu chuyển đổi và mức hoa hồng bền vững theo biên lợi nhuận.\n- Chuẩn hoá tracking để mọi đơn hàng đều được ghi nhận đúng nguồn.\n- Tuyển chọn creator phù hợp tệp khách hàng, cung cấp brief và tư liệu rõ ràng.\n- Đo lường theo chu kỳ, tối ưu nhóm creator và nhóm sản phẩm hiệu quả nhất.\n\nNếu bạn muốn triển khai affiliate cho thương hiệu của mình, đội ngũ ADFI có thể tư vấn lộ trình phù hợp với ngành hàng và quy mô hiện tại.',
 E'Affiliate marketing is a performance model: the brand pays only when a real result happens, such as an order, a signup or an install.\n\n## Who is involved\n- Advertisers and brands: they own the product or service.\n- Creators and publishers: they introduce the product to their audience.\n- Networks and platforms: they connect, track and reconcile performance.\n\n## Why it fits brands\n- Spend is tied to outcomes, so budgets stay under control.\n- Reach expands through a creator network instead of paid media alone.\n- Reporting is transparent per traffic source, per creator and per campaign.\n\n## How to start\n- Define the conversion goal and a commission that fits your margin.\n- Set up clean tracking so every order is attributed to the right source.\n- Recruit creators who match your audience and give them clear briefs and assets.\n- Review results on a fixed cycle and scale the creators and SKUs that work.\n\nIf you want to launch an affiliate program, the ADFI team can help you design a roadmap for your category and current scale.',
 '2026-07-28T00:00:00Z'),
('livestream-commerce-checklist','Thương mại điện tử','E-commerce',
 'Checklist chuẩn bị một phiên livestream bán hàng hiệu quả',
 'A practical checklist for a high-performing livestream session',
 'Những việc cần chuẩn bị trước, trong và sau phiên live để tăng tỷ lệ chốt đơn trên các sàn thương mại điện tử.',
 'What to prepare before, during and after a live session to improve conversion on marketplace platforms.',
 E'Một phiên livestream hiệu quả không đến từ may mắn mà đến từ khâu chuẩn bị.\n\n## Trước phiên live\n- Chốt danh mục sản phẩm: sản phẩm phễu, sản phẩm chủ lực, sản phẩm biên cao.\n- Chuẩn bị kịch bản theo khung giờ, gồm điểm chốt đơn và các mốc tung ưu đãi.\n- Kiểm tra tồn kho, mã giảm giá và đường dẫn sản phẩm trong giỏ hàng.\n- Chạy traffic hâm nóng trước giờ live để có lượng người xem ban đầu.\n\n## Trong phiên live\n- Lặp lại lợi ích sản phẩm theo chu kỳ ngắn vì người xem vào ra liên tục.\n- Ghim sản phẩm đang nói tới và nhắc thao tác đặt hàng cụ thể.\n- Theo dõi số liệu theo thời gian thực để đổi thứ tự sản phẩm khi cần.\n\n## Sau phiên live\n- Đối soát đơn, tỷ lệ huỷ và tỷ lệ hoàn để tính hiệu quả thực.\n- Cắt các đoạn nội dung tốt thành video ngắn để tiếp tục kéo đơn.\n- Ghi lại bài học cho phiên kế tiếp: khung giờ, sản phẩm, kịch bản, host.',
 E'A strong livestream is the result of preparation, not luck.\n\n## Before the session\n- Lock the product line-up: traffic drivers, hero products and high-margin items.\n- Write a run-of-show with clear closing moments and promo drops.\n- Check stock, vouchers and product links inside the live cart.\n- Warm up traffic before going live so the session opens with viewers.\n\n## During the session\n- Repeat the key benefits in short cycles because viewers keep joining.\n- Pin the product being discussed and give explicit ordering steps.\n- Watch live metrics and reorder the line-up when something underperforms.\n\n## After the session\n- Reconcile orders, cancellations and returns to get the real result.\n- Cut the best moments into short videos to keep driving orders.\n- Document learnings for the next session: time slot, products, script, host.',
 '2026-08-05T00:00:00Z');