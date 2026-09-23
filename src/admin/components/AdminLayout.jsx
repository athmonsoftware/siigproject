import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { useLocation } from "react-router-dom";

const navigation = [
  { id: "dashboard", label: "Dashboard", path: "/admin" },
  { id: "content", label: "Content", path: "/admin/content" },
  { id: "enquiries", label: "Enquiries", path: "/admin/enquiries" },
  { id: "media", label: "Media", path: "/admin/media" },
  { id: "team", label: "Team", path: "/admin/team" },
  {
    id: "certifications",
    label: "Certifications",
    path: "/admin/certifications",
  },
  { id: "users", label: "Users", path: "/admin/users" },
  { id: "settings", label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout({ children, session }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Automatically determine active nav based on current pathname
  const activeNav = navigation.find(
    (item) => item.path === location.pathname
  )?.id;

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-16 text-white">
        <div className="mx-auto max-w-2xl border border-white/15 bg-white/5 p-8 shadow-2xl">
          <h1 className="text-3xl font-black">
            Connect Supabase to activate the panel
          </h1>
          <p className="mt-4 leading-7 text-slate-300">
            Copy <code className="bg-white/10 px-1.5 py-1">.env.example</code>{" "}
            to
            <code className="ml-1 bg-white/10 px-1.5 py-1">.env.local</code>,
            add the project URL and public anon key.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed left-4 top-4 z-30 grid h-11 w-11 place-items-center bg-slate-950 text-white lg:hidden"
        aria-label="Open navigation"
      >
        <Menu />
      </button>
      {menuOpen && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 p-5 text-white transition-transform duration-300 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="SIIG" className="h-12" />
            <div>
              <p className="font-black">SIIG</p>
              <p className="text-xs text-slate-400">Administration</p>
            </div>
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            className="grid h-11 w-11 place-items-center lg:hidden"
            aria-label="Close navigation"
          >
            <X />
          </button>
        </div>
        <nav className="mt-10 space-y-2">
          {navigation.map(({ id, label, path }) => (
            <a
              key={id}
              href={path}
              onClick={() => setMenuOpen(false)}
              className={`flex min-h-12 w-full items-center gap-3 px-4 text-left font-bold transition ${
                activeNav === id
                  ? "bg-emerald-700 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="truncate px-2 text-xs text-slate-400">
            {session?.user?.email}
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-3 flex min-h-11 w-full items-center gap-3 px-2 font-bold text-slate-300 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="min-h-screen px-5 pb-12 pt-20 lg:ml-72 lg:px-10 lg:pt-10">
        {children}
      </main>
    </div>
  );
}
