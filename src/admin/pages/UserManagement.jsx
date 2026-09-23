import { useEffect, useState } from "react";
import { ShieldCheck, UserPlus, Shield, Edit } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

function RoleBadge({ role }) {
  const styles = {
    admin: "bg-purple-100 text-purple-800",
    editor: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold capitalize ${
        styles[role] || "bg-slate-100 text-slate-700"
      }`}
    >
      {role === "admin" && <Shield className="h-3 w-3" />}
      {role === "editor" && <Edit className="h-3 w-3" />}
      {role}
    </span>
  );
}

export default function UserManagement() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [message, setMessage] = useState("");

  const loadProfiles = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, role, created_at")
      .order("created_at", { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    loadProfiles();
  }, []);

  const updateRole = async (id, role) => {
    await supabase.from("profiles").update({ role }).eq("id", id);
    loadProfiles();
  };

  const inviteUser = async (e) => {
    e.preventDefault();
    setMessage("");
    
    // First check if user exists in auth
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingUser = users.find(u => u.email === inviteEmail);
    
    if (existingUser) {
      // User exists, just update their profile
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: existingUser.id, full_name: inviteEmail.split("@")[0], role: inviteRole }, { onConflict: "id" });
      
      if (error) {
        setMessage("Error updating user role: " + error.message);
      } else {
        setMessage("User role updated successfully.");
        loadProfiles();
        setShowInvite(false);
        setInviteEmail("");
      }
    } else {
      // User doesn't exist, send invite
      const { error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail, {
        data: { role: inviteRole }
      });
      
      if (error) {
        setMessage("Error inviting user: " + error.message);
      } else {
        setMessage("Invitation sent successfully. User will need to sign up to access the admin panel.");
        setShowInvite(false);
        setInviteEmail("");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">User Management</h1>
          <p className="mt-2 text-slate-600">Manage admin and editor access to the SIIG website.</p>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="inline-flex items-center gap-2 bg-emerald-800 px-5 py-2.5 font-bold text-white hover:bg-emerald-900"
        >
          <UserPlus className="h-4 w-4" />
          Invite User
        </button>
      </header>

      {showInvite && (
        <div className="mb-6 border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950 mb-4">Invite New User</h2>
          <form onSubmit={inviteUser} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-emerald-800 px-5 py-2 font-bold text-white hover:bg-emerald-900"
            >
              Send Invite
            </button>
            <button
              type="button"
              onClick={() => setShowInvite(false)}
              className="px-5 py-2 font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
          </form>
          {message && (
            <p className={`mt-3 p-3 text-sm font-semibold ${message.includes("Error") ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>
              {message}
            </p>
          )}
        </div>
      )}

      <div className="overflow-x-auto border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Created</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {profiles.map((profile) => (
              <tr key={profile.id} className="align-top">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {profile.full_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{profile.full_name || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{profile.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <RoleBadge role={profile.role} />
                </td>
                <td className="p-4 text-slate-500">
                  {new Date(profile.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <select
                    value={profile.role}
                    onChange={(e) => updateRole(profile.id, e.target.value)}
                    className="border border-slate-300 bg-white px-3 py-2 text-xs"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
            {!profiles.length && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-slate-500">
                  No users found. Invite your first admin to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-black text-slate-950 mb-3 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Role Permissions
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-purple-50 p-4">
            <h4 className="font-bold text-purple-900 mb-2">Admin</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Full access to all features</li>
              <li>• Manage user roles</li>
              <li>• Delete content and media</li>
              <li>• View all enquiries</li>
            </ul>
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="font-bold text-blue-900 mb-2">Editor</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Edit website content</li>
              <li>• Upload media</li>
              <li>• View and manage enquiries</li>
              <li>• Cannot manage users</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
