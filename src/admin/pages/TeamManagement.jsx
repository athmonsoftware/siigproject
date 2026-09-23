import { useEffect, useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export default function TeamManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: "", role: "", description: "", image_url: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await supabase.from("team_members").select("*").order("display_order", { ascending: true });
    setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    load();
  }, []);

  const startEdit = (member = null) => {
    if (member) {
      setEditing(member.id);
      setFormData({ name: member.name, role: member.role, description: member.description, image_url: member.image_url || "" });
    } else {
      setEditing("new");
      setFormData({ name: "", role: "", description: "", image_url: "" });
    }
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      if (editing === "new") {
        const maxOrder = members.length > 0 ? Math.max(...members.map(m => m.display_order)) : 0;
        const { error } = await supabase.from("team_members").insert({
          ...formData,
          display_order: maxOrder + 1,
          is_active: true
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("team_members").update(formData).eq("id", editing);
        if (error) throw error;
      }
      setMessage("Saved successfully");
      setEditing(null);
      load();
    } catch (error) {
      setMessage(error.message);
    }
    setSaving(false);
  };

  const toggleActive = async (id, isActive) => {
    await supabase.from("team_members").update({ is_active: !isActive }).eq("id", id);
    load();
  };

  const deleteMember = async (id) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading team members...</div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Team Management</h1>
          <p className="mt-2 text-slate-600">Manage team members displayed on the website.</p>
        </div>
        <button
          onClick={() => startEdit()}
          className="inline-flex items-center gap-2 bg-emerald-800 px-5 py-2.5 font-bold text-white hover:bg-emerald-900"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </header>

      {editing && (
        <div className="mb-6 border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950 mb-4">
            {editing === "new" ? "Add Team Member" : "Edit Team Member"}
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Image URL (optional)</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="https://..."
              />
            </div>
          </div>
          {message && (
            <p className={`mt-4 p-3 text-sm font-semibold ${message.includes("Error") ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>
              {message}
            </p>
          )}
          <div className="mt-4 flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="bg-emerald-800 px-5 py-2 font-bold text-white hover:bg-emerald-900 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-5 py-2 font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Description</th>
              <th className="p-4">Order</th>
              <th className="p-4">Active</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="align-top">
                <td className="p-4 font-bold text-slate-900">{member.name}</td>
                <td className="p-4 text-slate-600">{member.role}</td>
                <td className="p-4 text-slate-600 max-w-xs truncate">{member.description}</td>
                <td className="p-4 text-slate-600">{member.display_order}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleActive(member.id, member.is_active)}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${member.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}
                  >
                    {member.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(member)}
                      className="text-emerald-800 hover:underline text-xs font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMember(member.id)}
                      className="text-red-700 hover:underline text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!members.length && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">
                  No team members found. Add your first member to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
