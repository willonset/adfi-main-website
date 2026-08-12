import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type StaffUser = {
  userId: string;
  email: string;
  role: "owner" | "admin";
  createdAt: string;
  lastSignInAt: string | null;
};

/** List every account that has an owner/admin role. Staff only. */
export const listStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StaffUser[]> => {
    const { data: myRoles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const staff = (myRoles ?? []).some((r) => r.role === "admin" || r.role === "owner");
    if (!staff) throw new Error("Forbidden");

    const { data: roles, error } = await context.supabase
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["owner", "admin"]);
    if (error) throw new Error(error.message);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const byId = new Map((list?.users ?? []).map((u) => [u.id, u]));

    return (roles ?? []).map((r) => {
      const u = byId.get(r.user_id);
      return {
        userId: r.user_id,
        email: u?.email ?? "—",
        role: r.role as "owner" | "admin",
        createdAt: u?.created_at ?? "",
        lastSignInAt: u?.last_sign_in_at ?? null,
      };
    });
  });

/** Owner-only: create (if needed) an account and grant it the admin role. */
export const grantAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string; password?: string }) => {
    const email = input.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Email không hợp lệ");
    if (input.password && input.password.length < 8) throw new Error("Mật khẩu tối thiểu 8 ký tự");
    return { email, password: input.password ?? "" };
  })
  .handler(async ({ data, context }) => {
    const { data: myRoles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const isOwner = (myRoles ?? []).some((r) => r.role === "owner");
    if (!isOwner) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    let user = (list?.users ?? []).find((u) => u.email?.toLowerCase() === data.email);

    if (!user) {
      if (!data.password) throw new Error("Tài khoản chưa tồn tại — hãy đặt mật khẩu ban đầu");
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });
      if (error) throw new Error(error.message);
      user = created.user ?? undefined;
    } else if (data.password) {
      await supabaseAdmin.auth.admin.updateUserById(user.id, { password: data.password });
    }
    if (!user) throw new Error("Không tạo được tài khoản");

    const { error: roleError } = await context.supabase
      .from("user_roles")
      .insert({ user_id: user.id, role: "admin" });
    if (roleError && !roleError.message.includes("duplicate")) throw new Error(roleError.message);

    return { ok: true, userId: user.id };
  });

/** Owner-only: remove a delegated admin. */
export const revokeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: myRoles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const isOwner = (myRoles ?? []).some((r) => r.role === "owner");
    if (!isOwner) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", "admin");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Bootstrap: grant the owner role to the signed-in user only when no owner exists yet. */
export const claimOwner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "owner");
    if (error) throw new Error(error.message);
    if ((count ?? 0) > 0) return { ok: false };

    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "owner" });
    if (insertError && !insertError.message.includes("duplicate")) throw new Error(insertError.message);
    return { ok: true };
  });
