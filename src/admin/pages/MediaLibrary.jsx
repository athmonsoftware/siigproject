import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export default function MediaLibrary() {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadFiles = async () => {
    const { data } = await supabase.storage.from("site-media").list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });
    setFiles((data || []).filter((file) => file.name !== ".emptyFolderPlaceholder"));
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    loadFiles();
  }, []);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMessage("");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${Date.now()}-${safeName}`;
    const { error } = await supabase.storage
      .from("site-media")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    setBusy(false);
    setMessage(error ? error.message : "Image uploaded successfully.");
    if (!error) loadFiles();
    event.target.value = "";
  };

  const remove = async (name) => {
    setBusy(true);
    const { error } = await supabase.storage.from("site-media").remove([name]);
    setBusy(false);
    setMessage(error ? error.message : "Image removed.");
    if (!error) loadFiles();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading media...</div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Media library</h1>
        <p className="mt-2 text-slate-600">Upload and manage images for the SIIG website.</p>
      </header>
      <section className="border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-black text-slate-950">Website images</h2>
            <p className="mt-1 text-sm text-slate-500">JPG, PNG, WebP, GIF, or SVG. Maximum 5 MB.</p>
          </div>
          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-emerald-800 px-5 font-bold text-white hover:bg-emerald-900">
            <Upload className="h-4 w-4" />
            {busy ? "Working…" : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="sr-only"
              disabled={busy}
              onChange={upload}
            />
          </label>
        </div>
        {message && (
          <p role="status" className="mt-4 bg-slate-100 p-3 text-sm font-semibold text-slate-700">
            {message}
          </p>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {files.map((file) => {
            const { data } = supabase.storage.from("site-media").getPublicUrl(file.name);
            return (
              <article key={file.id || file.name} className="border border-slate-200">
                <img
                  src={data.publicUrl}
                  alt=""
                  className="aspect-video w-full bg-slate-100 object-cover"
                />
                <div className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">{file.name}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(data.publicUrl)}
                      className="mt-1 text-xs font-bold text-emerald-800 hover:underline"
                    >
                      Copy URL
                    </button>
                  </div>
                  <button
                    onClick={() => remove(file.name)}
                    disabled={busy}
                    className="grid h-11 w-11 shrink-0 place-items-center text-red-700 hover:bg-red-50"
                    aria-label={`Delete ${file.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
          {!files.length && (
            <p className="py-12 text-center text-slate-500 sm:col-span-2 xl:col-span-3">
              No images uploaded yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
