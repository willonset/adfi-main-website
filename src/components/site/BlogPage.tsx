import { SiteLayout } from "./SiteLayout";
import { SiteLink } from "./SiteLink";
import { type Lang, routes } from "@/i18n";
import { blogPosts, formatDate, type BlogPost } from "@/content/blog";

function blogPath(lang: Lang, slug: string) {
  return lang === "vi" ? `/blog/${slug}` : `/en/blog/${slug}`;
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

export function BlogListPage({ lang }: { lang: Lang }) {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <SiteLayout lang={lang}>
      <section className="careers-hero blog-hero">
        <div className="hero-glow"></div>
        <div className="wrap">
          <span className="eyebrow">Blog</span>
          <h1>{lang === "vi" ? "Góc nhìn về Affiliate & Thương mại điện tử" : "Insights on affiliate & e-commerce"}</h1>
          <p className="lead">
            {lang === "vi"
              ? "Kiến thức, kinh nghiệm triển khai và cập nhật thị trường từ đội ngũ ADFI."
              : "Playbooks, field notes and market updates from the ADFI team."}
          </p>
        </div>
      </section>
      <section className="blog-list-section">
        <div className="wrap">
          <div className="blog-grid">
            {posts.map((p) => (
              <SiteLink key={p.slug} to={blogPath(lang, p.slug)} className="blog-card">
                <span className="blog-cat">{p.category[lang]}</span>
                <h2>{p.title[lang]}</h2>
                <p>{p.excerpt[lang]}</p>
                <time dateTime={p.date}>{formatDate(p.date, lang)}</time>
              </SiteLink>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export function BlogPostPage({ lang, post }: { lang: Lang; post: BlogPost }) {
  return (
    <SiteLayout lang={lang}>
      <article className="careers-hero blog-hero blog-article">
        <div className="hero-glow"></div>
        <div className="wrap">
          <SiteLink to={routes.blog[lang]} className="blog-back">
            {lang === "vi" ? "← Quay lại Blog" : "← Back to Blog"}
          </SiteLink>
          <span className="eyebrow">{post.category[lang]}</span>
          <h1>{post.title[lang]}</h1>
          <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          <Body text={post.body[lang]} />
        </div>
      </article>
    </SiteLayout>
  );
}
