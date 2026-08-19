import { SiteLink } from "./SiteLink";
import { type Lang, routes } from "@/i18n";
import type { PublicPost } from "@/lib/blog.functions";
import { formatDate } from "./BlogPage";

function pick(post: PublicPost, field: "title" | "excerpt" | "category", lang: Lang) {
  const vi = post[`${field}_vi` as const];
  const en = post[`${field}_en` as const];
  return lang === "vi" ? vi || en : en || vi;
}

export function BlogHighlights({
  lang,
  posts,
}: {
  lang: Lang;
  posts: PublicPost[];
}) {
  const featured = posts.slice(0, 4);
  if (featured.length === 0) return null;

  const title = lang === "vi" ? "Blog" : "Blog";
  const subtitle =
    lang === "vi"
      ? "Kiến thức, kinh nghiệm và cập nhật thị trường từ ADFI"
      : "Knowledge, field notes and market updates from ADFI";
  const cta = lang === "vi" ? "Xem tất cả bài viết →" : "View all articles →";

  return (
    <section className="section-pad blog-highlights">
      <div className="wrap">
        <div className="bh-head">
          <div>
            <span className="eyebrow">{title}</span>
            <h2 className="h-36">{subtitle}</h2>
          </div>
          <SiteLink className="bh-link" to={routes.blog[lang]}>
            {cta}
          </SiteLink>
        </div>
        <div className="blog-grid">
          {featured.map((p) => (
            <SiteLink
              key={p.slug}
              to={lang === "vi" ? `/blog/${p.slug}` : `/en/blog/${p.slug}`}
              className="blog-card"
            >
              <span className="blog-cat">{pick(p, "category", lang)}</span>
              <h3>{pick(p, "title", lang)}</h3>
              <p>{pick(p, "excerpt", lang)}</p>
              <time dateTime={p.published_at}>{formatDate(p.published_at, lang)}</time>
            </SiteLink>
          ))}
        </div>
      </div>
    </section>
  );
}
