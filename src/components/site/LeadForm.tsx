import { useState } from "react";
import { type Lang, makeT } from "@/i18n";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/lead.functions";


const LEAD_URL =
  "https://script.google.com/macros/s/AKfycby76ZkWV2aOAbUA-h7q-mx2LRNKW964plIHBVpl2sZepZzM_8kw3xcAADnB7jNJv43n/exec";

const ROLES = ["Marketplace", "Brand", "Advertiser", "Creator"];

export function LeadForm({ lang, defaultRole }: { lang: Lang; defaultRole?: string | undefined }) {
  const t = makeT(lang);
  const sendLead = useServerFn(submitLead);
  const [role, setRole] = useState(defaultRole ?? "");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err" | "info"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const payload = {
      role,
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""),
    };
    if (payload.website) return; // honeypot
    setSending(true);
    setStatus({ kind: "info", text: t("form.sending") });
    try {
      await sendLead({
        data: {
          role: payload.role,
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          message: payload.message,
          lang,
        },
      });
      // Keep the existing Google Sheet notification as a best-effort mirror.
      void fetch(LEAD_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      }).catch(() => undefined);
      setStatus({ kind: "ok", text: t("form.ok") });
      form.reset();
      setRole("");
    } catch {
      setStatus({ kind: "err", text: t("form.err") });
    } finally {
      setSending(false);
    }

  }

  return (
    <section className="section-pad form-section" id="lead-form">
      <div className="wrap">
        <h2 className="center-head">
          {t("form.heading1")}
          <br />
          <span className="red">{t("form.heading2")}</span>
        </h2>
        <form className="contact-form" onSubmit={onSubmit}>
          <div className="field">
            <span className="form-label">{t("form.youAre")}</span>
            <div className="role-tabs">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={role === r ? "active" : ""}
                  onClick={() => setRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="lf-name">{t("form.name")}</label>
            <input id="lf-name" type="text" name="name" placeholder={t("form.namePh")} required />
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="lf-phone">{t("form.phone")}</label>
              <input
                id="lf-phone"
                type="tel"
                name="phone"
                placeholder={t("form.phonePh")}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="lf-email">{t("form.email")}</label>
              <input
                id="lf-email"
                type="email"
                name="email"
                placeholder={t("form.emailPh")}
                required
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="lf-msg">{t("form.message")}</label>
            <textarea id="lf-msg" name="message" placeholder={t("form.messagePh")} />
          </div>
          <input
            type="text"
            name="website"
            className="hp"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <button className="btn-primary" type="submit" disabled={sending}>
            {sending ? t("form.sending") : t("form.submit")}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          {status && (
            <p
              className={`form-status ${status.kind === "info" ? "" : status.kind}`}
              role="status"
              aria-live="polite"
            >
              {status.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
