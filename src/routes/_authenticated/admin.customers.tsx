import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  head: () => ({
    meta: [
      { title: "Khách hàng — ADFI Admin" },
      { name: "description", content: "Quản lý lead khách hàng thu về từ website ADFI." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Khách hàng — ADFI Admin" },
      { property: "og:description", content: "Quản lý lead khách hàng thu về từ website ADFI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CustomersPage,
});

type Lead = {
  id: string;
  role: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: string;
  notes: string;
  lang: string;
  created_at: string;
};

const STATUS: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  won: "Đã chốt",
  lost: "Không phù hợp",
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

function CustomersPage() {
  const [rows, setRows] = useState<Lead[] | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState<Lead | null>(null);

  async function load() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as Lead[] | null) ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows ?? []).filter((r) => {
      if (status && r.status !== status) return false;
      if (!needle) return true;
      return `${r.name} ${r.email} ${r.phone} ${r.role} ${r.message}`.toLowerCase().includes(needle);
    });
  }, [rows, q, status]);

  async function setLeadStatus(id: string, value: string) {
    await supabase.from("leads").update({ status: value }).eq("id", id);
    setRows((prev) => (prev ?? []).map((r) => (r.id === id ? { ...r, status: value } : r)));
  }

  async function remove(id: string) {
    if (!confirm("Xóa lead này?")) return;
    await supabase.from("leads").delete().eq("id", id);
    setRows((prev) => (prev ?? []).filter((r) => r.id !== id));
    setOpen(null);
  }

  async function saveNotes(id: string, notes: string) {
    await supabase.from("leads").update({ notes }).eq("id", id);
    setRows((prev) => (prev ?? []).map((r) => (r.id === id ? { ...r, notes } : r)));
  }

  function exportCsv() {
    const header = ["Thời gian", "Họ tên", "Email", "SĐT", "Nhóm", "Trạng thái", "Nội dung"];
    const lines = filtered.map((r) =>
      [fmt(r.created_at), r.name, r.email, r.phone, r.role, STATUS[r.status] ?? r.status, r.message]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob(["\uFEFF" + [header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adfi-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell
      title="Khách hàng"
      subtitle="Lead thu về từ form liên hệ trên website"
      actions={
        <button className="admin-btn ghost" onClick={exportCsv}>
          Xuất CSV
        </button>
      }
    >
      <div className="admin-toolbar">
        <input
          className="admin-input"
          placeholder="Tìm theo tên, email, SĐT..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <span className="admin-note">{filtered.length} lead</span>
      </div>

      <div className="panel">
        {rows === null ? (
          <p className="admin-note">Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p className="admin-note">Chưa có lead nào phù hợp.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Họ tên</th>
                <th>Liên hệ</th>
                <th>Nhóm</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="muted">{fmt(r.created_at)}</td>
                  <td>{r.name || "—"}</td>
                  <td className="muted">
                    {r.email || "—"}
                    <br />
                    {r.phone || "—"}
                  </td>
                  <td>{r.role || "—"}</td>
                  <td>
                    <select
                      className="admin-select"
                      value={r.status}
                      onChange={(e) => void setLeadStatus(r.id, e.target.value)}
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
                      <button className="admin-btn ghost sm" onClick={() => void remove(r.id)}>
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
            <h2>{open.name || "Lead"}</h2>
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
                <label>Nhóm</label>
                <input className="admin-input" readOnly value={open.role} />
              </div>
              <div className="admin-field">
                <label>Ngôn ngữ</label>
                <input className="admin-input" readOnly value={open.lang} />
              </div>
            </div>
            <div className="admin-field" style={{ marginTop: 14 }}>
              <label>Nhu cầu hợp tác</label>
              <textarea className="admin-textarea" readOnly value={open.message} />
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
              <button className="admin-btn ghost" onClick={() => setOpen(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
