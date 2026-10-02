import { useEffect, useState } from "react";
import { Pencil, Plus, Save, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

const emptyImage = {
  title: "",
  description: "",
  image_url: "",
  image_alt: "",
  display_order: 0,
  is_published: true,
};

const inputClass = "mt-1 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

export default function GalleryManagement() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyImage);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data, error } = await supabase.from("gallery").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: true });
    if (error) setMessage(error.message);
    setImages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isSupabaseConfigured) load();
  }, []);

  const reset = () => {
    setEditingId(null);
    setForm({ ...emptyImage, display_order: images.length });
    setMessage("");
  };

  const startEdit = (image) => {
    setEditingId(image.id);
    setForm({
      title: image.title,
      description: image.description || "",
      image_url: image.image_url || "",
      image_alt: image.image_alt || "",
      display_order: image.display_order ?? 0,
      is_published: image.is_published,
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Photo must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }
    setSaving(true);
    setMessage("");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `gallery/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("site-media").upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) setMessage(error.message);
    else {
      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      setForm((current) => ({ ...current, image_url: data.publicUrl }));
      setMessage("Photo uploaded. Save the image to apply it.");
    }
    setSaving(false);
    event.target.value = "";
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
      image_alt: form.image_alt.trim() || null,
      display_order: Number(form.display_order) || 0,
      is_published: form.is_published,
    };
    const operation = editingId
      ? supabase.from("gallery").update(payload).eq("id", editingId)
      : supabase.from("gallery").insert(payload);
    const { error } = await operation;
    setSaving(false);
    if (error) return setMessage(error.message);
    setMessage(editingId ? "Gallery image updated." : "Gallery image added.");
    setEditingId(null);
    setForm({ ...emptyImage, display_order: images.length + 1 });
    load();
  };

  const remove = async (image) => {
    if (!window.confirm(`Remove "${image.title}" from the gallery?`)) return;
    setSaving(true);
    const { error } = await supabase.from("gallery").delete().eq("id", image.id);
    setSaving(false);
    setMessage(error ? error.message : "Gallery image removed.");
    if (!error) load();
  };

  if (loading) return <div className="py-12 text-slate-500">Loading gallery images...</div>;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Gallery Management</h1>
        <p className="mt-2 text-slate-600">Add images to the gallery, upload photos, and control what appears publicly.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(20rem,28rem)_1fr]">
        <form onSubmit={save} className="h-fit border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-950">{editingId ? "Edit image" : "Add image"}</h2>
            {editingId && <button type="button" onClick={reset} className="text-sm font-bold text-emerald-800 hover:underline">Add new</button>}
          </div>
          <label className="mt-5 block text-sm font-bold text-slate-700">Title<input className={inputClass} required minLength="2" maxLength="200" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label className="mt-4 block text-sm font-bold text-slate-700">Description<textarea className={inputClass} rows="3" maxLength="500" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <div className="mt-5 grid gap-4 sm:grid-cols-[7rem_1fr]">
            <div className="aspect-square overflow-hidden bg-slate-100">{form.image_url ? <img src={form.image_url} alt="Image preview" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center"><ImageIcon className="h-8 w-8 text-slate-400" /></div>}</div>
            <div><label className="inline-flex min-h-11 cursor-pointer items-center gap-2 bg-slate-950 px-4 text-sm font-bold text-white hover:bg-slate-800"><Upload className="h-4 w-4" />Upload photo<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={saving} onChange={uploadPhoto} /></label><p className="mt-2 text-xs leading-5 text-slate-500">JPG, PNG, or WebP. Maximum 5 MB.</p></div>
          </div>
          <label className="mt-4 block text-sm font-bold text-slate-700">Image URL<input className={inputClass} type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></label>
          <label className="mt-4 block text-sm font-bold text-slate-700">Image description (alt text)<input className={inputClass} maxLength="240" value={form.image_alt} onChange={(e) => setForm({ ...form, image_alt: e.target.value })} /></label>
          <label className="mt-4 block text-sm font-bold text-slate-700">Display order<input className={inputClass} type="number" min="0" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} /></label>
          <label className="mt-5 flex items-center gap-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-5 w-5 accent-emerald-800" />Show on public website</label>
          {message && <p role="status" className="mt-4 bg-slate-100 p-3 text-sm font-semibold text-slate-700">{message}</p>}
          <button disabled={saving} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-emerald-800 px-5 font-bold text-white hover:bg-emerald-900 disabled:opacity-60">{editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saving ? "Saving..." : editingId ? "Save changes" : "Add image"}</button>
        </form>

        <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-black text-slate-950">Current gallery</h2><p className="mt-1 text-sm text-slate-500">Published images appear on the website.</p></div><span className="text-sm font-bold text-slate-500">{images.length} total</span></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {images.map((image) => <article key={image.id} className="overflow-hidden border border-slate-200">
              <div className="aspect-square bg-slate-100">{image.image_url ? <img src={image.image_url} alt={image.image_alt || ""} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center"><ImageIcon className="h-9 w-9 text-slate-400" /></div>}</div>
              <div className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words font-black text-slate-950">{image.title}</h3>{image.description && <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{image.description}</p>}</div><span className={`shrink-0 px-2 py-1 text-[11px] font-bold uppercase ${image.is_published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{image.is_published ? "Live" : "Draft"}</span></div><div className="mt-4 flex gap-2"><button type="button" onClick={() => startEdit(image)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 border border-slate-300 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50"><Pencil className="h-4 w-4" />Edit</button><button type="button" onClick={() => remove(image)} disabled={saving} className="grid h-10 w-10 place-items-center text-red-700 hover:bg-red-50" aria-label={`Remove ${image.title}`}><Trash2 className="h-4 w-4" /></button></div></div>
            </article>)}
            {!images.length && <div className="border border-dashed border-slate-300 p-10 text-center md:col-span-2 2xl:col-span-3"><ImageIcon className="mx-auto h-9 w-9 text-slate-400" /><p className="mt-4 font-bold text-slate-700">No gallery images yet</p><p className="mt-1 text-sm text-slate-500">Add the first image with the form.</p></div>}
          </div>
        </section>
      </div>
    </div>
  );
}
