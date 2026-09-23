import { useAdminAuth } from "../hooks/useAdminAuth";

export default function AdminSettings() {
  const { session } = useAdminAuth();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Settings</h1>
        <p className="mt-2 text-slate-600">Account and integration details for this workspace.</p>
      </header>
      <section className="max-w-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-black text-slate-950">Signed-in administrator</h2>
        <p className="mt-2 text-slate-600">{session?.user?.email}</p>
        <div className="mt-6 border-t border-slate-200 pt-6">
          <h3 className="font-black text-slate-950">Content delivery</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Published content is loaded from Supabase. The built-in website copy
            remains as a safe fallback if the service is unavailable.
          </p>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-6">
          <h3 className="font-black text-slate-950">Environment</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Supabase URL:</span>
              <span className="font-mono text-slate-900">
                {import.meta.env.VITE_SUPABASE_URL ? "✓ Configured" : "✗ Not configured"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Supabase Key:</span>
              <span className="font-mono text-slate-900">
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? "✓ Configured" : "✗ Not configured"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-6">
          <h3 className="font-black text-slate-950">Database Schema</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The following tables are managed by this admin panel:
          </p>
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            <li>• <code className="bg-slate-100 px-1 py-0.5">profiles</code> - User roles and permissions</li>
            <li>• <code className="bg-slate-100 px-1 py-0.5">site_content</code> - Website content sections</li>
            <li>• <code className="bg-slate-100 px-1 py-0.5">enquiries</code> - Contact form submissions</li>
            <li>• <code className="bg-slate-100 px-1 py-0.5">storage.site-media</code> - Image uploads</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
