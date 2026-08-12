import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/admin/AdminShell";
import { useRole } from "@/components/admin/useRole";
import { listStaff, grantAdmin, revokeAdmin, type StaffUser } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({
    meta: [
      { title: "Phân quyền — ADFI Admin" },
      { name: "description", content: "Ủy quyền quản trị website ADFI cho tài khoản khác." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Phân quyền — ADFI Admin" },
      { property: "og:description", content: "Ủy quyền quản trị website ADFI cho tài khoản khác." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UsersPage,
});

function fmt(dt: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function UsersPage() {
  const { role } = useRole();
  const fetchStaff = useServerFn(listStaff);
  const doGrant = useServerFn(grantAdmin);
  const doRevoke = useServerFn(revokeAdmin);

  const [rows, setRows] = useState<StaffUser[] | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function load() {
    try {
      setRows(await fetchStaff({ data: undefined }));
    } catch {
      setRows([]);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function grant(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOk("");
    setBusy(true);
    try {
      await doGrant({ data: { email, password } });
      setOk(`Đã cấp quyền quản trị cho ${email}.`);
      setEmail("");
      setPassword("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không cấp được quyền");
    } finally {
      setBusy(false);
    }
  }

  async function revoke(user: StaffUser) {
    if (!confirm(`Thu hồi quyền quản trị của ${user.email}?`)) return;
    try {
      await doRevoke({ data: { userId: user.userId } });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thu hồi được quyền");
    }
  }

  return (
    <AdminShell title="Phân quyền" subtitle="Chủ sở hữu có thể ủy quyền quản trị cho tài khoản khác">
      {role === "owner" ? (
        <div className="panel">
          <h2>Ủy quyền tài khoản mới</h2>
          <form className="admin-form-grid" onSubmit={(e) => void grant(e)}>
            <div className="admin-field">
              <label>Email *</label>
              <input
                className="admin-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teammate@adfi.vn"
              />
            </div>
            <div className="admin-field">
              <label>Mật khẩu ban đầu (nếu tài khoản chưa tồn tại)</label>
              <input
                className="admin-input"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự"
              />
            </div>
            <div className="admin-field" style={{ alignSelf: "end" }}>
              <button className="admin-btn" disabled={busy} type="submit">
                {busy ? "Đang xử lý..." : "Cấp quyền quản trị"}
              </button>
            </div>
          </form>
          {error ? <p className="admin-error">{error}</p> : null}
          {ok ? <p className="admin-ok">{ok}</p> : null}
        </div>
      ) : (
        <p className="admin-note">Chỉ chủ sở hữu mới cấp hoặc thu hồi quyền quản trị.</p>
      )}

      <ChangePasswordPanel />



      <div className="panel">
        <h2>Đội quản trị</h2>
        {rows === null ? (
          <p className="admin-note">Đang tải...</p>
        ) : rows.length === 0 ? (
          <p className="admin-note">Chưa có tài khoản quản trị nào.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Tạo lúc</th>
                <th>Đăng nhập gần nhất</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={`${u.userId}-${u.role}`}>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "owner" ? "ok" : ""}`}>
                      {u.role === "owner" ? "Chủ sở hữu" : "Quản trị viên"}
                    </span>
                  </td>
                  <td className="muted">{fmt(u.createdAt)}</td>
                  <td className="muted">{fmt(u.lastSignInAt)}</td>
                  <td>
                    {role === "owner" && u.role === "admin" ? (
                      <button className="admin-btn ghost sm" onClick={() => void revoke(u)}>
                        Thu hồi
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
