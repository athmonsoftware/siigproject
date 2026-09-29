import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

function Status({ status, onChange }) {
  const styles = {
    new: "bg-amber-100 text-amber-800 border-amber-300 focus:border-amber-500",
    contacted:
      "bg-blue-100 text-blue-800 border-blue-300 focus:border-blue-500",
    closed:
      "bg-emerald-100 text-emerald-800 border-emerald-300 focus:border-emerald-500",
  };

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-full px-3 py-1 text-xs font-bold capitalize border cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        styles[status] || "bg-slate-100 text-slate-700 border-slate-300"
      }`}
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="closed">Closed</option>
    </select>
  );
}

export default function EnquiriesManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filtering, and Sorting States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'name'

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

  // Derive unique options for the service filter dropdown dynamically from loaded data
  const uniqueServices = Array.from(
    new Set(items.map((item) => item.interested_in).filter(Boolean))
  );

  // Search, filter, and sort items based on user input
  const filteredItems = items
    .filter((item) => {
      // Search matching across multiple fields (case-insensitive)
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query) ||
        item.company?.toLowerCase().includes(query) ||
        item.interested_in?.toLowerCase().includes(query) ||
        item.message?.toLowerCase().includes(query);

      const matchesService =
        filterService === "all" || item.interested_in === filterService;
      const matchesStatus =
        filterStatus === "all" || item.status === filterStatus;

      return matchesSearch && matchesService && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading enquiries...</div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Enquiries
        </h1>
        <p className="mt-2 text-slate-600">
          Review and track every message submitted through the website.
        </p>
      </header>

      {/* Search, Filter, and Sort Toolbar */}
      <div className="mb-6 flex flex-wrap items-end gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Input */}
        <div className="flex flex-col gap-1 flex-1 min-w-[240px]">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Search Enquiries
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, company, message..."
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-green-600 focus:outline-none"
          />
        </div>

        {/* Filter by Service */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Service
          </label>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-green-600 focus:outline-none"
          >
            <option value="all">All Services</option>
            {uniqueServices.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-green-600 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-green-600 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="p-4">Contact</th>
              <th className="p-4">Interested In</th>
              <th className="p-4">Message</th>
              <th className="p-4">Received</th>
              <th className="p-4">Status</th>
              <th className="p-4">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
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
                <td className="p-4">
                  <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                    {item.interested_in || "General Enquiry"}
                  </span>
                </td>
                <td className="max-w-xs whitespace-pre-wrap p-4 leading-6 text-slate-700">
                  {item.message}
                </td>
                <td className="p-4 text-slate-500 whitespace-nowrap">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Status
                    status={item.status}
                    onChange={(newStatus) => updateStatus(item.id, newStatus)}
                  />
                </td>
                <td className="p-4">
                  <textarea
                    value={item.notes || ""}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    placeholder="Add internal notes..."
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs resize-none"
                    rows="2"
                  />
                </td>
              </tr>
            ))}
            {!filteredItems.length && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">
                  No matching enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
