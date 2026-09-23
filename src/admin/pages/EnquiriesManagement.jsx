import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

function Status({ status }) {
  const styles = {
    new: "bg-amber-100 text-amber-800",
    contacted: "bg-blue-100 text-blue-800",
    closed: "bg-emerald-100 text-emerald-800",
  };
  return (
    <span
      className={`w-fit px-2.5 py-1 text-xs font-bold capitalize ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function EnquiriesManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await supabase.from("enquiries").update({ status }).eq("id", id);
    load();
  };

  const updateNotes = async (id, notes) => {
    await supabase.from("enquiries").update({ notes }).eq("id", id);
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading enquiries...</div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Enquiries</h1>
        <p className="mt-2 text-slate-600">Review and track every message submitted through the website.</p>
      </header>
      <div className="overflow-x-auto border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="p-4">Contact</th>
              <th className="p-4">Message</th>
              <th className="p-4">Received</th>
              <th className="p-4">Status</th>
              <th className="p-4">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="p-4">
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <a
                    className="text-emerald-800 hover:underline"
                    href={`mailto:${item.email}`}
                  >
                    {item.email}
                  </a>
                  <p className="text-slate-500">{item.phone}</p>
                  <p className="text-slate-500">{item.company}</p>
                </td>
                <td className="max-w-md whitespace-pre-wrap p-4 leading-6 text-slate-700">
                  {item.message}
                </td>
                <td className="p-4 text-slate-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="border border-slate-300 bg-white px-3 py-2"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="p-4">
                  <textarea
                    value={item.notes || ""}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    placeholder="Add internal notes..."
                    className="w-full border border-slate-300 bg-white px-3 py-2 text-xs resize-none"
                    rows="2"
                  />
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500">
                  No enquiries have arrived yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
