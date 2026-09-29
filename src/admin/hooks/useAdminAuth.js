import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export function useAdminAuth() {
  const [session, setSession] = useState(null);
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => setSession(nextSession)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setAuthorized(null);
      return;
    }

    supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        const hasAccess = !error && ["admin", "editor"].includes(data?.role);
        setAuthorized(hasAccess);
      });
  }, [session]);

  return { session, authorized, loading };
}
