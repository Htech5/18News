"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [trendingFilter, setTrendingFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(trendingFilter !== "" && { trending: trendingFilter }),
      });

      const res = await fetch(`/api/articles?${params}`);
      const json = await res.json();

      if (json.success) {
        setArticles(json.data.items);
        setTotal(json.data.total);
        setTotalPages(json.data.totalPages);
      }
    } catch {
      showToast("Gagal memuat artikel", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, trendingFilter]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);
  useEffect(() => { setPage(1); }, [search, trendingFilter]);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleDelete(id, title) {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showToast("Artikel berhasil dihapus");
        fetchArticles();
      } else {
        showToast(json.error, "error");
      }
    } catch {
      showToast("Gagal menghapus artikel", "error");
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  }

  const trending = articles.filter((a) => a.isTrending).length;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Kelola semua artikel berita</p>
        </div>
        <Link href="/admin/articles/new" className="btn btn-primary">+ Tulis Artikel</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Artikel</p>
          <p className="stat-value accent">{total}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Trending</p>
          <p className="stat-value success">{trending}</p>
        </div>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Cari judul atau konten..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="filter-select" value={trendingFilter} onChange={(e) => setTrendingFilter(e.target.value)}>
          <option value="">Semua Artikel</option>
          <option value="true">Trending</option>
          <option value="false">Tidak Trending</option>
        </select>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="loading">Memuat artikel...</div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada artikel</p>
            <Link href="/admin/articles/new" className="btn btn-primary">Tulis Artikel Pertama</Link>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Artikel</th>
                <th>Kategori</th>
                <th>Trending</th>
                <th>Views</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "var(--bg)",
                        border: "1px solid var(--border)",
                      }}>
                        {article.imageUrl
                          ? <img
                              src={article.imageUrl}
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          : <div style={{
                              width: "100%", height: "100%",
                              display: "flex", alignItems: "center",
                              justifyContent: "center", fontSize: "22px",
                            }}>📰</div>
                        }
                      </div>
                      <div className="article-title-cell">
                        <div>{article.title}</div>
                        {article.excerpt && (
                          <div className="article-excerpt">{article.excerpt}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{article.category?.name || "—"}</td>
                  <td>
                    {article.isTrending
                      ? <span className="badge badge-published">Trending</span>
                      : <span className="badge badge-draft">Biasa</span>
                    }
                  </td>
                  <td>{article.viewCount.toLocaleString("id-ID")}</td>
                  <td>{formatDate(article.publishedAt)}</td>
                  <td>
                    <div className="actions">
                      <Link href={`/admin/articles/${article.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(article.id, article.title)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <span>Halaman {page} dari {totalPages} — {total} artikel</span>
          <div className="pagination-btns">
            <button className="btn btn-ghost btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}
    </>
  );
}