import { Routes, Route, Navigate } from "react-router-dom";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { useAdminAuth } from "./hooks/useAdminAuth";
import AdminLayout from "./components/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import PasswordReset from "./pages/PasswordReset";
import AdminDashboard from "./pages/AdminDashboard";
import ContentManagement from "./pages/ContentManagement";
import EnquiriesManagement from "./pages/EnquiriesManagement";
import MediaLibrary from "./pages/MediaLibrary";
import TeamManagement from "./pages/TeamManagement";
import CertificationsManagement from "./pages/CertificationsManagement";
import UserManagement from "./pages/UserManagement";
import AdminSettings from "./pages/AdminSettings";

function ProtectedRoute({ children }) {
  const { session, authorized, loading } = useAdminAuth();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
        <RefreshCw className="h-7 w-7 animate-spin" aria-label="Loading" />
      </main>
    );
  }

  if (!session) {
    return <AdminLogin onAuthenticated={() => window.location.reload()} />;
  }

  if (authorized === null) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
        <RefreshCw
          className="h-7 w-7 animate-spin"
          aria-label="Checking access"
        />
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-white">
        <section className="max-w-lg border border-white/15 bg-white/5 p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-amber-400" />
          <h1 className="mt-5 text-3xl font-black">Access awaiting approval</h1>
          <p className="mt-3 leading-7 text-slate-300">
            This account is authenticated but has not been assigned an SIIG
            administrator or editor role.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-7 min-h-11 bg-white px-5 font-bold text-slate-950"
          >
            Return to website
          </button>
        </section>
      </main>
    );
  }

  return children;
}

export default function AdminRouter() {
  return (
    <Routes>
      {/* Relative to /admin */}
      <Route path="reset-password" element={<PasswordReset />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function AdminRoutes() {
  const { session } = useAdminAuth();
  const userId = session?.user?.id;

  return (
    <AdminLayout session={session}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="content" element={<ContentManagement userId={userId} />} />
        <Route path="enquiries" element={<EnquiriesManagement />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="team" element={<TeamManagement />} />
        <Route path="certifications" element={<CertificationsManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </AdminLayout>
  );
}
