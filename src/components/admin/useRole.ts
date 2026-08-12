import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Role = "owner" | "admin" | null;

export function useRole() {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user?.id;
      if (!uid) {
        if (alive) setLoading(false);
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      const roles = (data ?? []).map((r) => r.role);
      if (!alive) return;
      setRole(roles.includes("owner") ? "owner" : roles.includes("admin") ? "admin" : null);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { role, loading, isStaff: role === "owner" || role === "admin" };
}
