import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

function StatusBadge({ isPublished }) {
  return (
    <span
      className={`w-fit px-2.5 py-1 text-xs font-bold capitalize ${
        isPublished
          ? "bg-emerald-100 text-emerald-800"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

export default function ArticlesManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const getStoragePathFromUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    try {
      const marker = "/storage/v1/object/public/site-media/";
      const index = url.indexOf(marker);
      if (index !== -1) {
        return decodeURIComponent(url.substring(index + marker.length));
      }
    } catch {
      // Ignore parsing errors
    }
    return null;
  };

  const load = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    load();
  }, []);

  const openNew = () => {
    setEditingItem({});
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCoverImage("");
    setIsPublished(true);
    setMessage("");
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setSlug(item.slug || "");
    setExcerpt(item.excerpt || "");
    setContent(item.content || "");
    setCoverImage(item.cover_image || "");
    setIsPublished(item.is_published ?? true);
    setMessage("");
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!editingItem?.id) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Cover image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setSaving(true);
    setMessage("");

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `articles/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from("site-media")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      setMessage(error.message);
    } else {
      if (editingItem?.cover_image && editingItem.cover_image !== coverImage) {
        const oldPath = getStoragePathFromUrl(editingItem.cover_image);
        if (oldPath) {
          await supabase.storage.from("site-media").remove([oldPath]);
        }
      }

      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      setCoverImage(data.publicUrl);
      setMessage("Cover image uploaded successfully.");
    }
    setSaving(false);
    event.target.value = "";
  };

  const saveArticle = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      title,
      slug,
      excerpt,
      content,
      cover_image: coverImage.trim() || null,
      is_published: isPublished,
    };

    let error;
    if (editingItem?.id) {
      if (
        editingItem.cover_image &&
        editingItem.cover_image !== payload.cover_image
      ) {
        const oldPath = getStoragePathFromUrl(editingItem.cover_image);
        if (oldPath) {
          await supabase.storage.from("site-media").remove([oldPath]);
        }
      }

      const res = await supabase
        .from("articles")
        .update(payload)
        .eq("id", editingItem.id);
      error = res.error;
    } else {
      const res = await supabase.from("articles").insert([payload]);
      error = res.error;
    }

    setSaving(false);
    if (!error) {
      setEditingItem(null);
      load();
    } else {
      setMessage("Error saving article: " + error.message);
    }
  };

  const deleteArticle = async (item) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    // Delete associated image from bucket if it exists
    if (item.cover_image) {
      const path = getStoragePathFromUrl(item.cover_image);
      if (path) {
        await supabase.storage.from("site-media").remove([path]);
      }
    }

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", item.id);
    if (error) {
      alert("Error deleting article: " + error.message);
    } else {
      load();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading articles...</div>
      </div>
    );
  }

  // Edit / Create Form View
  if (editingItem !== null) {
    return (
      <div>
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">
              {editingItem?.id ? "Edit Article" : "New Article"}
            </h1>
            <p className="mt-2 text-slate-600">
              Fill in the details for your news update.
            </p>
          </div>
          <button
            onClick={() => setEditingItem(null)}
            className="border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Back to List
          </button>
        </header>

        <form
          onSubmit={saveArticle}
          className="border border-slate-200 bg-white p-6 shadow-sm space-y-6"
        >
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              required
              maxLength={200}
              className="w-full border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Article headline..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Slug (URL path)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              maxLength={200}
              className="w-full border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="my-article-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Cover Image
            </label>
            <div className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-start">
              <div className="aspect-[16/9] overflow-hidden bg-slate-100 border border-slate-200">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-slate-400 font-medium">
                    No image
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <label className="inline-flex cursor-pointer items-center gap-2 bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
                  {saving ? "Working..." : "Upload image file"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    disabled={saving}
                    onChange={uploadPhoto}
                  />
                </label>
                <p className="text-xs text-slate-500">
                  JPG, PNG, or WebP. Max size: 5 MB. Alternatively, enter a
                  direct URL below.
                </p>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  maxLength={1000}
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-sm"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Excerpt / Summary
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows="2"
              maxLength={500}
              className="w-full border border-slate-300 bg-white px-3 py-2 text-sm resize-none"
              placeholder="Short summary for card previews..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="8"
              className="w-full border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Full article content..."
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 accent-emerald-800"
            />
            Publish live on website
          </label>

          {message && (
            <p className="bg-slate-100 p-3 text-sm font-semibold text-slate-700">
              {message}
            </p>
          )}

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-800 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Article"}
            </button>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="border border-slate-300 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // List View
  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Articles
          </h1>
          <p className="mt-2 text-slate-600">
            Create, edit, and publish news updates and articles.
          </p>
        </div>
        <button
          onClick={openNew}
          className="bg-emerald-800 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-900"
        >
          + Add Article
        </button>
      </header>

      <div className="overflow-x-auto border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="align-middle">
                <td className="p-4 font-bold text-slate-900 max-w-xs truncate">
                  {item.title}
                </td>
                <td className="p-4 text-slate-500 font-mono text-xs">
                  /{item.slug}
                </td>
                <td className="p-4">
                  <StatusBadge isPublished={item.is_published} />
                </td>
                <td className="p-4 text-slate-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="border border-slate-300 bg-white px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteArticle(item)}
                    className="border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500">
                  No articles created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
