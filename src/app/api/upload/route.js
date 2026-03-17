import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ success: false, error: "File tidak ditemukan" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Format tidak didukung. Gunakan JPG, PNG, atau WebP" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Nama file unik pakai timestamp + random string
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Buat folder uploads kalau belum ada
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Simpan file ke public/uploads
    await writeFile(path.join(uploadDir, filename), buffer);

    // URL yang disimpan ke database
    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, data: { imageUrl } });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}