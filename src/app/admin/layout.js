import "./admin.css";
import Link from "next/link";

export const metadata = {
  title: "Admin — Portal Berita",
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-dot" />
          <span>18News Dashboard</span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Menu</p>
          <Link href="/admin" className="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </Link>
          <Link href="/admin/articles/new" className="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Tulis Artikel
          </Link>
        </nav>

        <div className="sidebar-footer">Portal Berita v1.0</div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}