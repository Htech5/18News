import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueArticleSlug } from "@/lib/slug";

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "10"));
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { excerpt: { contains: search } },
        ],
      }),
    };

    const [articles, total] = await prisma.$transaction([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: articles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, excerpt, content, imageUrl, status = "DRAFT", categoryId, isTrending } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { success: false, error: "title, content, dan categoryId wajib diisi" },
        { status: 400 }
      );
    }

    const slug = await uniqueArticleSlug(title);

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        imageUrl: imageUrl || null,
        status,
        categoryId: parseInt(categoryId),
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        isTrending: isTrending || false,
      },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}