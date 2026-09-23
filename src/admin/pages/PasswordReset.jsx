import { useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

const inputClass =
  "mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

export default function PasswordReset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (password.length < 12) {
      setMessage("Use at least 12 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setMessage(error.message);
    else {
      setMessage("Password updated. Redirecting to the admin panel…");
      window.setTimeout(() => {
        window.location.href = "/admin";
      }, 900);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">SIIG administration</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Choose a new password</h1>
        <p className="mt-2 text-slate-600">Use at least 12 characters and keep it private.</p>
        <label className="mt-7 block text-sm font-bold text-slate-700">New password
          <input className={inputClass} type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label className="mt-5 block text-sm font-bold text-slate-700">Confirm password
          <input className={inputClass} type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </label>
        {message && <p role="status" className="mt-4 bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
        <button disabled={loading} className="mt-6 min-h-12 w-full bg-emerald-800 px-5 font-bold text-white hover:bg-emerald-900 disabled:opacity-60">
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </main>
  );
}
