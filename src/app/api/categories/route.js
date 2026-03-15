import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { articles: true } },
      },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "name wajib diisi" }, { status: 400 });
    }

    const slug = generateSlug(name);
    const category = await prisma.category.create({ data: { name, slug } });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err) {
    if (err.code === "P2002") {
      return NextResponse.json({ success: false, error: "Kategori sudah ada" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}