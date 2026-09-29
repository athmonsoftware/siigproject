import { useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

const inputClass =
  "mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

export default function AdminLogin({ onAuthenticated }) {
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
    setLoading(true);
    setMessage("");
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
