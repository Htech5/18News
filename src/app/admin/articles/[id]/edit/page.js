"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditArticlePage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", imageUrl: "", categoryId: "", isTrending: false,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [articleRes, categoryRes] = await Promise.all([
          fetch(`/api/articles/${id}`),
          fetch("/api/categories"),
        ]);
        const articleJson = await articleRes.json();
        const categoryJson = await categoryRes.json();

        if (!articleJson.success) { setNotFound(true); return; }

        const a = articleJson.data;
        setForm({
          title: a.title, excerpt: a.excerpt || "", content: a.content,
          imageUrl: a.imageUrl || "", categoryId: String(a.categoryId),
          isTrending: a.isTrending,
        });
        if (categoryJson.success) setCategories(categoryJson.data);
      } catch {
        setNotFound(true);
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [id]);

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
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: "PUBLISHED",
          categoryId: parseInt(form.categoryId),
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Artikel berhasil diupdate!");
        setTimeout(() => router.push("/admin"), 1000);
      } else {
        showToast(json.error || "Gagal update", "error");
      }
    } catch {
      showToast("Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div className="loading">Memuat artikel...</div>;

  if (notFound) return (
    <div className="empty-state">
      <p>Artikel tidak ditemukan</p>
      <Link href="/admin" className="btn btn-primary">Kembali ke Dashboard</Link>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Artikel</h1>
          <p className="page-subtitle">ID: {id}</p>
        </div>
        <Link href="/admin" className="btn btn-ghost">← Kembali</Link>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Judul Artikel *</label>
          <input id="title" name="title" className="form-input" type="text" value={form.title} onChange={handleChange} />
          <p className="form-hint">Slug digenerate ulang otomatis jika judul berubah</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="excerpt">Ringkasan</label>
          <input id="excerpt" name="excerpt" className="form-input" type="text" value={form.excerpt} onChange={handleChange} maxLength={500} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="content">Konten Artikel *</label>
          <textarea id="content" name="content" className="form-textarea" value={form.content} onChange={handleChange} style={{ minHeight: "240px" }} />
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
            {loading ? "Menyimpan..." : "Update Artikel"}
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