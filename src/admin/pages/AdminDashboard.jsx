import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { defaultContent } from "../../content/defaults";

function Metric({ label, value, note }) {
  return (
    <article className="border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{note}</p>
    </article>
  );
}

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

function ArticleStatusBadge({ isPublished }) {
  return (
    <span
      className={`w-fit px-2.5 py-1 text-xs font-bold capitalize ${
        isPublished
          ? "bg-emerald-100 text-emerald-800"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [articles, setArticles] = useState([]);
  const [contentRows, setContentRows] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [
      { data: enquiryData },
      { data: contentData },
      { data: articleData },
    ] = await Promise.all([
      supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("site_content").select("*"),
      supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    setEnquiries(enquiryData || []);
    setArticles(articleData || []);

    const rows = Object.fromEntries(
      (contentData || []).map((row) => [row.section, row])
    );
    for (const [section, content] of Object.entries(defaultContent))
      if (!rows[section])
        rows[section] = { section, content, is_published: true };
    setContentRows(rows);
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  const newCount = enquiries.filter((item) => item.status === "new").length;
  const publishedArticlesCount = articles.filter(
    (item) => item.is_published
  ).length;
  const publishedSections = Object.values(contentRows).filter(
    (item) => item.is_published
  ).length;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          A clear view of website activity, articles, and content status.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total enquiries"
          value={enquiries.length}
          note="All website submissions"
        />
        <Metric
          label="New enquiries"
          value={newCount}
          note="Waiting for a response"
        />
        <Metric
          label="Total articles"
          value={articles.length}
          note={`${publishedArticlesCount} published live`}
        />
        <Metric
          label="Published sections"
          value={publishedSections}
          note={`of ${Object.keys(defaultContent).length} managed sections`}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Recent Enquiries Section */}
        <section className="border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">
            Recent enquiries
          </h2>
          <div className="mt-5 divide-y divide-slate-100">
            {enquiries.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    {item.email} · {item.company || "Individual"}
                  </p>
                </div>
                <Status status={item.status} />
              </div>
            ))}
            {!enquiries.length && (
              <p className="py-8 text-center text-slate-500">
                No enquiries have arrived yet.
              </p>
            )}
          </div>
        </section>

        {/* Recent Articles Section */}
        <section className="border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Recent articles</h2>
          <div className="mt-5 divide-y divide-slate-100">
            {articles.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 pr-4">
                  <p className="truncate font-bold text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    /{item.slug}
                  </p>
                </div>
                <ArticleStatusBadge isPublished={item.is_published} />
              </div>
            ))}
            {!articles.length && (
              <p className="py-8 text-center text-slate-500">
                No articles created yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
