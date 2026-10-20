import data from "./site-data.json";

export const posts = data.posts;
export const categories = data.categories;
export const aboutParagraphs = data.about;
export type MedicalPost = (typeof posts)[number];
export type MedicalCategory = (typeof categories)[number];
export const pageSize = 10;

export function categoryPosts(category: MedicalCategory) {
  const ids = new Set([category.id]);
  for (let i = 0; i < categories.length; i++) {
    categories.forEach(item => { if (ids.has(item.parent)) ids.add(item.id); });
  }
  return posts.filter(post => post.categories.some(id => ids.has(id)));
}

export function routePaths() {
  return [
    "/gioi-thieu/", "/lien-he/", "/trang-chu/", "/author/system/",
    ...posts.map(post => `/${post.slug}/`),
    ...categories.flatMap(category => {
      const pages = Math.max(1, Math.ceil(categoryPosts(category).length / pageSize));
      return Array.from({ length: pages }, (_, i) => i === 0 ? category.path : `${category.path}page/${i + 1}/`);
    }),
  ];
}

export function displayDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}
