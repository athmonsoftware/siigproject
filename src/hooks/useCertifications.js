import { useState, useEffect } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const defaultCertifications = [
  {
    name: "Ghana Standards Authority",
    description: "Certified safety training provider",
  },
  {
    name: "Occupational Safety & Health",
    description: "OSHA compliant protocols",
  },
  {
    name: "First Aid Certification",
    description: "Red Cross certified training",
  },
  { name: "Fire Safety Compliance", description: "GNFS approved procedures" },
];

export function useCertifications() {
  const [certifications, setCertifications] = useState(defaultCertifications);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    setLoading(true);
    supabase
      .from("certifications")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setCertifications(data);
        }
        setLoading(false);
      });
  }, []);

  return { certifications, loading };
}
