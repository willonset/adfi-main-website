import { createServerFn } from "@tanstack/react-start";

export type LeadInput = {
  role: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  lang: string;
};

/** Public: save a website lead and notify the team by email. */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: LeadInput) => {
    const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
    const email = str(input.email, 200).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email");
    const name = str(input.name, 120);
    if (name.length < 2) throw new Error("Invalid name");
    return {
      role: str(input.role, 60),
      name,
      phone: str(input.phone, 40),
      email,
      message: str(input.message, 4000),
      lang: str(input.lang, 5) || "vi",
    };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert({
      role: data.role,
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message,
      lang: data.lang,
      source: "website",
    });
    if (error) throw new Error("Could not save lead");

    const { sendNotification, rowsToHtml } = await import("./notify.server");
    await sendNotification({
      subject: `[ADFI] Khách hàng mới: ${data.name}`,
      replyTo: data.email,
      html: rowsToHtml("Lead mới từ website", [
        ["Vai trò", data.role],
        ["Họ tên", data.name],
        ["Email", data.email],
        ["Điện thoại", data.phone],
        ["Nội dung", data.message],
        ["Ngôn ngữ", data.lang],
        ["Thời gian", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })],
      ]),
    });

    return { ok: true };
  });
