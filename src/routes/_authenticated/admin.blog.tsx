import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  head: () => ({
    meta: [
      { title: "Blog — ADFI Admin" },
      { name: "description", content: "Đăng, sửa và xóa bài viết blog của ADFI." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Blog — ADFI Admin" },
      { property: "og:description", content: "Đăng, sửa và xóa bài viết blog của ADFI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BlogAdminPage,
});

type Post = {
  id: string;
  slug: string;
  title_vi: string;
  title_en: string;
  category_vi: string;
  category_en: string;
  excerpt_vi: string;
  excerpt_en: string;
  body_vi: string;
  body_en: string;
  cover_url: string;
  is_published: boolean;
  published_at: string;
};

const EMPTY: Post = {
  id: "",
  slug: "",
  title_vi: "",
  title_en: "",
  category_vi: "Kiến thức",
  category_en: "Insights",
  excerpt_vi: "",
  excerpt_en: "",
  body_vi: "",
  body_en: "",
  cover_url: "",
  is_published: true,
  published_at: new Date().toISOString().slice(0, 10),
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

function BlogAdminPage() {
  const [rows, setRows] = useState<Post[] | null>(null);
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    setRows((data as Post[] | null) ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows ?? []).filter((r) =>
      needle ? `${r.title_vi} ${r.title_en} ${r.slug}`.toLowerCase().includes(needle) : true,
    );
  }, [rows, q]);

  async function togglePublish(post: Post) {
    await supabase.from("blog_posts").update({ is_published: !post.is_published }).eq("id", post.id);
    setRows((prev) =>
      (prev ?? []).map((r) => (r.id === post.id ? { ...r, is_published: !post.is_published } : r)),
    );
  }

  async function remove(post: Post) {
    if (!confirm(`Xóa bài "${post.title_vi}"?`)) return;
    await supabase.from("blog_posts").delete().eq("id", post.id);
    setRows((prev) => (prev ?? []).filter((r) => r.id !== post.id));
  }

  async function save() {
    if (!draft) return;
    setError("");
    if (!draft.title_vi.trim() || !draft.body_vi.trim()) {
      setError("Vui lòng nhập tiêu đề và nội dung tiếng Việt.");
      return;
    }
    setSaving(true);
    const payload = {
      slug: draft.slug.trim() || slugify(draft.title_vi),
      title_vi: draft.title_vi.trim(),
      title_en: (draft.title_en || draft.title_vi).trim(),
      category_vi: draft.category_vi,
      category_en: draft.category_en || draft.category_vi,
      excerpt_vi: draft.excerpt_vi,
      excerpt_en: draft.excerpt_en || draft.excerpt_vi,
      body_vi: draft.body_vi,
      body_en: draft.body_en || draft.body_vi,
      cover_url: draft.cover_url,
      is_published: draft.is_published,
      published_at: draft.published_at || new Date().toISOString().slice(0, 10),
    };
    const res = draft.id
      ? await supabase.from("blog_posts").update(payload).eq("id", draft.id)
      : await supabase.from("blog_posts").insert(payload);
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
      title="Quản lý Blog"
      subtitle="Đăng bài mới, ẩn/hiện hoặc xóa bài viết"
      actions={
        <button className="admin-btn" onClick={() => setDraft({ ...EMPTY })}>
          + Viết bài mới
        </button>
      }
    >
      <div className="admin-toolbar">
        <input
          className="admin-input"
          placeholder="Tìm theo tiêu đề..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="admin-note">{filtered.length} bài</span>
      </div>

      <div className="panel">
        {rows === null ? (
          <p className="admin-note">Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p className="admin-note">Chưa có bài viết nào.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Chuyên mục</th>
                <th>Ngày đăng</th>
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
                    <span className="muted">/blog/{r.slug}</span>
                  </td>
                  <td>{r.category_vi}</td>
                  <td className="muted">{String(r.published_at).slice(0, 10)}</td>
                  <td>
                    <span className={`badge ${r.is_published ? "ok" : "off"}`}>
                      {r.is_published ? "Đã đăng" : "Bản nháp"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="admin-btn ghost sm" onClick={() => setDraft({ ...r })}>
                        Sửa
                      </button>
                      <button className="admin-btn ghost sm" onClick={() => void togglePublish(r)}>
                        {r.is_published ? "Ẩn" : "Đăng"}
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
            <h2>{draft.id ? "Sửa bài viết" : "Viết bài mới"}</h2>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Tiêu đề (VI) *</label>
                <input
                  className="admin-input"
                  value={draft.title_vi}
                  onChange={(e) => setDraft({ ...draft, title_vi: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Tiêu đề (EN)</label>
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
                  placeholder={slugify(draft.title_vi) || "bai-viet-moi"}
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Ngày đăng</label>
                <input
                  className="admin-input"
                  type="date"
                  value={String(draft.published_at).slice(0, 10)}
                  onChange={(e) => setDraft({ ...draft, published_at: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Chuyên mục (VI)</label>
                <input
                  className="admin-input"
                  value={draft.category_vi}
                  onChange={(e) => setDraft({ ...draft, category_vi: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Chuyên mục (EN)</label>
                <input
                  className="admin-input"
                  value={draft.category_en}
                  onChange={(e) => setDraft({ ...draft, category_en: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Ảnh bìa (URL)</label>
                <input
                  className="admin-input"
                  value={draft.cover_url}
                  onChange={(e) => setDraft({ ...draft, cover_url: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Trạng thái</label>
                <select
                  className="admin-select"
                  value={draft.is_published ? "1" : "0"}
                  onChange={(e) => setDraft({ ...draft, is_published: e.target.value === "1" })}
                >
                  <option value="1">Đã đăng</option>
                  <option value="0">Bản nháp</option>
                </select>
              </div>
            </div>

            <div className="admin-form-grid" style={{ marginTop: 14 }}>
              <div className="admin-field">
                <label>Mô tả ngắn (VI)</label>
                <textarea
                  className="admin-textarea"
                  value={draft.excerpt_vi}
                  onChange={(e) => setDraft({ ...draft, excerpt_vi: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Mô tả ngắn (EN)</label>
                <textarea
                  className="admin-textarea"
                  value={draft.excerpt_en}
                  onChange={(e) => setDraft({ ...draft, excerpt_en: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-field" style={{ marginTop: 14 }}>
              <label>Nội dung (VI) — dùng "## Tiêu đề" và "- gạch đầu dòng"</label>
              <textarea
                className="admin-textarea tall"
                value={draft.body_vi}
                onChange={(e) => setDraft({ ...draft, body_vi: e.target.value })}
              />
            </div>
            <div className="admin-field" style={{ marginTop: 14 }}>
              <label>Nội dung (EN)</label>
              <textarea
                className="admin-textarea tall"
                value={draft.body_en}
                onChange={(e) => setDraft({ ...draft, body_en: e.target.value })}
              />
            </div>

            {error ? <p className="admin-error">{error}</p> : null}
            <div className="admin-modal-actions">
              <button className="admin-btn ghost" onClick={() => setDraft(null)}>
                Hủy
              </button>
              <button className="admin-btn" disabled={saving} onClick={() => void save()}>
                {saving ? "Đang lưu..." : "Lưu bài"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
