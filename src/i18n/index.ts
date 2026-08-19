export type Lang = "vi" | "en";

export const LANGS: Lang[] = ["vi", "en"];

/** Maps a logical page key to its path in each language. */
export const routes = {
  home: { vi: "/", en: "/en" },
  marketplace: { vi: "/marketplace", en: "/en/marketplace" },
  brand: { vi: "/brand", en: "/en/brand" },
  advertiser: { vi: "/advertiser", en: "/en/advertiser" },
  creator: { vi: "/creator", en: "/en/creator" },
  about: { vi: "/about", en: "/en/about" },
  careers: { vi: "/tuyen-dung", en: "/en/careers" },
  blog: { vi: "/blog", en: "/en/blog" },

} as const;

export type PageKey = keyof typeof routes;

export function jobPath(lang: Lang, slug: string) {
  return lang === "vi" ? `/tuyen-dung/${slug}` : `/en/careers/${slug}`;
}

/** Given the current pathname, return the equivalent path in the other language. */
export function switchLangPath(pathname: string, to: Lang) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (to === "en") {
    if (clean.startsWith("/en")) return clean;
    if (clean === "/") return "/en";
    if (clean.startsWith("/tuyen-dung")) return `/en${clean.replace("/tuyen-dung", "/careers")}`;
    return `/en${clean}`;
  }
  if (!clean.startsWith("/en")) return clean;
  const rest = clean.slice(3) || "/";
  if (rest.startsWith("/careers")) return rest.replace("/careers", "/tuyen-dung");
  return rest;
}

type Dict = Record<string, string>;

const vi: Dict = {
  "nav.marketplace": "For Marketplace",
  "nav.brand": "For Brand",
  "nav.advertiser": "For Advertiser",
  "nav.creator": "For Creator",
  "nav.about": "About Us",
  "nav.careers": "Tuyển dụng",
  "nav.blog": "Blog",
  "nav.contact": "Liên hệ",

  "cta.title": "Bạn muốn tham gia cùng ADFI?",
  "cta.button": "Ứng tuyển ngay",

  "footer.tagline":
    "Hệ sinh thái Affiliate Marketing hàng đầu Đông Nam Á, giúp Marketplace - Brand - Advertiser - Creator tăng trưởng bền vững.",
  "footer.solutions": "Giải pháp",
  "footer.forMarketplace": "Dành cho nền tảng",
  "footer.forBrand": "Dành cho nhãn hàng",
  "footer.forAdvertiser": "Dành cho nhà quảng cáo",
  "footer.forCreator": "Dành cho nhà sáng tạo",
  "footer.company": "Công ty",
  "footer.about": "Về chúng tôi",
  "footer.careers": "Tuyển dụng",
  "footer.blog": "Blog",
  "footer.support": "Hỗ trợ",
  "footer.contact": "Liên hệ",
  "footer.rights": "© 2025 ADFI. All Rights Reserved.",
  "footer.policy": "Chính sách bảo mật",

  "form.heading1": "Sẵn sàng bứt phá doanh thu",
  "form.heading2": "cùng ADFI",
  "form.youAre": "Bạn là",
  "form.name": "Họ và tên",
  "form.namePh": "Nhập họ tên",
  "form.phone": "Số điện thoại",
  "form.phonePh": "Nhập SĐT",
  "form.email": "Email",
  "form.emailPh": "Nhập Email",
  "form.message": "Nhu cầu hợp tác",
  "form.messagePh": "Mô tả nhu cầu của bạn",
  "form.submit": "Gửi thông tin",
  "form.sending": "Đang gửi...",
  "form.ok": "Cảm ơn bạn! Chúng tôi sẽ liên hệ trong thời gian sớm nhất.",
  "form.err": "Có lỗi xảy ra, vui lòng thử lại hoặc liên hệ trực tiếp với chúng tôi.",

  "careers.eyebrow": "Cơ hội nghề nghiệp",
  "careers.title1": "Cùng ADFI",
  "careers.title2": "kiến tạo tương lai",
  "careers.title3": "thương mại số",
  "careers.lead":
    "Chúng tôi tìm kiếm những người trẻ dám nghĩ lớn, làm nhanh và học liên tục. Khám phá các vị trí đang mở tại ADFI.",
  "careers.searchPh": "Tìm theo tên vị trí...",
  "careers.department": "Bộ phận",
  "careers.type": "Hình thức",
  "careers.all": "Tất cả",
  "careers.clear": "Xóa bộ lọc",
  "careers.count": "vị trí đang mở",
  "careers.location": "Địa điểm",
  "careers.deadline": "Hạn nộp",
  "careers.apply": "Apply Now",
  "careers.empty": "Chưa có vị trí nào phù hợp với bộ lọc của bạn.",
  "careers.loading": "Đang tải vị trí tuyển dụng...",
  "careers.back": "Quay lại danh sách",
  "careers.jd": "Mô tả công việc",
  "careers.requirements": "Yêu cầu",
  "careers.benefits": "Quyền lợi",
  "careers.salary": "Mức lương",
  "careers.notFound": "Không tìm thấy vị trí này",
  "careers.notFoundDesc": "Vị trí có thể đã đóng. Xem các vị trí khác đang mở.",

  "apply.title": "Thông tin ứng viên",
  "apply.fullname": "Họ và tên",
  "apply.email": "Email",
  "apply.phone": "Số điện thoại",
  "apply.intro": "Giới thiệu ngắn gọn về bản thân để gây ấn tượng với ADFI?",
  "apply.position": "Vị trí ứng tuyển",
  "apply.source": "Bạn biết đến ADFI qua đâu?",
  "apply.other": "Khác:",
  "apply.cv": "File CV",
  "apply.upload": "Chọn tệp để tải lên",
  "apply.cvNote1": "Định dạng cho phép: .doc, .docx, .pdf (tối đa 5MB)",
  "apply.cvNote2": "Đặt tên file theo mẫu CV_vitri_hoten",
  "apply.submit": "GỬI HỒ SƠ",
  "apply.sending": "Đang gửi...",
  "apply.ok": "Cảm ơn bạn! ADFI đã nhận được hồ sơ và sẽ phản hồi sớm nhất.",
  "apply.err": "Không gửi được hồ sơ. Vui lòng thử lại sau ít phút.",
  "apply.notConfigured":
    "Kênh nhận hồ sơ chưa được cấu hình. Vui lòng gửi CV tới contact@adfi.vn.",
  "apply.close": "Đóng",
};

const en: Dict = {
  "nav.marketplace": "For Marketplace",
  "nav.brand": "For Brand",
  "nav.advertiser": "For Advertiser",
  "nav.creator": "For Creator",
  "nav.about": "About Us",
  "nav.careers": "Careers",
  "nav.blog": "Blog",
  "nav.contact": "Contact Us",

  "cta.title": "You wanna join ADFI team?",
  "cta.button": "Apply now",

  "footer.tagline":
    "Southeast Asia's leading Affiliate Marketing ecosystem, helping Marketplaces, Brands, Advertisers and Creators grow sustainably.",
  "footer.solutions": "Solutions",
  "footer.forMarketplace": "For Marketplace",
  "footer.forBrand": "For Brand",
  "footer.forAdvertiser": "For Advertiser",
  "footer.forCreator": "For Creator",
  "footer.company": "Company",
  "footer.about": "About us",
  "footer.careers": "Careers",
  "footer.blog": "Blog",
  "footer.support": "Support",
  "footer.contact": "Contact",
  "footer.rights": "© 2025 ADFI. All Rights Reserved.",
  "footer.policy": "Privacy Policy",

  "form.heading1": "Ready to accelerate your revenue",
  "form.heading2": "with ADFI",
  "form.youAre": "You are",
  "form.name": "Full name",
  "form.namePh": "Enter your full name",
  "form.phone": "Phone number",
  "form.phonePh": "Enter your phone number",
  "form.email": "Email",
  "form.emailPh": "Enter your email",
  "form.message": "What are you looking for?",
  "form.messagePh": "Describe your needs",
  "form.submit": "Send request",
  "form.sending": "Sending...",
  "form.ok": "Thank you! Our team will get back to you shortly.",
  "form.err": "Something went wrong. Please try again or contact us directly.",

  "careers.eyebrow": "Job Opportunities",
  "careers.title1": "Build the future of",
  "careers.title2": "digital commerce",
  "careers.title3": "with ADFI",
  "careers.lead":
    "We look for people who think big, move fast and keep learning. Explore the roles we are hiring for right now.",
  "careers.searchPh": "Search by job title...",
  "careers.department": "Department",
  "careers.type": "Job type",
  "careers.all": "All",
  "careers.clear": "Clear filters",
  "careers.count": "open positions",
  "careers.location": "Location",
  "careers.deadline": "Deadline",
  "careers.apply": "Apply Now",
  "careers.empty": "No positions match your filters yet.",
  "careers.loading": "Loading open positions...",
  "careers.back": "Back to all jobs",
  "careers.jd": "Job description",
  "careers.requirements": "Requirements",
  "careers.benefits": "Benefits",
  "careers.salary": "Salary",
  "careers.notFound": "Position not found",
  "careers.notFoundDesc": "This role may have closed. Browse our other open positions.",

  "apply.title": "Candidate Information",
  "apply.fullname": "Fullname",
  "apply.email": "Email",
  "apply.phone": "Phone number",
  "apply.intro": "Write a brief but unique introduction to impress ADFI?",
  "apply.position": "Position",
  "apply.source": "How do you know about our company?",
  "apply.other": "Other:",
  "apply.cv": "File CV",
  "apply.upload": "Click to Upload",
  "apply.cvNote1": "Type of file attachments is .doc, .docx, .pdf (max 5MB)",
  "apply.cvNote2": "Set the file name as CV_job_function_first_name_last_name",
  "apply.submit": "SUBMIT",
  "apply.sending": "Submitting...",
  "apply.ok": "Thank you! We have received your application and will be in touch.",
  "apply.err": "We could not submit your application. Please try again in a moment.",
  "apply.notConfigured":
    "The application channel is not configured yet. Please send your CV to contact@adfi.vn.",
  "apply.close": "Close",
};

const dicts: Record<Lang, Dict> = { vi, en };

export function makeT(lang: Lang) {
  return (key: string) => dicts[lang][key] ?? dicts.vi[key] ?? key;
}

export const SOURCE_OPTIONS = [
  { value: "Fanpage ADFI Careers", vi: "Fanpage ADFI Careers", en: "Fanpage ADFI Careers" },
  { value: "TikTok", vi: "TikTok", en: "TikTok" },
  { value: "LinkedIn", vi: "LinkedIn", en: "LinkedIn" },
  { value: "Job Posting", vi: "Tin tuyển dụng", en: "Job Posting" },
  { value: "Jobsite", vi: "Website việc làm", en: "Jobsite" },
  { value: "Friends", vi: "Bạn bè giới thiệu", en: "Friends" },
];
