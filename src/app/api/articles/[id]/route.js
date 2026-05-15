import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueArticleSlug } from "@/lib/slug";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(_, { params }) {
  try {
    const { id: rawId } = await params;
    const id = rawId;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!article) {
      return NextResponse.json({ success: false, error: "Artikel tidak ditemukan" }, { status: 404, headers: corsHeaders });
    }

    // Increment view count
    await prisma.article.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: article }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id: rawId } = await params;
    const id = rawId;
    const body = await req.json();
    console.log("API PUT body:", body);
    const { title, excerpt, content, imageUrl, categoryId, isTrending } = body;

    console.log("imageUrl diterima API:", imageUrl);

    const existing = await prisma.article.findUnique({
      where: { id },
      select: { title: true, publishedAt: true },
    });

    const publishedAt = existing.publishedAt ?? new Date();

    if (!existing) {
      return NextResponse.json({ success: false, error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    const slug =
      title && title !== existing.title
        ? await uniqueArticleSlug(title, id)
        : undefined;


    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(categoryId && { categoryId }),
        ...(publishedAt && { publishedAt }),
        ...(isTrending !== undefined && { isTrending }),
      },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    const { id: rawId } = await params;
    const id = rawId;
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Artikel berhasil dihapus" });
  } catch (err) {
    if (err.code === "P2025") {
      return NextResponse.json({ success: false, error: "Artikel tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}