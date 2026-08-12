import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/applications")({
  head: () => ({
    meta: [
      { title: "Hồ sơ ứng tuyển — ADFI Admin" },
      { name: "description", content: "Xem và xử lý hồ sơ ứng tuyển gửi về ADFI." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Hồ sơ ứng tuyển — ADFI Admin" },
      { property: "og:description", content: "Xem và xử lý hồ sơ ứng tuyển gửi về ADFI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ApplicationsPage,
});

type App = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  intro: string;
  position: string;
  sources: string[];
  source_other: string;
  cv_path: string;
  cv_filename: string;
  status: string;
  notes: string;
  lang: string;
  created_at: string;
};

const STATUS: Record<string, string> = {
  new: "Mới",
  reviewing: "Đang xem",
  interview: "Phỏng vấn",
  hired: "Nhận việc",
  rejected: "Từ chối",
};

function fmt(dt: string) {
  return new Date(dt).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ApplicationsPage() {
  const [rows, setRows] = useState<App[] | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [position, setPosition] = useState("");
  const [open, setOpen] = useState<App | null>(null);

  async function load() {
    const { data } = await supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as App[] | null) ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  const positions = useMemo(
    () => Array.from(new Set((rows ?? []).map((r) => r.position).filter(Boolean))),
    [rows],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows ?? []).filter((r) => {
      if (status && r.status !== status) return false;
      if (position && r.position !== position) return false;
      if (!needle) return true;
      return `${r.fullname} ${r.email} ${r.phone} ${r.position}`.toLowerCase().includes(needle);
    });
  }, [rows, q, status, position]);

  async function setAppStatus(id: string, value: string) {
    await supabase.from("job_applications").update({ status: value }).eq("id", id);
    setRows((prev) => (prev ?? []).map((r) => (r.id === id ? { ...r, status: value } : r)));
  }

  async function saveNotes(id: string, notes: string) {
    await supabase.from("job_applications").update({ notes }).eq("id", id);
    setRows((prev) => (prev ?? []).map((r) => (r.id === id ? { ...r, notes } : r)));
  }

  async function remove(row: App) {
    if (!confirm(`Xóa hồ sơ của ${row.fullname}?`)) return;
    if (row.cv_path) await supabase.storage.from("cvs").remove([row.cv_path]);
    await supabase.from("job_applications").delete().eq("id", row.id);
    setRows((prev) => (prev ?? []).filter((r) => r.id !== row.id));
    setOpen(null);
  }

  async function downloadCv(row: App) {
    if (!row.cv_path) return;
    const { data, error } = await supabase.storage.from("cvs").createSignedUrl(row.cv_path, 120);
    if (error || !data) {
      alert("Không tải được file CV.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  }

  return (
    <AdminShell title="Hồ sơ ứng tuyển" subtitle="Danh sách ứng viên nộp qua trang tuyển dụng">
      <div className="admin-toolbar">
        <input
          className="admin-input"
          placeholder="Tìm theo tên, email, vị trí..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="admin-select" value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="">Tất cả vị trí</option>
          {positions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <span className="admin-note">{filtered.length} hồ sơ</span>
      </div>

      <div className="panel">
        {rows === null ? (
          <p className="admin-note">Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p className="admin-note">Chưa có hồ sơ nào phù hợp.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Ứng viên</th>
                <th>Vị trí</th>
                <th>CV</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="muted">{fmt(r.created_at)}</td>
                  <td>
                    {r.fullname}
                    <br />
                    <span className="muted">{r.email}</span>
                  </td>
                  <td>{r.position || "—"}</td>
                  <td>
                    {r.cv_path ? (
                      <button className="admin-btn ghost sm" onClick={() => void downloadCv(r)}>
                        Tải CV
                      </button>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    <select
                      className="admin-select"
                      value={r.status}
                      onChange={(e) => void setAppStatus(r.id, e.target.value)}
                    >
                      {Object.entries(STATUS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="admin-btn ghost sm" onClick={() => setOpen(r)}>
                        Chi tiết
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

      {open ? (
        <div className="admin-modal-backdrop" onClick={() => setOpen(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{open.fullname}</h2>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Email</label>
                <input className="admin-input" readOnly value={open.email} />
              </div>
              <div className="admin-field">
                <label>Số điện thoại</label>
                <input className="admin-input" readOnly value={open.phone} />
              </div>
              <div className="admin-field">
                <label>Vị trí ứng tuyển</label>
                <input className="admin-input" readOnly value={open.position} />
              </div>
              <div className="admin-field">
                <label>Biết đến ADFI qua</label>
                <input
                  className="admin-input"
                  readOnly
                  value={[...(open.sources ?? []), open.source_other].filter(Boolean).join(", ")}
                />
              </div>
            </div>
            <div className="admin-field" style={{ marginTop: 14 }}>
              <label>Giới thiệu bản thân</label>
              <textarea className="admin-textarea" readOnly value={open.intro} />
            </div>
            <div className="admin-field" style={{ marginTop: 14 }}>
              <label>Ghi chú nội bộ</label>
              <textarea
                className="admin-textarea"
                defaultValue={open.notes}
                onBlur={(e) => void saveNotes(open.id, e.target.value)}
              />
            </div>
            <div className="admin-modal-actions">
              {open.cv_path ? (
                <button className="admin-btn ghost" onClick={() => void downloadCv(open)}>
                  Tải CV {open.cv_filename ? `(${open.cv_filename})` : ""}
                </button>
              ) : null}
              <button className="admin-btn" onClick={() => setOpen(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
