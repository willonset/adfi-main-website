import { SiteLayout } from "./SiteLayout";
import { SiteLink } from "./SiteLink";
import { type Lang, routes } from "@/i18n";
import type { PublicPost } from "@/lib/blog.functions";

function blogPath(lang: Lang, slug: string) {
  return lang === "vi" ? `/blog/${slug}` : `/en/blog/${slug}`;
}

export function formatDate(date: string, lang: Lang) {
  return new Date(date).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function pick(post: PublicPost, field: "title" | "excerpt" | "body" | "category", lang: Lang) {
  const vi = post[`${field}_vi` as const];
  const en = post[`${field}_en` as const];
  return lang === "vi" ? vi || en : en || vi;
}

function Body({ text }: { text: string }) {
  const blocks = text.split("\n\n");
  return (
    <div className="post-body">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) return <h2 key={i}>{block.slice(3)}</h2>;
        if (block.startsWith("- ")) {
          return (
            <ul key={i}>
              {block
                .split("\n")
                .filter((l) => l.startsWith("- "))
                .map((l, j) => (
                  <li key={j}>{l.slice(2)}</li>
                ))}
            </ul>
          );
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}

export function BlogListPage({ lang, posts }: { lang: Lang; posts: PublicPost[] }) {
  return (
    <SiteLayout lang={lang}>
      <section className="careers-hero blog-hero">
        <div className="hero-glow"></div>
        <div className="wrap">
          <span className="eyebrow">Blog</span>
          <h1>
            {lang === "vi"
              ? "Góc nhìn về Affiliate & Thương mại điện tử"
              : "Insights on affiliate & e-commerce"}
          </h1>
          <p className="lead">
            {lang === "vi"
              ? "Kiến thức, kinh nghiệm triển khai và cập nhật thị trường từ đội ngũ ADFI."
              : "Playbooks, field notes and market updates from the ADFI team."}
          </p>
        </div>
      </section>
      <section className="blog-list-section">
        <div className="wrap">
          {posts.length === 0 ? (
            <p className="blog-empty">
              {lang === "vi" ? "Chưa có bài viết nào." : "No articles yet."}
            </p>
          ) : (
            <div className="blog-grid">
              {posts.map((p) => (
                <SiteLink key={p.slug} to={blogPath(lang, p.slug)} className="blog-card">
                  <span className="blog-cat">{pick(p, "category", lang)}</span>
                  <h2>{pick(p, "title", lang)}</h2>
                  <p>{pick(p, "excerpt", lang)}</p>
                  <time dateTime={p.published_at}>{formatDate(p.published_at, lang)}</time>
                </SiteLink>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

export function BlogPostPage({ lang, post }: { lang: Lang; post: PublicPost }) {
  return (
    <SiteLayout lang={lang}>
      <article className="careers-hero blog-hero blog-article">
        <div className="hero-glow"></div>
        <div className="wrap">
          <SiteLink to={routes.blog[lang]} className="blog-back">
            {lang === "vi" ? "← Quay lại Blog" : "← Back to Blog"}
          </SiteLink>
          <span className="eyebrow">{pick(post, "category", lang)}</span>
          <h1>{pick(post, "title", lang)}</h1>
          <time dateTime={post.published_at}>{formatDate(post.published_at, lang)}</time>
          <Body text={pick(post, "body", lang)} />
        </div>
      </article>
    </SiteLayout>
  );
}
