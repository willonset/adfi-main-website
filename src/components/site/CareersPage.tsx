import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "./SiteLayout";
import { type Lang, makeT, SOURCE_OPTIONS } from "@/i18n";
import { submitApplication } from "@/lib/apply.functions";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read error"));
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.readAsDataURL(file);
  });
}

const DEPARTMENTS = ["Sales", "Marketing", "Digital", "Logistic", "E-commerce", "Hành chính văn phòng"];
const DEPARTMENT_EN: Record<string, string> = {
  Sales: "Sales",
  Marketing: "Marketing",
  Digital: "Digital",
  Logistic: "Logistics",
  "E-commerce": "E-commerce",
  "Hành chính văn phòng": "Office Administration",
};
const TYPES = ["Full-time", "Part-time", "Hybrid", "Remote"];

type Job = {
  id: string;
  slug: string;
  title_vi: string;
  title_en: string;
  department: string;
  employment_type: string;
  location_vi: string;
  location_en: string;
  salary_vi: string | null;
  salary_en: string | null;
  deadline: string | null;
  description_vi: string;
  description_en: string;
  requirements_vi: string[];
  requirements_en: string[];
  benefits_vi: string[];
  benefits_en: string[];
};

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.2 1.9" strokeLinecap="round" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function fmtDate(value: string | null, lang: Lang) {
  if (!value) return lang === "vi" ? "Không giới hạn" : "Open until filled";
  const d = new Date(value);
  return d.toLocaleDateString(lang === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function CareersPage({ lang }: { lang: Lang }) {
  const t = makeT(lang);
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [dept, setDept] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<Job | null>(null);
  const [applyFor, setApplyFor] = useState<Job | null>(null);

  useEffect(() => {
    void supabase
      .from("jobs")
      .select("*")
      .eq("is_open", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setJobs((data as Job[] | null) ?? []));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (jobs ?? []).filter((j) => {
      if (dept && j.department !== dept) return false;
      if (type && j.employment_type !== type) return false;
      if (needle) {
        const hay = `${j.title_vi} ${j.title_en} ${j.department}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [jobs, dept, type, q]);

  const title = (j: Job) => (lang === "vi" ? j.title_vi : j.title_en);
  const deptLabel = (d: string) => (lang === "vi" ? d : (DEPARTMENT_EN[d] ?? d));

  return (
    <SiteLayout lang={lang}>
      <section className="careers-hero">
        <div className="hero-glow"></div>
        <div className="wrap">
          <span className="eyebrow">{t("careers.eyebrow")}</span>
          <h1>
            {t("careers.title1")} <span className="red">{t("careers.title2")}</span>{" "}
            {t("careers.title3")}
          </h1>
          <p className="lead">{t("careers.lead")}</p>
        </div>
      </section>

      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="job-filters">
            <div className="job-search">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("careers.searchPh")}
                aria-label={t("careers.searchPh")}
              />
              <span className="job-count">
                <b>{filtered.length}</b> {t("careers.count")}
              </span>
            </div>
            <div className="filter-group">
              <span className="filter-label">{t("careers.department")}</span>
              <button className={`chip ${dept === null ? "active" : ""}`} onClick={() => setDept(null)}>
                {t("careers.all")}
              </button>
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  className={`chip ${dept === d ? "active" : ""}`}
                  onClick={() => setDept(d)}
                >
                  {deptLabel(d)}
                </button>
              ))}
            </div>
            <div className="filter-group">
              <span className="filter-label">{t("careers.type")}</span>
              <button className={`chip ${type === null ? "active" : ""}`} onClick={() => setType(null)}>
                {t("careers.all")}
              </button>
              {TYPES.map((x) => (
                <button
                  key={x}
                  className={`chip ${type === x ? "active" : ""}`}
                  onClick={() => setType(x)}
                >
                  {x}
                </button>
              ))}
              {(dept || type || q) && (
                <button
                  className="btn-clear"
                  onClick={() => {
                    setDept(null);
                    setType(null);
                    setQ("");
                  }}
                >
                  {t("careers.clear")}
                </button>
              )}
            </div>
          </div>

          <div className="job-grid">
            {jobs === null && <div className="job-empty">{t("careers.loading")}</div>}
            {jobs !== null && filtered.length === 0 && (
              <div className="job-empty">{t("careers.empty")}</div>
            )}
            {filtered.map((j) => (
              <article key={j.id} className="job-card">
                <div className="job-badges">
                  <span className="badge">{deptLabel(j.department)}</span>
                  <span className="badge type">{j.employment_type}</span>
                </div>
                <h3>
                  <button
                    type="button"
                    onClick={() => setDetail(j)}
                    style={{ background: "none", border: 0, padding: 0, font: "inherit", cursor: "pointer", textAlign: "left" }}
                  >
                    {title(j)}
                  </button>
                </h3>
                <div className="job-meta">
                  <div>
                    <PinIcon />
                    <span>{lang === "vi" ? j.location_vi : j.location_en}</span>
                  </div>
                  <div>
                    <ClockIcon />
                    <span>
                      {t("careers.deadline")}: {fmtDate(j.deadline, lang)}
                    </span>
                  </div>
                </div>
                <div className="job-card-foot">
                  <span className="job-company">ADFI</span>
                  <button className="btn-apply" onClick={() => setDetail(j)}>
                    {t("careers.apply")} <ArrowIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {detail && (
        <JobDetailModal
          job={detail}
          lang={lang}
          onClose={() => setDetail(null)}
          onApply={() => {
            setApplyFor(detail);
            setDetail(null);
          }}
        />
      )}
      {applyFor && (
        <ApplyModal job={applyFor} lang={lang} onClose={() => setApplyFor(null)} />
      )}
    </SiteLayout>
  );
}

function CloseButton({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <button className="modal-close" onClick={onClose} aria-label={label}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    </button>
  );
}

function JobDetailModal({
  job,
  lang,
  onClose,
  onApply,
}: {
  job: Job;
  lang: Lang;
  onClose: () => void;
  onApply: () => void;
}) {
  const t = makeT(lang);
  const reqs = lang === "vi" ? job.requirements_vi : job.requirements_en;
  const bens = lang === "vi" ? job.benefits_vi : job.benefits_en;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{lang === "vi" ? job.title_vi : job.title_en}</h2>
          <CloseButton onClose={onClose} label={t("apply.close")} />
        </div>
        <div className="modal-body">
          <div className="job-badges">
            <span className="badge">{job.department}</span>
            <span className="badge type">{job.employment_type}</span>
          </div>
          <div className="job-meta">
            <div>
              <PinIcon />
              <span>{lang === "vi" ? job.location_vi : job.location_en}</span>
            </div>
            <div>
              <ClockIcon />
              <span>
                {t("careers.deadline")}: {fmtDate(job.deadline, lang)}
              </span>
            </div>
            {(lang === "vi" ? job.salary_vi : job.salary_en) && (
              <div>
                <span>
                  {t("careers.salary")}: {lang === "vi" ? job.salary_vi : job.salary_en}
                </span>
              </div>
            )}
          </div>
          <div className="jd-section">
            <h2>{t("careers.jd")}</h2>
            <p>{lang === "vi" ? job.description_vi : job.description_en}</p>
          </div>
          {reqs.length > 0 && (
            <div className="jd-section">
              <h2>{t("careers.requirements")}</h2>
              <ul>
                {reqs.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
          {bens.length > 0 && (
            <div className="jd-section">
              <h2>{t("careers.benefits")}</h2>
              <ul>
                {bens.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}
          <button className="modal-submit" onClick={onApply}>
            {t("careers.apply").toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplyModal({ job, lang, onClose }: { job: Job; lang: Lang; onClose: () => void }) {
  const t = makeT(lang);
  const [sources, setSources] = useState<string[]>([]);
  const [other, setOther] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  function toggleSource(v: string) {
    setSources((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFileError("");
    if (!f) {
      setFile(null);
      return;
    }
    if (!/\.(pdf|docx?|)$/i.test(f.name) || !/\.(pdf|docx?)$/i.test(f.name)) {
      setFileError(t("apply.cvNote1"));
      setFile(null);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setFileError(t("apply.cvNote1"));
      setFile(null);
      return;
    }
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (!file) {
      setFileError(t("apply.cvNote1"));
      return;
    }
    const data = new FormData(form);
    setSending(true);
    setStatus(null);
    try {
      const website = String(data.get("website") ?? "");
      if (website) return; // honeypot
      await submitApplication({
        data: {
          jobId: job.id,
          jobSlug: job.slug,
          position: lang === "vi" ? job.title_vi : job.title_en,
          fullname: String(data.get("fullname") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          phone: String(data.get("phone") ?? "").trim(),
          intro: String(data.get("intro") ?? "").trim(),
          sources,
          sourceOther: other.trim(),
          lang,
          cvFilename: file.name,
          cvContentType: file.type || "application/octet-stream",
          cvBase64: await fileToBase64(file),
        },
      });

      setStatus({ kind: "ok", text: t("apply.ok") });
      form.reset();
      setFile(null);
      setSources([]);
      setOther("");
    } catch {
      setStatus({ kind: "err", text: t("apply.err") });
    } finally {
      setSending(false);
    }

  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{t("apply.title")}</h2>
          <CloseButton onClose={onClose} label={t("apply.close")} />
        </div>
        <form className="modal-body" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="ap-name">
              <span className="req">*</span>
              {t("apply.fullname")}
            </label>
            <input id="ap-name" name="fullname" type="text" required maxLength={100} />
          </div>
          <div className="field">
            <label htmlFor="ap-email">
              <span className="req">*</span>
              {t("apply.email")}
            </label>
            <input id="ap-email" name="email" type="email" required maxLength={255} />
          </div>
          <div className="field">
            <label htmlFor="ap-phone">
              <span className="req">*</span>
              {t("apply.phone")}
            </label>
            <input id="ap-phone" name="phone" type="tel" required maxLength={20} />
          </div>
          <div className="field">
            <label htmlFor="ap-intro">{t("apply.intro")}</label>
            <textarea id="ap-intro" name="intro" maxLength={1500} />
          </div>
          <div className="field">
            <label htmlFor="ap-pos">{t("apply.position")}</label>
            <input
              id="ap-pos"
              type="text"
              readOnly
              value={lang === "vi" ? job.title_vi : job.title_en}
            />
          </div>
          <div className="field">
            <span className="form-label">{t("apply.source")}</span>
            <div className="check-grid">
              {SOURCE_OPTIONS.map((o) => (
                <label className="check" key={o.value}>
                  <input
                    type="checkbox"
                    checked={sources.includes(o.value)}
                    onChange={() => toggleSource(o.value)}
                  />
                  <span>{lang === "vi" ? o.vi : o.en}</span>
                </label>
              ))}
            </div>
            <div className="check-other" style={{ marginTop: 12 }}>
              <span>{t("apply.other")}</span>
              <input
                type="text"
                value={other}
                maxLength={100}
                onChange={(e) => setOther(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <span className="form-label">
              <span className="req">*</span>
              {t("apply.cv")}
            </span>
            <label className="upload-btn">
              <input
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={onFile}
                style={{ display: "none" }}
              />
              {t("apply.upload")}
            </label>
            {file && <p className="file-name">{file.name}</p>}
            {fileError && <p className="field-error">{fileError}</p>}
            <p className="upload-note">
              {t("apply.cvNote1")}
              <br />
              {t("apply.cvNote2")}
            </p>
          </div>
          <input
            type="text"
            name="website"
            className="hp"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <button className="modal-submit" type="submit" disabled={sending}>
            {sending ? t("apply.sending") : t("apply.submit")}
          </button>
          {status && (
            <p className={`form-status ${status.kind}`} role="status" aria-live="polite">
              {status.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
