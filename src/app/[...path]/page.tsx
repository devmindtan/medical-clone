import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AboutPage, ArticlePage, AuthorPage, CategoryPage, ContactPage } from "@/components/sites/medical/MedicalPages";
import { categories, categoryPosts, pageSize, posts, routePaths } from "@/components/sites/medical/site-content";

type PageProps = { params: Promise<{ path: string[] }> };

export function generateStaticParams() {
  return routePaths().map(path => ({ path: path.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { path } = await params;
  const pathname = `/${path.join("/")}/`;
  const post = posts.find(item => `/${item.slug}/` === pathname);
  const category = categories.find(item => pathname === item.path || pathname.startsWith(item.path + "page/"));
  const title = post?.title ?? category?.name ?? (path[0] === "gioi-thieu" ? "Giới thiệu" : path[0] === "lien-he" ? "Liên hệ" : "System");
  return { title: `${title} - Thiết bị y tế`, description: post?.excerpt || "MEDICAL - Giải pháp và thiết bị y tế." };
}

export default async function MedicalRoute({ params }: PageProps) {
  const { path } = await params;
  const pathname = `/${path.join("/")}/`;
  if (pathname === "/trang-chu/") redirect("/");
  if (pathname === "/gioi-thieu/") return <AboutPage />;
  if (pathname === "/lien-he/") return <ContactPage />;
  if (pathname === "/author/system/") return <AuthorPage />;
  const post = posts.find(item => pathname === `/${item.slug}/`);
  if (post) return <ArticlePage post={post} />;
  const category = categories.find(item => pathname === item.path || new RegExp(`^${item.path}page/[1-9][0-9]*/$`).test(pathname));
  if (category) {
    const page = pathname === category.path ? 1 : Number(path[path.length - 1]);
    if (page > Math.max(1, Math.ceil(categoryPosts(category).length / pageSize))) notFound();
    return <CategoryPage category={category} page={page} />;
  }
  notFound();
}
