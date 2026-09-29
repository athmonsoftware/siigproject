import { useEffect, useState } from "react";
import { Check, Save } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { contentLabels, defaultContent } from "../../content/defaults";

const inputClass =
  "mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

export default function ContentManagement({ userId }) {
  const [selected, setSelected] = useState("hero");
  const [contentRows, setContentRows] = useState({});
  const [draft, setDraft] = useState({});
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("site_content").select("*");
    const rows = Object.fromEntries((data || []).map((row) => [row.section, row]));
    for (const [section, content] of Object.entries(defaultContent))
      if (!rows[section]) rows[section] = { section, content, is_published: true };
    setContentRows(rows);
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    load();
  }, []);

  useEffect(() => {
    const row = contentRows[selected] || { content: defaultContent[selected], is_published: true };
    setDraft(row.content);
    setPublished(row.is_published);
    setSaved(false);
  }, [selected, contentRows]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const { error } = await supabase
      .from("site_content")
      .upsert(
        {
          section: selected,
          content: draft,
          is_published: published,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section" },
      );
    setSaving(false);
    if (!error) {
      setSaved(true);
      load();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading content...</div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Website content</h1>
        <p className="mt-2 text-slate-600">Edit the public copy and control what is published.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
        <nav className="h-fit border border-slate-200 bg-white p-2 shadow-sm" aria-label="Content sections">
          {Object.entries(contentLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`w-full px-4 py-3 text-left text-sm font-bold transition ${
                selected === key ? "bg-emerald-800 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <section className="border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">{contentLabels[selected]}</h2>
              <p className="mt-1 text-sm text-slate-500">Changes appear on the website after saving.</p>
            </div>
            <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-5 w-5 accent-emerald-800"
              />{" "}
              Use saved content on website
            </label>
          </div>
          <div className="mt-6 grid gap-5">
            {Object.entries(draft).map(([key, value]) => (
              <label key={key} className="block text-sm font-bold capitalize text-slate-700">
                {key.replaceAll("_", " ")}
                {String(value).length > 90 || String(value).includes("\n") ? (
                  <textarea
                    rows={String(value).length > 250 ? 7 : 4}
                    className={inputClass}
                    value={value}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={value}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="mt-7 flex items-center gap-4">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex min-h-11 items-center gap-2 bg-emerald-800 px-5 font-bold text-white hover:bg-emerald-900 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save changes"}
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
                <Check className="h-4 w-4" /> Saved
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
