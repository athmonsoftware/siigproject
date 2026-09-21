import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Check,
  FileText,
  Inbox,
  Image,
  LogOut,
  Menu,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { contentLabels, defaultContent } from "./content/defaults";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

const navigation = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "content", label: "Website content", icon: FileText },
  { id: "enquiries", label: "Enquiries", icon: Inbox },
  { id: "media", label: "Media library", icon: Image },
  { id: "settings", label: "Settings", icon: Settings },
];

const inputClass =
  "mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

function SetupScreen() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-white">
      <div className="mx-auto max-w-2xl border border-white/15 bg-white/5 p-8 shadow-2xl">
        <ShieldCheck className="mb-6 h-10 w-10 text-emerald-400" />
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
          SIIG administration
        </p>
        <h1 className="text-3xl font-black">Connect Supabase to activate the panel</h1>
        <p className="mt-4 leading-7 text-slate-300">
          Copy <code className="bg-white/10 px-1.5 py-1">.env.example</code> to
          <code className="ml-1 bg-white/10 px-1.5 py-1">.env.local</code>, add the project URL and public anon key, then run the database setup file.
        </p>
        <a href="/" className="mt-8 inline-flex min-h-11 items-center bg-white px-5 font-bold text-slate-950">
          Return to website
        </a>
      </div>
    </main>
  );
}

function Login({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else onAuthenticated(data.session);
    setLoading(false);
  };

  const requestReset = async (event) => {
    event.preventDefault();
    setLoading(true); setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setMessage(error ? error.message : "Check your email for the secure password reset link.");
    setLoading(false);
  };

  return (
    <main className="grid min-h-screen bg-slate-950 lg:grid-cols-2">
      <section className="hidden bg-emerald-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <img src="/logo.png" alt="SIIG" className="h-16 w-fit" />
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-300">Secure workspace</p>
          <h1 className="mt-5 max-w-lg text-5xl font-black leading-tight">Manage the SIIG website and every new enquiry.</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-emerald-100/75">Content changes publish to the public website without editing code.</p>
        </div>
        <p className="text-sm text-emerald-100/60">Safety Innovations Impact Group</p>
      </section>
      <section className="flex items-center justify-center px-5 py-12">
        <form onSubmit={recoveryMode ? requestReset : submit} className="w-full max-w-md bg-white p-8 shadow-2xl">
          <img src="/logo.png" alt="SIIG" className="mb-8 h-14 lg:hidden" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Admin panel</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">{recoveryMode ? "Reset your password" : "Welcome back"}</h2>
          <p className="mt-2 text-slate-600">{recoveryMode ? "We will email a secure reset link to your administrator address." : "Sign in with your approved SIIG administrator account."}</p>
          <label className="mt-8 block text-sm font-bold text-slate-700">Email
            <input className={inputClass} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {!recoveryMode && <label className="mt-5 block text-sm font-bold text-slate-700">Password
            <input className={inputClass} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>}
          {message && <p role="alert" className="mt-4 bg-red-50 p-3 text-sm text-red-800">{message}</p>}
          <button disabled={loading} className="mt-6 flex min-h-12 w-full items-center justify-center bg-emerald-800 px-5 font-bold text-white transition hover:bg-emerald-900 disabled:opacity-60">
            {loading ? "Working…" : recoveryMode ? "Send reset link" : "Sign in"}
          </button>
          <button type="button" onClick={() => { setRecoveryMode(!recoveryMode); setMessage(""); }} className="mt-4 w-full text-center text-sm font-bold text-emerald-800 hover:underline">{recoveryMode ? "Return to sign in" : "Forgot password?"}</button>
          <a href="/" className="mt-6 block text-center text-sm font-semibold text-slate-600 hover:text-emerald-800">View public website</a>
        </form>
      </section>
    </main>
  );
}

function PasswordReset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    if (password.length < 12) { setMessage("Use at least 12 characters."); return; }
    if (password !== confirmPassword) { setMessage("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setMessage(error.message);
    else { setMessage("Password updated. Redirecting to the admin panel…"); window.setTimeout(() => { window.location.href = "/admin"; }, 900); }
  };
  return <main className="grid min-h-screen place-items-center bg-slate-950 px-5"><form onSubmit={submit} className="w-full max-w-md bg-white p-8 shadow-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">SIIG administration</p><h1 className="mt-2 text-3xl font-black text-slate-950">Choose a new password</h1><p className="mt-2 text-slate-600">Use at least 12 characters and keep it private.</p><label className="mt-7 block text-sm font-bold text-slate-700">New password<input className={inputClass} type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label><label className="mt-5 block text-sm font-bold text-slate-700">Confirm password<input className={inputClass} type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></label>{message && <p role="status" className="mt-4 bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}<button disabled={loading} className="mt-6 min-h-12 w-full bg-emerald-800 px-5 font-bold text-white hover:bg-emerald-900 disabled:opacity-60">{loading ? "Updating…" : "Update password"}</button></form></main>;
}

function Metric({ label, value, note }) {
  return <article className="border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-3 text-3xl font-black text-slate-950">{value}</p><p className="mt-2 text-xs text-slate-500">{note}</p></article>;
}

function Overview({ enquiries, content }) {
  const newCount = enquiries.filter((item) => item.status === "new").length;
  const published = Object.values(content).filter((item) => item.is_published).length;
  return <div>
    <Header title="Overview" subtitle="A clear view of website activity and content status." />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Total enquiries" value={enquiries.length} note="All website submissions" />
      <Metric label="New enquiries" value={newCount} note="Waiting for a response" />
      <Metric label="Published sections" value={published} note={`of ${Object.keys(defaultContent).length} managed sections`} />
      <Metric label="Website status" value="Live" note="Public content available" />
    </div>
    <section className="mt-8 border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">Recent enquiries</h2>
      <div className="mt-5 divide-y divide-slate-100">
        {enquiries.slice(0, 5).map((item) => <div key={item.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-slate-900">{item.name}</p><p className="text-sm text-slate-500">{item.email} · {item.company || "Individual"}</p></div><Status status={item.status} /></div>)}
        {!enquiries.length && <p className="py-8 text-center text-slate-500">No enquiries have arrived yet.</p>}
      </div>
    </section>
  </div>;
}

function Header({ title, subtitle }) {
  return <header className="mb-8"><h1 className="text-3xl font-black tracking-tight text-slate-950">{title}</h1><p className="mt-2 text-slate-600">{subtitle}</p></header>;
}

function Status({ status }) {
  const styles = { new: "bg-amber-100 text-amber-800", contacted: "bg-blue-100 text-blue-800", closed: "bg-emerald-100 text-emerald-800" };
  return <span className={`w-fit px-2.5 py-1 text-xs font-bold capitalize ${styles[status] || "bg-slate-100 text-slate-700"}`}>{status}</span>;
}

function ContentEditor({ rows, onSaved }) {
  const [selected, setSelected] = useState("hero");
  const row = rows[selected] || { content: defaultContent[selected], is_published: true };
  const [draft, setDraft] = useState(row.content);
  const [published, setPublished] = useState(row.is_published);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setDraft(row.content); setPublished(row.is_published); setSaved(false); }, [selected, row.content, row.is_published]);
  const save = async () => {
    setSaving(true); setSaved(false);
    const { error } = await supabase.from("site_content").upsert({ section: selected, content: draft, is_published: published, updated_at: new Date().toISOString() }, { onConflict: "section" });
    setSaving(false);
    if (!error) { setSaved(true); onSaved(); }
  };

  return <div>
    <Header title="Website content" subtitle="Edit the public copy and control what is published." />
    <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
      <nav className="h-fit border border-slate-200 bg-white p-2 shadow-sm" aria-label="Content sections">
        {Object.entries(contentLabels).map(([key, label]) => <button key={key} onClick={() => setSelected(key)} className={`w-full px-4 py-3 text-left text-sm font-bold transition ${selected === key ? "bg-emerald-800 text-white" : "text-slate-700 hover:bg-slate-100"}`}>{label}</button>)}
      </nav>
      <section className="border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-xl font-black text-slate-950">{contentLabels[selected]}</h2><p className="mt-1 text-sm text-slate-500">Changes appear on the website after saving.</p></div>
          <label className="flex items-center gap-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-5 w-5 accent-emerald-800" /> Use saved content on website</label>
        </div>
        <div className="mt-6 grid gap-5">
          {Object.entries(draft).map(([key, value]) => <label key={key} className="block text-sm font-bold capitalize text-slate-700">{key.replaceAll("_", " ")}
            {String(value).length > 90 || String(value).includes("\n") ? <textarea rows={String(value).length > 250 ? 7 : 4} className={inputClass} value={value} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} /> : <input className={inputClass} value={value} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />}
          </label>)}
        </div>
        <div className="mt-7 flex items-center gap-4"><button onClick={save} disabled={saving} className="inline-flex min-h-11 items-center gap-2 bg-emerald-800 px-5 font-bold text-white hover:bg-emerald-900 disabled:opacity-60"><Save className="h-4 w-4" />{saving ? "Saving…" : "Save changes"}</button>{saved && <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700"><Check className="h-4 w-4" /> Saved</span>}</div>
      </section>
    </div>
  </div>;
}

function Enquiries({ items, onUpdated }) {
  const updateStatus = async (id, status) => { await supabase.from("enquiries").update({ status }).eq("id", id); onUpdated(); };
  return <div><Header title="Enquiries" subtitle="Review and track every message submitted through the website." />
    <div className="overflow-x-auto border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4">Contact</th><th className="p-4">Message</th><th className="p-4">Received</th><th className="p-4">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item.id} className="align-top"><td className="p-4"><p className="font-bold text-slate-900">{item.name}</p><a className="text-emerald-800 hover:underline" href={`mailto:${item.email}`}>{item.email}</a><p className="text-slate-500">{item.phone}</p><p className="text-slate-500">{item.company}</p></td><td className="max-w-md whitespace-pre-wrap p-4 leading-6 text-slate-700">{item.message}</td><td className="p-4 text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td><td className="p-4"><select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)} className="border border-slate-300 bg-white px-3 py-2"><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></td></tr>)}{!items.length && <tr><td colSpan="4" className="p-12 text-center text-slate-500">No enquiries have arrived yet.</td></tr>}</tbody></table></div>
  </div>;
}

function MediaLibrary() {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadFiles = async () => {
    const { data } = await supabase.storage.from("site-media").list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });
    setFiles((data || []).filter((file) => file.name !== ".emptyFolderPlaceholder"));
  };

  useEffect(() => { loadFiles(); }, []);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setMessage("");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("site-media").upload(path, file, { cacheControl: "3600", upsert: false });
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

  return <div><Header title="Media library" subtitle="Upload and manage images for the SIIG website." />
    <section className="border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-black text-slate-950">Website images</h2><p className="mt-1 text-sm text-slate-500">JPG, PNG, WebP, GIF, or SVG. Maximum 5 MB.</p></div><label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-emerald-800 px-5 font-bold text-white hover:bg-emerald-900"><Upload className="h-4 w-4" />{busy ? "Working…" : "Upload image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="sr-only" disabled={busy} onChange={upload} /></label></div>
      {message && <p role="status" className="mt-4 bg-slate-100 p-3 text-sm font-semibold text-slate-700">{message}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{files.map((file) => { const { data } = supabase.storage.from("site-media").getPublicUrl(file.name); return <article key={file.id || file.name} className="border border-slate-200"><img src={data.publicUrl} alt="" className="aspect-video w-full bg-slate-100 object-cover" /><div className="flex items-center justify-between gap-3 p-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-800">{file.name}</p><button onClick={() => navigator.clipboard.writeText(data.publicUrl)} className="mt-1 text-xs font-bold text-emerald-800 hover:underline">Copy URL</button></div><button onClick={() => remove(file.name)} disabled={busy} className="grid h-11 w-11 shrink-0 place-items-center text-red-700 hover:bg-red-50" aria-label={`Delete ${file.name}`}><Trash2 className="h-4 w-4" /></button></div></article>; })}{!files.length && <p className="py-12 text-center text-slate-500 sm:col-span-2 xl:col-span-3">No images uploaded yet.</p>}</div>
    </section>
  </div>;
}

function SettingsPanel({ user }) {
  return <div><Header title="Settings" subtitle="Account and integration details for this workspace." /><section className="max-w-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-black text-slate-950">Signed-in administrator</h2><p className="mt-2 text-slate-600">{user.email}</p><div className="mt-6 border-t border-slate-200 pt-6"><h3 className="font-black text-slate-950">Content delivery</h3><p className="mt-2 text-sm leading-6 text-slate-600">Published content is loaded from Supabase. The built-in website copy remains as a safe fallback if the service is unavailable.</p></div></section></div>;
}

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [contentRows, setContentRows] = useState({});

  const load = async () => {
    const [{ data: enquiryData }, { data: contentData }] = await Promise.all([
      supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("site_content").select("*"),
    ]);
    setEnquiries(enquiryData || []);
    const rows = Object.fromEntries((contentData || []).map((row) => [row.section, row]));
    for (const [section, content] of Object.entries(defaultContent)) if (!rows[section]) rows[section] = { section, content, is_published: true };
    setContentRows(rows);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) { setAuthorized(null); return; }
    supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle().then(({ data, error }) => {
      const hasAccess = !error && ["admin", "editor"].includes(data?.role);
      setAuthorized(hasAccess);
      if (hasAccess) load();
    });
  }, [session]);

  const currentView = useMemo(() => {
    if (active === "content") return <ContentEditor rows={contentRows} onSaved={load} />;
    if (active === "enquiries") return <Enquiries items={enquiries} onUpdated={load} />;
    if (active === "media") return <MediaLibrary />;
    if (active === "settings") return <SettingsPanel user={session.user} />;
    return <Overview enquiries={enquiries} content={contentRows} />;
  }, [active, enquiries, contentRows, session]);

  if (!isSupabaseConfigured) return <SetupScreen />;
  if (loading) return <main className="grid min-h-screen place-items-center bg-slate-950 text-white"><RefreshCw className="h-7 w-7 animate-spin" aria-label="Loading" /></main>;
  if (window.location.pathname === "/admin/reset-password" && session) return <PasswordReset />;
  if (!session) return <Login onAuthenticated={setSession} />;
  if (authorized === null) return <main className="grid min-h-screen place-items-center bg-slate-950 text-white"><RefreshCw className="h-7 w-7 animate-spin" aria-label="Checking access" /></main>;
  if (!authorized) return <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-white"><section className="max-w-lg border border-white/15 bg-white/5 p-8 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-amber-400" /><h1 className="mt-5 text-3xl font-black">Access awaiting approval</h1><p className="mt-3 leading-7 text-slate-300">This account is authenticated but has not been assigned an SIIG administrator or editor role.</p><button onClick={() => supabase.auth.signOut()} className="mt-7 min-h-11 bg-white px-5 font-bold text-slate-950">Sign out</button></section></main>;

  return <div className="min-h-screen bg-slate-100 text-slate-900">
    <button onClick={() => setMenuOpen(true)} className="fixed left-4 top-4 z-30 grid h-11 w-11 place-items-center bg-slate-950 text-white lg:hidden" aria-label="Open navigation"><Menu /></button>
    {menuOpen && <button className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close navigation overlay" />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 p-5 text-white transition-transform duration-300 lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between"><a href="/" className="flex items-center gap-3"><img src="/logo.png" alt="SIIG" className="h-12" /><div><p className="font-black">SIIG</p><p className="text-xs text-slate-400">Administration</p></div></a><button onClick={() => setMenuOpen(false)} className="grid h-11 w-11 place-items-center lg:hidden" aria-label="Close navigation"><X /></button></div>
      <nav className="mt-10 space-y-2">{navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setActive(id); setMenuOpen(false); }} className={`flex min-h-12 w-full items-center gap-3 px-4 text-left font-bold transition ${active === id ? "bg-emerald-700 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon className="h-5 w-5" />{label}</button>)}</nav>
      <div className="mt-auto border-t border-white/10 pt-5"><p className="truncate px-2 text-xs text-slate-400">{session.user.email}</p><button onClick={() => supabase.auth.signOut()} className="mt-3 flex min-h-11 w-full items-center gap-3 px-2 font-bold text-slate-300 hover:text-white"><LogOut className="h-5 w-5" />Sign out</button></div>
    </aside>
    <main className="min-h-screen px-5 pb-12 pt-20 lg:ml-72 lg:px-10 lg:pt-10">{currentView}</main>
  </div>;
}
