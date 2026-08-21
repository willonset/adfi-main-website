import { createServerFn } from "@tanstack/react-start";

export type ApplyInput = {
  jobId: string;
  jobSlug: string;
  position: string;
  fullname: string;
  email: string;
  phone: string;
  intro: string;
  sources: string[];
  sourceOther: string;
  lang: string;
  cvFilename: string;
  cvBase64: string;
  cvContentType: string;
};

const MAX_CV_BYTES = 5 * 1024 * 1024;

/** Public: submit a job application. CV is validated and stored server-side. */
export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((input: ApplyInput) => {
    const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
    const email = str(input.email, 200).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email");
    const fullname = str(input.fullname, 100);
    if (fullname.length < 2) throw new Error("Invalid name");
    const cvFilename = str(input.cvFilename, 200);
    if (!/\.(pdf|docx?)$/i.test(cvFilename)) throw new Error("Invalid CV file type");
    const cvBase64 = String(input.cvBase64 ?? "");
    if (!cvBase64 || cvBase64.length > Math.ceil((MAX_CV_BYTES * 4) / 3) + 1024) {
      throw new Error("Invalid CV file size");
    }
    if (!/^[A-Za-z0-9+/=\r\n]+$/.test(cvBase64)) throw new Error("Invalid CV payload");
    return {
      jobId: str(input.jobId, 64),
      jobSlug: str(input.jobSlug, 120).replace(/[^a-z0-9-]/gi, "-"),
      position: str(input.position, 200),
      fullname,
      email,
      phone: str(input.phone, 40),
      intro: str(input.intro, 4000),
      sources: (Array.isArray(input.sources) ? input.sources : []).slice(0, 20).map((s) => str(s, 100)),
      sourceOther: str(input.sourceOther, 200),
      lang: str(input.lang, 5) || "vi",
      cvFilename,
      cvBase64,
      cvContentType: str(input.cvContentType, 100) || "application/octet-stream",
    };
  })
  .handler(async ({ data }) => {
    const bytes = Buffer.from(data.cvBase64, "base64");
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_CV_BYTES) throw new Error("Invalid CV file size");

    const ext = data.cvFilename.split(".").pop()?.toLowerCase() ?? "pdf";
    const path = `${data.jobSlug || "job"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const upload = await supabaseAdmin.storage.from("cvs").upload(path, bytes, {
      contentType: data.cvContentType,
      upsert: false,
    });
    if (upload.error) throw new Error("Upload failed");

    const { error } = await supabaseAdmin.from("job_applications").insert({
      job_id: data.jobId || null,
      position: data.position,
      fullname: data.fullname,
      email: data.email,
      phone: data.phone,
      intro: data.intro,
      sources: data.sources,
      source_other: data.sourceOther,
      cv_path: path,
      cv_filename: data.cvFilename,
      lang: data.lang,
    });
    if (error) {
      await supabaseAdmin.storage.from("cvs").remove([path]);
      throw new Error("Could not save application");
    }

    const { sendNotification, rowsToHtml } = await import("./notify.server");
    await sendNotification({
      subject: `[ADFI] Ứng viên mới: ${data.fullname} - ${data.position}`,
      replyTo: data.email,
      html: rowsToHtml("Hồ sơ ứng tuyển mới", [
        ["Vị trí", data.position],
        ["Họ tên", data.fullname],
        ["Email", data.email],
        ["Điện thoại", data.phone],
        ["Giới thiệu", data.intro],
        ["Nguồn", [...data.sources, data.sourceOther].filter(Boolean).join(", ")],
        ["CV", data.cvFilename],
        ["Thời gian", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })],
      ]),
      attachments: [{ filename: data.cvFilename, content: data.cvBase64.replace(/\s/g, "") }],
    });

    return { ok: true };
  });
