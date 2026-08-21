import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/jobs")({
  head: () => ({
    meta: [
      { title: "Tuyển dụng — ADFI Admin" },
      { name: "description", content: "Đăng, kết thúc và xóa tin tuyển dụng của ADFI." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Tuyển dụng — ADFI Admin" },
      { property: "og:description", content: "Đăng, kết thúc và xóa tin tuyển dụng của ADFI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JobsAdminPage,
});

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
  is_open: boolean;
  sort_order: number;
};

const DEPARTMENTS = ["Sales", "Marketing", "Digital", "Logistic", "E-commerce", "Hành chính văn phòng"];
const TYPES = ["Full-time", "Remote", "CTV"];

const EMPTY: Job = {
  id: "",
  slug: "",
  title_vi: "",
  title_en: "",
  department: "Sales",
  employment_type: "Full-time",
  location_vi: "Hà Nội",
  location_en: "Hanoi",
  salary_vi: "",
  salary_en: "",
  deadline: "",
  description_vi: "",
  description_en: "",
  requirements_vi: [],
  requirements_en: [],
  benefits_vi: [],
  benefits_en: [],
  is_open: true,
  sort_order: 0,
};

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const toLines = (arr: string[]) => (arr ?? []).join("\n");
const fromLines = (v: string) =>
  v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

/** Textarea that keeps raw typed text (spaces/newlines) and only parses to lines on change. */
function LinesField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (lines: string[]) => void;
}) {
  const [text, setText] = useState(() => toLines(value));
  return (
    <div className="admin-field">
      <label>{label}</label>
      <textarea
        className="admin-textarea"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(fromLines(e.target.value));
        }}
      />
    </div>
  );
}


function JobsAdminPage() {
  const [rows, setRows] = useState<Job[] | null>(null);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [draft, setDraft] = useState<Job | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setRows((data as Job[] | null) ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows ?? []).filter((r) => {
      if (dept && r.department !== dept) return false;
      if (!needle) return true;
      return `${r.title_vi} ${r.title_en} ${r.slug}`.toLowerCase().includes(needle);
    });
  }, [rows, q, dept]);

  async function toggleOpen(job: Job) {
    await supabase.from("jobs").update({ is_open: !job.is_open }).eq("id", job.id);
    setRows((prev) => (prev ?? []).map((r) => (r.id === job.id ? { ...r, is_open: !job.is_open } : r)));
  }

  async function remove(job: Job) {
    if (!confirm(`Xóa tin "${job.title_vi}"?`)) return;
    await supabase.from("jobs").delete().eq("id", job.id);
    setRows((prev) => (prev ?? []).filter((r) => r.id !== job.id));
  }

  async function save() {
    if (!draft) return;
    setError("");
    if (!draft.title_vi.trim()) {
      setError("Vui lòng nhập tên vị trí (tiếng Việt).");
      return;
    }
    setSaving(true);
    const payload = {
      slug: draft.slug.trim() || slugify(draft.title_vi),
      title_vi: draft.title_vi.trim(),
      title_en: (draft.title_en || draft.title_vi).trim(),
      department: draft.department,
      employment_type: draft.employment_type,
      location_vi: draft.location_vi || "Hà Nội",
      location_en: draft.location_en || "Hanoi",
      salary_vi: draft.salary_vi || null,
      salary_en: draft.salary_en || null,
      deadline: draft.deadline || null,
      description_vi: draft.description_vi,
      description_en: draft.description_en || draft.description_vi,
      requirements_vi: draft.requirements_vi,
      requirements_en: draft.requirements_en.length ? draft.requirements_en : draft.requirements_vi,
      benefits_vi: draft.benefits_vi,
      benefits_en: draft.benefits_en.length ? draft.benefits_en : draft.benefits_vi,
      is_open: draft.is_open,
      sort_order: Number(draft.sort_order) || 0,
    };
    const res = draft.id
      ? await supabase.from("jobs").update(payload).eq("id", draft.id)
      : await supabase.from("jobs").insert(payload);
    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setDraft(null);
    void load();
  }

  return (
    <AdminShell
      title="Quản lý tuyển dụng"
      subtitle="Đăng tin mới, kết thúc hoặc xóa vị trí"
      actions={
        <button className="admin-btn" onClick={() => setDraft({ ...EMPTY })}>
          + Đăng tin mới
        </button>
      }
    >
      <div className="admin-toolbar">
        <input
          className="admin-input"
          placeholder="Tìm theo tên vị trí..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="admin-select" value={dept} onChange={(e) => setDept(e.target.value)}>
          <option value="">Tất cả bộ phận</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <span className="admin-note">{filtered.length} tin</span>
      </div>

      <div className="panel">
        {rows === null ? (
          <p className="admin-note">Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p className="admin-note">Chưa có tin tuyển dụng nào.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vị trí</th>
                <th>Bộ phận</th>
                <th>Hình thức</th>
                <th>Hạn nộp</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.title_vi}
                    <br />
                    <span className="muted">/{r.slug}</span>
                  </td>
                  <td>{r.department}</td>
                  <td>{r.employment_type}</td>
                  <td className="muted">{r.deadline ?? "—"}</td>
                  <td>
                    <span className={`badge ${r.is_open ? "ok" : "off"}`}>
                      {r.is_open ? "Đang mở" : "Đã đóng"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="admin-btn ghost sm" onClick={() => setDraft({ ...r })}>
                        Sửa
                      </button>
                      <button className="admin-btn ghost sm" onClick={() => void toggleOpen(r)}>
                        {r.is_open ? "Kết thúc" : "Mở lại"}
                      </button>
                      <button className="admin-btn ghost sm" onClick={() => void remove(r)}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {draft ? (
        <div className="admin-modal-backdrop" onClick={() => setDraft(null)}>
          <div className="admin-modal wide" onClick={(e) => e.stopPropagation()}>
            <h2>{draft.id ? "Sửa tin tuyển dụng" : "Đăng tin tuyển dụng"}</h2>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Tên vị trí (VI) *</label>
                <input
                  className="admin-input"
                  value={draft.title_vi}
                  onChange={(e) => setDraft({ ...draft, title_vi: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Tên vị trí (EN)</label>
                <input
                  className="admin-input"
                  value={draft.title_en}
                  onChange={(e) => setDraft({ ...draft, title_en: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Đường dẫn (slug)</label>
                <input
                  className="admin-input"
                  placeholder={slugify(draft.title_vi) || "vi-tri-moi"}
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Bộ phận</label>
                <select
                  className="admin-select"
                  value={draft.department}
                  onChange={(e) => setDraft({ ...draft, department: e.target.value })}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label>Hình thức</label>
                <select
                  className="admin-select"
                  value={draft.employment_type}
                  onChange={(e) => setDraft({ ...draft, employment_type: e.target.value })}
                >
                  {TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label>Hạn nộp</label>
                <input
                  className="admin-input"
                  type="date"
                  value={draft.deadline ?? ""}
                  onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Địa điểm (VI)</label>
                <input
                  className="admin-input"
                  value={draft.location_vi}
                  onChange={(e) => setDraft({ ...draft, location_vi: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Địa điểm (EN)</label>
                <input
                  className="admin-input"
                  value={draft.location_en}
                  onChange={(e) => setDraft({ ...draft, location_en: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Lương (VI)</label>
                <input
                  className="admin-input"
                  value={draft.salary_vi ?? ""}
                  onChange={(e) => setDraft({ ...draft, salary_vi: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Lương (EN)</label>
                <input
                  className="admin-input"
                  value={draft.salary_en ?? ""}
                  onChange={(e) => setDraft({ ...draft, salary_en: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Thứ tự hiển thị</label>
                <input
                  className="admin-input"
                  type="number"
                  value={draft.sort_order}
                  onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                />
              </div>
              <div className="admin-field">
                <label>Trạng thái</label>
                <select
                  className="admin-select"
                  value={draft.is_open ? "1" : "0"}
                  onChange={(e) => setDraft({ ...draft, is_open: e.target.value === "1" })}
                >
                  <option value="1">Đang mở</option>
                  <option value="0">Đã đóng</option>
                </select>
              </div>
            </div>

            <div className="admin-field" style={{ marginTop: 14 }}>
              <label>Mô tả công việc (VI)</label>
              <textarea
                className="admin-textarea"
                value={draft.description_vi}
                onChange={(e) => setDraft({ ...draft, description_vi: e.target.value })}
              />
            </div>
            <div className="admin-field" style={{ marginTop: 14 }}>
              <label>Mô tả công việc (EN)</label>
              <textarea
                className="admin-textarea"
                value={draft.description_en}
                onChange={(e) => setDraft({ ...draft, description_en: e.target.value })}
              />
            </div>
            <div className="admin-form-grid" style={{ marginTop: 14 }}>
              <div className="admin-field">
                <label>Yêu cầu (VI) — mỗi dòng một ý</label>
                <textarea
                  className="admin-textarea"
                  value={toLines(draft.requirements_vi)}
                  onChange={(e) => setDraft({ ...draft, requirements_vi: fromLines(e.target.value) })}
                />
              </div>
              <div className="admin-field">
                <label>Yêu cầu (EN)</label>
                <textarea
                  className="admin-textarea"
                  value={toLines(draft.requirements_en)}
                  onChange={(e) => setDraft({ ...draft, requirements_en: fromLines(e.target.value) })}
                />
              </div>
              <div className="admin-field">
                <label>Quyền lợi (VI)</label>
                <textarea
                  className="admin-textarea"
                  value={toLines(draft.benefits_vi)}
                  onChange={(e) => setDraft({ ...draft, benefits_vi: fromLines(e.target.value) })}
                />
              </div>
              <div className="admin-field">
                <label>Quyền lợi (EN)</label>
                <textarea
                  className="admin-textarea"
                  value={toLines(draft.benefits_en)}
                  onChange={(e) => setDraft({ ...draft, benefits_en: fromLines(e.target.value) })}
                />
              </div>
            </div>

            {error ? <p className="admin-error">{error}</p> : null}
            <div className="admin-modal-actions">
              <button className="admin-btn ghost" onClick={() => setDraft(null)}>
                Hủy
              </button>
              <button className="admin-btn" disabled={saving} onClick={() => void save()}>
                {saving ? "Đang lưu..." : "Lưu tin"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
