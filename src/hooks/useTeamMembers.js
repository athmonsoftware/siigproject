import { useState, useEffect } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const defaultTeamMembers = [
  {
    name: "Kwame Mensah",
    role: "Chief Executive Officer",
    description: "20+ years in occupational safety and industrial management",
  },
  {
    name: "Ama Ofori",
    role: "Head of Training",
    description: "Certified safety trainer with expertise in emergency response",
  },
  {
    name: "Kofi Asante",
    role: "Compliance Director",
    description: "Specialist in Ghanaian labor laws and international safety standards",
  },
  {
    name: "Efia Boateng",
    role: "Operations Manager",
    description: "Expert in implementing safety protocols across various industries",
  },
];

export function useTeamMembers() {
  const [members, setMembers] = useState(defaultTeamMembers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    setLoading(true);
    supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setMembers(data);
        }
        setLoading(false);
      });
  }, []);

  return { members, loading };
}
