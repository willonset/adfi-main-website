import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Tổng quan — ADFI Admin" },
      { name: "description", content: "Bảng điều khiển tổng quan các chỉ số website ADFI." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Tổng quan — ADFI Admin" },
      { property: "og:description", content: "Bảng điều khiển tổng quan các chỉ số website ADFI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OverviewPage,
});

type Stats = {
  leads: number;
  leadsNew: number;
  leads30: number;
  apps: number;
  appsNew: number;
  apps30: number;
  jobsOpen: number;
  jobsTotal: number;
  postsPublished: number;
  postsTotal: number;
};

type RecentLead = { id: string; name: string; email: string; role: string; created_at: string };
type RecentApp = { id: string; fullname: string; position: string; created_at: string };

function since(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

function fmt(dt: string) {
  return new Date(dt).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<RecentLead[]>([]);
  const [apps, setApps] = useState<RecentApp[]>([]);

  useEffect(() => {
    void (async () => {
      const c = (table: "leads" | "job_applications" | "jobs" | "blog_posts") =>
        supabase.from(table).select("id", { count: "exact", head: true });
      const d30 = since(30);
      const [
        leadsAll,
        leadsNew,
        leads30,
        appsAll,
        appsNew,
        apps30,
        jobsOpen,
        jobsAll,
        postsPub,
        postsAll,
        recentLeads,
        recentApps,
      ] = await Promise.all([
        c("leads"),
        c("leads").eq("status", "new"),
        c("leads").gte("created_at", d30),
        c("job_applications"),
        c("job_applications").eq("status", "new"),
        c("job_applications").gte("created_at", d30),
        c("jobs").eq("is_open", true),
        c("jobs"),
        c("blog_posts").eq("is_published", true),
        c("blog_posts"),
        supabase.from("leads").select("id, name, email, role, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("job_applications").select("id, fullname, position, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        leads: leadsAll.count ?? 0,
        leadsNew: leadsNew.count ?? 0,
        leads30: leads30.count ?? 0,
        apps: appsAll.count ?? 0,
        appsNew: appsNew.count ?? 0,
        apps30: apps30.count ?? 0,
        jobsOpen: jobsOpen.count ?? 0,
        jobsTotal: jobsAll.count ?? 0,
        postsPublished: postsPub.count ?? 0,
        postsTotal: postsAll.count ?? 0,
      });
      setLeads((recentLeads.data as RecentLead[] | null) ?? []);
      setApps((recentApps.data as RecentApp[] | null) ?? []);
    })();
  }, []);

  return (
    <AdminShell title="Tổng quan" subtitle="Các chỉ số quan trọng của website ADFI">
      {!stats ? (
        <p className="admin-note">Đang tải số liệu...</p>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="label">Lead thu về</div>
              <div className="value">{stats.leads}</div>
              <div className="sub">{stats.leads30} trong 30 ngày · {stats.leadsNew} chưa xử lý</div>
            </div>
            <div className="stat-card">
              <div className="label">Hồ sơ ứng tuyển</div>
              <div className="value">{stats.apps}</div>
              <div className="sub">{stats.apps30} trong 30 ngày · {stats.appsNew} chưa xem</div>
            </div>
            <div className="stat-card">
              <div className="label">Vị trí đang mở</div>
              <div className="value">{stats.jobsOpen}</div>
              <div className="sub">Tổng {stats.jobsTotal} tin tuyển dụng</div>
            </div>
            <div className="stat-card">
              <div className="label">Bài blog đã đăng</div>
              <div className="value">{stats.postsPublished}</div>
              <div className="sub">Tổng {stats.postsTotal} bài viết</div>
            </div>
          </div>

          <div className="panel">
            <h2>Lead mới nhất</h2>
            {leads.length === 0 ? (
              <p className="admin-note">Chưa có lead nào.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Nhóm</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id}>
                      <td>{l.name || "—"}</td>
                      <td className="muted">{l.email || "—"}</td>
                      <td>{l.role || "—"}</td>
                      <td className="muted">{fmt(l.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="panel">
            <h2>Hồ sơ ứng tuyển mới nhất</h2>
            {apps.length === 0 ? (
              <p className="admin-note">Chưa có hồ sơ nào.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ứng viên</th>
                    <th>Vị trí</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((a) => (
                    <tr key={a.id}>
                      <td>{a.fullname}</td>
                      <td className="muted">{a.position}</td>
                      <td className="muted">{fmt(a.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
