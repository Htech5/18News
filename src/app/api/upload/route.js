import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format tidak didukung. Gunakan JPG, PNG, WebP, atau GIF",
        },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop();
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const filename = `articles/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}-${safeName}.${ext}`;

    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: blob.url,
        pathname: blob.pathname,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Gagal upload gambar",
      },
      { status: 500 }
    );
  }
}
