/**
 * API helper functions for fetching data from the backend.
 * Uses relative URLs since frontend and backend are in the same Next.js project.
 */

/**
 * Fetch articles with pagination & filters
 */
export async function fetchArticles({ page = 1, limit = 10, category, isTrending, search } = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (category) params.set("category", category);
  if (isTrending) params.set("isTrending", "true");
  if (search) params.set("search", search);

  const res = await fetch(`/api/articles?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch articles: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

/**
 * Fetch single article by ID
 */
export async function fetchArticleById(id) {
  const res = await fetch(`/api/articles/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch article: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

/**
 * Fetch all categories
 */
export async function fetchCategories() {
  const res = await fetch(`/api/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}
