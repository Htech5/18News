const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "teknologi" }, update: {}, create: { name: "Teknologi", slug: "teknologi" } }),
    prisma.category.upsert({ where: { slug: "politik" }, update: {}, create: { name: "Politik", slug: "politik" } }),
    prisma.category.upsert({ where: { slug: "olahraga" }, update: {}, create: { name: "Olahraga", slug: "olahraga" } }),
  ]);

  await prisma.article.upsert({
    where: { slug: "nextjs-15-rilis" },
    update: {},
    create: {
      title: "Next.js 15 Rilis dengan Turbopack Stabil",
      slug: "nextjs-15-rilis",
      excerpt: "Vercel merilis Next.js 15 yang kini sudah stabil untuk production.",
      content: "Konten lengkap artikel di sini...",
      publishedAt: new Date(),
      isTrending: true,
      categoryId: categories[0].id,
    },
  });

  console.log("Seed selesai!");
}

main().catch(console.error).finally(() => prisma.$disconnect());