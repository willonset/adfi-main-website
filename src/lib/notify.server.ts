const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

/** Where internal notifications are delivered. */
export const NOTIFY_TO = process.env["NOTIFY_EMAIL_TO"] ?? "contact@adfi.vn";
/** Verified Resend sender. */
export const NOTIFY_FROM = process.env["NOTIFY_EMAIL_FROM"] ?? "ADFI Website <noreply@adfi.vn>";

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export function rowsToHtml(title: string, rows: Array<[string, unknown]>) {
  const body = rows
    .filter(([, v]) => String(v ?? "").trim() !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;white-space:nowrap">${esc(
          k,
        )}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111">${esc(v).replace(
          /\n/g,
          "<br>",
        )}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;background:#ffffff;padding:24px">
    <h2 style="color:#EC221F;margin:0 0 16px">${esc(title)}</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px">${body}</table>
    <p style="color:#888;font-size:12px;margin-top:20px">Gửi tự động từ website adfi.vn</p>
  </div>`;
}

/** Best-effort internal notification email. Never throws. */
export async function sendNotification(opts: {
  subject: string;
  html: string;
  replyTo?: string | undefined;
  attachments?: Array<{ filename: string; content: string }> | undefined;
}): Promise<{ sent: boolean; error?: string }> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  if (!lovableKey || !resendKey) {
    console.error("[notify] missing LOVABLE_API_KEY or RESEND_API_KEY");
    return { sent: false, error: "missing_keys" };
  }
  try {
    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
        ...(opts.attachments?.length ? { attachments: opts.attachments } : {}),
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[notify] send failed [${res.status}]: ${text}`);
      return { sent: false, error: `${res.status}: ${text}` };
    }
    const payload = (await res.json().catch(() => ({}))) as { id?: string };
    console.log(`[notify] sent ok id=${payload.id ?? "unknown"} subject=${opts.subject}`);
    return { sent: true };
  } catch (e) {
    console.error("[notify] send error", e);
    return { sent: false, error: String(e) };
  }
}
