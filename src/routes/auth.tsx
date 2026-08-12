import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { claimOwner } from "@/lib/admin.functions";
import "@/admin.css";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/admin" });
  },
  head: () => ({
    meta: [
      { title: "Đăng nhập quản trị — ADFI" },
      { name: "description", content: "Khu vực đăng nhập dành cho đội ngũ quản trị website ADFI." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Đăng nhập quản trị — ADFI" },
      { property: "og:description", content: "Khu vực đăng nhập dành cho đội ngũ quản trị website ADFI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [allowSignup, setAllowSignup] = useState(false);

  useEffect(() => {
    // The very first account can self-register to become the owner.
    void supabase
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .then(({ count, error: err }) => {
        if (!err && (count ?? 0) === 0) setAllowSignup(true);
      });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (err) throw err;
      }
      const { error: err2 } = await supabase.auth.signInWithPassword({ email, password });
      if (err2) throw err2;
      try {
        await claimOwner();
      } catch {
        /* owner already exists — safe to ignore */
      }
      void navigate({ to: "/admin", replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng nhập thất bại";
      setError(
        message.includes("Invalid login")
          ? "Email hoặc mật khẩu không đúng."
          : message.includes("confirm")
            ? "Tài khoản cần xác nhận email trước khi đăng nhập."
            : message,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>
          ADFI <span style={{ color: "var(--ad-red)" }}>Admin</span>
        </h1>
        <p className="sub">
          {mode === "signin"
            ? "Đăng nhập bằng email quản trị của bạn."
            : "Tạo tài khoản chủ sở hữu đầu tiên cho hệ thống."}
        </p>
        <div className="admin-field">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            className="admin-input"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="auth-pass">Mật khẩu</label>
          <input
            id="auth-pass"
            className="admin-input"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <p className="admin-error" style={{ marginTop: 12 }}>{error}</p> : null}
        {info ? <p className="admin-ok" style={{ marginTop: 12 }}>{info}</p> : null}
        <button className="admin-btn" type="submit" disabled={busy}>
          {busy ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập" : "Tạo tài khoản owner"}
        </button>
        {allowSignup ? (
          <p className="auth-switch">
            {mode === "signin" ? "Chưa có tài khoản nào? " : "Đã có tài khoản? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
                setInfo("");
              }}
            >
              {mode === "signin" ? "Tạo tài khoản owner" : "Đăng nhập"}
            </button>
          </p>
        ) : (
          <p className="auth-switch">Tài khoản mới do chủ sở hữu cấp trong trang quản trị.</p>
        )}
      </form>
    </div>
  );
}
