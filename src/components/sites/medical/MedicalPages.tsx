/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock3, Search } from "lucide-react";
import { ContactForm, ContactMap, Footer, Header, SectionTitle } from "./MedicalHome";
import { BackToTop, CommentForm } from "./PageInteractions";
import { aboutParagraphs, categories, categoryPosts, displayDate, pageSize, posts, type MedicalCategory, type MedicalPost } from "./site-content";

export function MedicalShell({ children, section }: { children: React.ReactNode; section?: string }) {
  return <><a className="skip-link" href="#main">Chuyển đến nội dung</a><Header section={section} /><main id="main" className="medical-inner">{children}</main><Footer includeMap={false} /><BackToTop /></>;
}

function Sidebar({ categoryId }: { categoryId?: number }) {
  return <aside className="page-sidebar"><form action="/" className="sidebar-search" role="search"><input name="s" type="search" placeholder="Tìm kiếm..." aria-label="Tìm kiếm nội dung" required /><button aria-label="Tìm kiếm"><Search size={22} /></button></form><section><h2>Bài viết mới</h2><ul>{posts.slice(0, 5).map(post => <li key={post.id}><Link href={`/${post.slug}/`}>{post.title}</Link></li>)}</ul></section><section><h2>Danh mục</h2><ul>{categories.map(category => <li key={category.id}><Link className={category.id === categoryId ? "current-category" : ""} href={category.path}>{category.name}</Link></li>)}</ul></section></aside>;
}

function ArchiveRows({ items }: { items: MedicalPost[] }) {
  return <div className="archive-rows">{items.map(post => <article className="archive-item" key={post.id}><h2><Link href={`/${post.slug}/`}>{post.title}</Link></h2><div className={`archive-item-body${post.image ? "" : " no-image"}`}>{post.image && <Link className="archive-image" href={`/${post.slug}/`}><img src={post.image} alt={post.title} loading="lazy" /></Link>}<div className="archive-copy"><p>{post.excerpt}</p><time dateTime={post.date}><Clock3 size={12} aria-hidden="true" />{displayDate(post.date)}</time><Link className="button archive-read-more" href={`/${post.slug}/`}>Xem thêm</Link></div></div></article>)}</div>;
}

function Pagination({ count, current, base }: { count: number; current: number; base: string }) {
  const pages = Math.ceil(count / pageSize);
  if (pages < 2) return null;
  const href = (page: number) => page === 1 ? base : `${base}page/${page}/`;
  return <nav className="archive-pagination" aria-label="Phân trang">{current > 1 && <Link href={href(current - 1)} aria-label="Trang trước"><ChevronLeft size={18} /></Link>}{Array.from({ length: pages }, (_, i) => <Link key={i} href={href(i + 1)} aria-current={current === i + 1 ? "page" : undefined}>{i + 1}</Link>)}{current < pages && <Link href={href(current + 1)} aria-label="Trang tiếp theo"><ChevronRight size={18} /></Link>}</nav>;
}

export function CategoryPage({ category, page = 1 }: { category: MedicalCategory; page?: number }) {
  const items = categoryPosts(category);
  return <MedicalShell><div className="archive-page"><h1 className="section-title archive-heading">{category.name}</h1><div className="inner-columns container"><div className="archive-main"><ArchiveRows items={items.slice((page - 1) * pageSize, page * pageSize)} /><Pagination count={items.length} current={page} base={category.path} /></div><Sidebar categoryId={category.id} /></div></div></MedicalShell>;
}

export function SearchPage({ query }: { query: string }) {
  const normal = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll("đ", "d");
  const needle = normal(query.trim());
  const items = posts.filter(post => normal(`${post.title} ${post.excerpt} ${post.content.replace(/<[^>]+>/g, " ")}`).includes(needle));
  return <MedicalShell><div className="archive-page"><h1 className="section-title archive-heading">Kết quả tìm kiếm cho: {query}</h1><div className="inner-columns container"><div className="archive-main">{items.length ? <ArchiveRows items={items} /> : <div className="empty-search"><h2>Không tìm thấy kết quả</h2><p>Vui lòng thử lại với từ khóa khác.</p><form action="/" className="sidebar-search"><input name="s" type="search" defaultValue={query} aria-label="Từ khóa tìm kiếm" required /><button aria-label="Tìm kiếm"><Search size={22} /></button></form></div>}</div><Sidebar /></div></div></MedicalShell>;
}

export function AboutPage() {
  return <MedicalShell><section className="about-banner"><h1>Giới thiệu</h1></section><section className="mission container"><SectionTitle>TẦM NHÌN SỨ MỆNH</SectionTitle>{aboutParagraphs.map(text => <p key={text}>{text}</p>)}</section><img className="about-city" src="/sites/medical/mbws-img1-15.jpg" width={1400} height={572} alt="Tầm nhìn MEDICAL hướng đến sự phát triển của ngành y tế" /></MedicalShell>;
}

export function ContactPage() {
  return <MedicalShell><ContactMap /><ContactForm /></MedicalShell>;
}

export function AuthorPage() {
  return <MedicalShell><div className="archive-page"><h1 className="section-title archive-heading">Tác giả: System</h1><div className="inner-columns container"><div className="archive-main"><ArchiveRows items={posts} /></div><Sidebar /></div></div></MedicalShell>;
}

export function ArticlePage({ post }: { post: MedicalPost }) {
  const postCategories = categories.filter(category => post.categories.includes(category.id));
  const section = categories.find(category => category.parent === 0 && post.categories.includes(category.id))?.path;
  const index = posts.findIndex(item => item.id === post.id);
  const older = posts[index + 1];
  const newer = posts[index - 1];
  const shareUrl = encodeURIComponent(`https://0141.matbao.website/${post.slug}/`);
  return <MedicalShell section={section}><div className="article-page inner-columns container"><article className="article-main"><header className="article-header"><div className="article-categories">{postCategories.map((category, i) => <span key={category.id}>{i > 0 && ", "}<Link href={category.path}>{category.name}</Link></span>)}</div><h1>{post.title}</h1><div className="article-divider" /><p className="article-date">ĐÃ ĐĂNG TRÊN <time dateTime={post.date}>{displayDate(post.date)}</time> BỞI <Link href="/author/system/">SYSTEM</Link></p></header><div className="article-prose" dangerouslySetInnerHTML={{ __html: post.content }} /><div className="article-sharing"><div className="article-divider" /><a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ lên Facebook">f</a><a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ lên X">𝕏</a><a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${shareUrl}`} aria-label="Chia sẻ qua email">✉</a><a href={`https://www.pinterest.com/pin/create/button/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ lên Pinterest">p</a><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ lên LinkedIn">in</a></div><div className="article-filed">Mục nhập này đã được đăng trong {postCategories.map((category, i) => <span key={category.id}>{i > 0 && ", "}<Link href={category.path}>{category.name}</Link></span>)}. Đánh dấu trang <Link href={`/${post.slug}/`}>permalink</Link>.</div><div className="article-author"><img src="/sites/medical/author-system.png" alt="System" width={90} height={90} /><Link href="/author/system/">SYSTEM</Link></div><nav className="article-pagination" aria-label="Bài viết liền kề"><div>{older && <Link href={`/${older.slug}/`}><ChevronLeft />{older.title}</Link>}</div><div>{newer && <Link href={`/${newer.slug}/`}>{newer.title}<ChevronRight /></Link>}</div></nav>{post.comments && <CommentForm slug={post.slug} />}</article><Sidebar /></div></MedicalShell>;
}
