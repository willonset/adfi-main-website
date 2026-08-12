import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "./useRole";
import { assets } from "@/lib/assets";
import "@/admin.css";

const NAV: { to: string; label: string; exact?: boolean }[] = [
  { to: "/admin", label: "Tổng quan", exact: true },
  { to: "/admin/customers", label: "Khách hàng" },
  { to: "/admin/jobs", label: "Tuyển dụng" },
  { to: "/admin/applications", label: "Hồ sơ ứng tuyển" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/users", label: "Phân quyền" },
];

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role, loading, isStaff } = useRole();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">
          <img src={assets.logoWhite} alt="ADFI" />
          <span>Admin</span>
        </div>
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="admin-nav-link"
            activeOptions={{ exact: item.exact ?? false }}
            activeProps={{ className: "admin-nav-link active" }}
          >
            {item.label}
          </Link>
        ))}
        <div className="admin-side-foot">
          <span>{role === "owner" ? "Chủ sở hữu" : role === "admin" ? "Quản trị viên" : ""}</span>
          <button type="button" onClick={() => void signOut()}>
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-head">
          <div>
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          {actions}
        </div>
        {loading ? (
          <p className="admin-note">Đang tải...</p>
        ) : !isStaff ? (
          <div className="panel">
            <h2>Không có quyền truy cập</h2>
            <p className="admin-note">
              Tài khoản của bạn chưa được cấp quyền quản trị. Liên hệ chủ sở hữu để được ủy quyền.
            </p>
            <button className="admin-btn ghost" style={{ marginTop: 12 }} onClick={() => void signOut()}>
              Đăng xuất
            </button>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
