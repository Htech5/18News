import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueArticleSlug } from "@/lib/slug";

export async function GET(_, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    if (!article) {
      return NextResponse.json({ success: false, error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    const body = await req.json();
    const { title, excerpt, content, imageUrl, status, categoryId, isTrending } = body;

    const existing = await prisma.article.findUnique({
      where: { id },
      select: { title: true, status: true },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    const slug =
      title && title !== existing.title
        ? await uniqueArticleSlug(title, id)
        : undefined;

    const publishedAt =
      status === "PUBLISHED" && existing.status !== "PUBLISHED"
        ? new Date()
        : undefined;

    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(status && { status }),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
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
    const id = parseInt(rawId);
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Artikel berhasil dihapus" });
  } catch (err) {
    if (err.code === "P2025") {
      return NextResponse.json({ success: false, error: "Artikel tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}