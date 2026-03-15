import { prisma } from "./prisma";

export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uniqueArticleSlug(title, excludeId) {
  const base = generateSlug(title);
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${counter++}`;
  }

  return slug;
}