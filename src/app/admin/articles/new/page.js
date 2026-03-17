"use client";

import { useState, useEffect,  useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewArticlePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", categoryId: "", isTrending: false,
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



  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return showToast("Format tidak didukung. Gunakan JPG, PNG, atau WebP", "error");
    }
    if (file.size > 5 * 1024 * 1024) {
      return showToast("Ukuran file maksimal 5MB", "error");
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }



  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      let imageUrl = imagePreview;
      if (imageFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });

        const uploadJson = await uploadRes.json();

        
      if (!uploadJson.success) {
          setLoading(false);
          return showToast(uploadJson.error || "Gagal upload gambar", "error");
        }

        imageUrl = uploadJson.data.imageUrl;
      }
    
      
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          imageUrl,
          categoryId: form.categoryId,
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
            <label className="form-label">Gambar Artikel</label>
            {imagePreview ? (
              <div className="image-preview-wrap">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button type="button" className="image-remove-btn" onClick={handleRemoveImage}>
                  ✕ Hapus
                </button>
              </div>
            ) : (
              <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
                <span className="image-upload-text">Klik untuk upload gambar</span>
                <span className="image-upload-hint">JPG, PNG, WebP — maks 5MB</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
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