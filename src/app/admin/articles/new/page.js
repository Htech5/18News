"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", imageUrl: "", categoryId: "", isTrending: false,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((json) => { if (json.success) setCategories(json.data); });
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return showToast("Judul wajib diisi", "error");
    if (!form.content.trim()) return showToast("Konten wajib diisi", "error");
    if (!form.categoryId) return showToast("Pilih kategori", "error");

    setLoading(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: "PUBLISHED",
          categoryId: parseInt(form.categoryId),
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Artikel berhasil disimpan!");
        setTimeout(() => router.push("/admin"), 1000);
      } else {
        showToast(json.error || "Gagal menyimpan artikel", "error");
      }
    } catch {
      showToast("Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tulis Artikel</h1>
          <p className="page-subtitle">Buat artikel berita baru</p>
        </div>
        <Link href="/admin" className="btn btn-ghost">← Kembali</Link>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Judul Artikel *</label>
          <input id="title" name="title" className="form-input" type="text" placeholder="Masukkan judul..." value={form.title} onChange={handleChange} />
          <p className="form-hint">Slug URL digenerate otomatis dari judul</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="excerpt">Ringkasan</label>
          <input id="excerpt" name="excerpt" className="form-input" type="text" placeholder="Ringkasan singkat..." value={form.excerpt} onChange={handleChange} maxLength={500} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="content">Konten Artikel *</label>
          <textarea id="content" name="content" className="form-textarea" placeholder="Tulis konten artikel di sini..." value={form.content} onChange={handleChange} style={{ minHeight: "240px" }} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="categoryId">Kategori *</label>
            <select id="categoryId" name="categoryId" className="form-select" value={form.categoryId} onChange={handleChange}>
              <option value="">Pilih kategori...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="imageUrl">URL Gambar</label>
            <input id="imageUrl" name="imageUrl" className="form-input" type="url" placeholder="https://..." value={form.imageUrl} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label className="trending-toggle">
            <input
              type="checkbox"
              name="isTrending"
              checked={form.isTrending}
              onChange={handleChange}
            />
            <span>Tandai sebagai artikel Trending</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Artikel"}
          </button>
          <Link href="/admin" className="btn btn-ghost">Batal</Link>
        </div>
      </form>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}
    </>
  );
}