CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_vi text NOT NULL,
  title_en text NOT NULL,
  department text NOT NULL,
  employment_type text NOT NULL,
  location_vi text NOT NULL DEFAULT 'Hà Nội',
  location_en text NOT NULL DEFAULT 'Hanoi',
  salary_vi text,
  salary_en text,
  deadline date,
  description_vi text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  requirements_vi text[] NOT NULL DEFAULT '{}',
  requirements_en text[] NOT NULL DEFAULT '{}',
  benefits_vi text[] NOT NULL DEFAULT '{}',
  benefits_en text[] NOT NULL DEFAULT '{}',
  is_open boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.jobs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open jobs"
ON public.jobs FOR SELECT TO anon, authenticated
USING (is_open = true);

CREATE POLICY "Admins can view all jobs"
ON public.jobs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert jobs"
ON public.jobs FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update jobs"
ON public.jobs FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete jobs"
ON public.jobs FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.jobs (slug, title_vi, title_en, department, employment_type, location_vi, location_en, salary_vi, salary_en, deadline, description_vi, description_en, requirements_vi, requirements_en, benefits_vi, benefits_en, sort_order) VALUES
('sales-executive', 'Nhân viên Kinh doanh (Sales Executive)', 'Sales Executive', 'Sales', 'Full-time', 'Imperia Garden, Thanh Xuân, Hà Nội', 'Imperia Garden, Thanh Xuan, Hanoi', '12 - 20 triệu + hoa hồng', '12 - 20M VND + commission', '2026-03-31',
 'Tìm kiếm, phát triển và chăm sóc khách hàng doanh nghiệp (Brand, Advertiser) sử dụng giải pháp Affiliate Marketing của ADFI tại thị trường Đông Nam Á.',
 'Find, develop and nurture business clients (Brands, Advertisers) using ADFI''s Affiliate Marketing solutions across Southeast Asia.',
 ARRAY['Tối thiểu 1 năm kinh nghiệm sales B2B, ưu tiên mảng Digital/E-commerce','Kỹ năng đàm phán và xây dựng quan hệ khách hàng tốt','Tiếng Anh giao tiếp là một lợi thế'],
 ARRAY['At least 1 year of B2B sales experience, preferably in Digital/E-commerce','Strong negotiation and relationship-building skills','Conversational English is a plus'],
 ARRAY['Thu nhập không giới hạn theo năng lực','Bảo hiểm đầy đủ theo luật, khám sức khoẻ định kỳ','Môi trường trẻ, cơ hội thăng tiến nhanh'],
 ARRAY['Uncapped earnings based on performance','Full statutory insurance and annual health check','Young environment with fast career growth'], 1),
('marketing-executive', 'Chuyên viên Marketing', 'Marketing Executive', 'Marketing', 'Full-time', 'Imperia Garden, Thanh Xuân, Hà Nội', 'Imperia Garden, Thanh Xuan, Hanoi', '10 - 18 triệu', '10 - 18M VND', '2026-03-31',
 'Lên kế hoạch và triển khai các chiến dịch marketing thương hiệu ADFI, phối hợp cùng đội Creator và Digital để tăng nhận diện trên toàn khu vực.',
 'Plan and execute ADFI brand marketing campaigns, working with the Creator and Digital teams to grow awareness across the region.',
 ARRAY['1-3 năm kinh nghiệm marketing, ưu tiên ngành thương mại điện tử','Tư duy nội dung tốt, biết dùng công cụ phân tích dữ liệu','Chủ động, sáng tạo, làm việc nhóm tốt'],
 ARRAY['1-3 years of marketing experience, e-commerce preferred','Strong content thinking and familiarity with analytics tools','Proactive, creative and a good team player'],
 ARRAY['Lương tháng 13 và thưởng theo hiệu quả dự án','Ngân sách đào tạo hằng năm','Team building, du lịch công ty'],
 ARRAY['13th month salary and project performance bonus','Annual learning budget','Team building and company trips'], 2),
('digital-performance-specialist', 'Chuyên viên Digital Performance', 'Digital Performance Specialist', 'Digital', 'Full-time', 'Imperia Garden, Thanh Xuân, Hà Nội', 'Imperia Garden, Thanh Xuan, Hanoi', '15 - 25 triệu', '15 - 25M VND', '2026-04-15',
 'Vận hành và tối ưu hệ thống quảng cáo đa nền tảng (Facebook, Google, TikTok) nhằm kéo traffic chất lượng cho các Marketplace đối tác.',
 'Operate and optimise multi-platform ad systems (Facebook, Google, TikTok) to drive quality traffic for partner marketplaces.',
 ARRAY['Kinh nghiệm chạy quảng cáo performance với ngân sách lớn','Thành thạo phân tích dữ liệu, tracking chuyển đổi','Ưu tiên ứng viên từng làm affiliate hoặc e-commerce'],
 ARRAY['Experience running performance ads with sizeable budgets','Strong data analysis and conversion tracking skills','Affiliate or e-commerce background is a plus'],
 ARRAY['Thưởng theo hiệu quả chiến dịch','Trang bị đầy đủ công cụ và tài khoản quảng cáo','Cơ hội làm việc với thị trường quốc tế'],
 ARRAY['Campaign performance bonus','Full tooling and ad account support','Exposure to international markets'], 3),
('logistics-coordinator', 'Nhân viên Vận hành Logistic', 'Logistics Coordinator', 'Logistic', 'Full-time', 'Imperia Garden, Thanh Xuân, Hà Nội', 'Imperia Garden, Thanh Xuan, Hanoi', '9 - 14 triệu', '9 - 14M VND', '2026-03-20',
 'Điều phối hoạt động giao nhận hàng mẫu, quà tặng cho Creator và các chiến dịch livestream của ADFI.',
 'Coordinate sample and gifting logistics for ADFI creators and livestream campaigns.',
 ARRAY['Tốt nghiệp Cao đẳng/Đại học các ngành liên quan','Cẩn thận, kỹ năng sắp xếp và theo dõi đơn hàng tốt','Thành thạo Excel/Google Sheets'],
 ARRAY['College/University degree in a related field','Detail-oriented with strong order tracking skills','Proficient in Excel/Google Sheets'],
 ARRAY['Phụ cấp ăn trưa và đi lại','Bảo hiểm đầy đủ theo luật','Lộ trình lên vị trí quản lý vận hành'],
 ARRAY['Lunch and travel allowance','Full statutory insurance','Path to operations management roles'], 4),
('ecommerce-account-manager', 'Quản lý Tài khoản E-commerce', 'E-commerce Account Manager', 'E-commerce', 'Full-time', 'Imperia Garden, Thanh Xuân, Hà Nội', 'Imperia Garden, Thanh Xuan, Hanoi', '18 - 30 triệu', '18 - 30M VND', '2026-04-30',
 'Chịu trách nhiệm tăng trưởng GMV cho danh mục nhãn hàng trên Shopee, Lazada, TikTok Shop thông qua hệ sinh thái affiliate của ADFI.',
 'Own GMV growth for a brand portfolio on Shopee, Lazada and TikTok Shop through ADFI''s affiliate ecosystem.',
 ARRAY['2+ năm kinh nghiệm vận hành sàn TMĐT','Hiểu cơ chế hoa hồng, voucher, campaign của sàn','Kỹ năng làm việc với đối tác và báo cáo số liệu'],
 ARRAY['2+ years operating e-commerce marketplaces','Understanding of commission, voucher and campaign mechanics','Strong partner management and reporting skills'],
 ARRAY['Thưởng theo GMV danh mục phụ trách','Làm việc trực tiếp với các sàn lớn khu vực','Chính sách review lương 2 lần/năm'],
 ARRAY['Bonus tied to portfolio GMV','Direct work with major regional marketplaces','Salary review twice a year'], 5),
('office-admin', 'Nhân viên Hành chính Văn phòng', 'Office Administrator', 'Hành chính văn phòng', 'Full-time', 'Imperia Garden, Thanh Xuân, Hà Nội', 'Imperia Garden, Thanh Xuan, Hanoi', '9 - 12 triệu', '9 - 12M VND', '2026-03-15',
 'Đảm bảo vận hành văn phòng trơn tru: quản lý tài sản, lễ tân, hỗ trợ tổ chức sự kiện nội bộ cho ADFI.',
 'Keep the ADFI office running smoothly: asset management, front desk, and support for internal events.',
 ARRAY['Kinh nghiệm hành chính văn phòng từ 1 năm','Giao tiếp tốt, chủ động, chỉn chu','Sử dụng thành thạo tin học văn phòng'],
 ARRAY['At least 1 year of office administration experience','Great communication, proactive and organised','Proficient with office software'],
 ARRAY['Môi trường làm việc thân thiện','Nghỉ phép theo quy định và ngày sinh nhật','Quà tặng dịp lễ, Tết'],
 ARRAY['Friendly working environment','Statutory leave plus a birthday day off','Holiday and Tet gifts'], 6),
('content-creator-ctv', 'Cộng tác viên Sáng tạo Nội dung', 'Content Creator Collaborator', 'Marketing', 'CTV', 'Remote', 'Remote', 'Theo sản phẩm', 'Per deliverable', '2026-05-31',
 'Sản xuất nội dung ngắn (TikTok, Reels) cho các chiến dịch affiliate của ADFI, làm việc linh hoạt theo dự án.',
 'Produce short-form content (TikTok, Reels) for ADFI affiliate campaigns on a flexible project basis.',
 ARRAY['Có kênh cá nhân hoặc portfolio nội dung','Biết dựng video cơ bản (CapCut, Premiere)','Bắt trend nhanh, chủ động thời gian'],
 ARRAY['Own channel or content portfolio','Basic video editing (CapCut, Premiere)','Fast on trends and self-managed'],
 ARRAY['Thù lao theo sản phẩm, thanh toán nhanh','Được hỗ trợ brief và tài nguyên sản xuất','Cơ hội trở thành nhân sự chính thức'],
 ARRAY['Per-deliverable pay with fast settlement','Briefs and production resources provided','Opportunity to convert to full-time'], 7),
('remote-digital-analyst', 'Chuyên viên Phân tích Dữ liệu (Remote)', 'Digital Data Analyst (Remote)', 'Digital', 'Remote', 'Remote - Đông Nam Á', 'Remote - Southeast Asia', '20 - 32 triệu', '20 - 32M VND', '2026-04-30',
 'Xây dựng báo cáo hiệu quả chiến dịch đa thị trường, phát hiện cơ hội tối ưu cho đội Digital và E-commerce.',
 'Build multi-market campaign performance reporting and surface optimisation opportunities for the Digital and E-commerce teams.',
 ARRAY['Thành thạo SQL và một công cụ BI (Looker, Power BI)','Kinh nghiệm với dữ liệu marketing/affiliate','Tiếng Anh đọc hiểu tốt'],
 ARRAY['Strong SQL and one BI tool (Looker, Power BI)','Experience with marketing/affiliate data','Good written English'],
 ARRAY['Làm việc từ xa 100%','Hỗ trợ thiết bị làm việc','Thưởng hiệu suất theo quý'],
 ARRAY['100% remote','Equipment allowance','Quarterly performance bonus'], 8);