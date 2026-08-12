import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PublicPost = {
  slug: string;
  published_at: string;
  category_vi: string;
  category_en: string;
  title_vi: string;
  title_en: string;
  excerpt_vi: string;
  excerpt_en: string;
  body_vi: string;
  body_en: string;
  cover_url: string;
};

const COLUMNS =
  "slug, published_at, category_vi, category_en, title_vi, title_en, excerpt_vi, excerpt_en, body_vi, body_en, cover_url";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listPublicPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicPost[]> => {
    const { data } = await publicClient()
      .from("blog_posts")
      .select(COLUMNS)
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    return (data as PublicPost[] | null) ?? [];
  },
);

export const getPublicPost = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => ({ slug: String(input.slug) }))
  .handler(async ({ data }): Promise<PublicPost | null> => {
    const { data: row } = await publicClient()
      .from("blog_posts")
      .select(COLUMNS)
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    return (row as PublicPost | null) ?? null;
  });
