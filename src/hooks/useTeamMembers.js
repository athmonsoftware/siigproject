import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export function useTeamMembers() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;
    supabase
      .from("team_members")
      .select("id, full_name, position, biography, image_url, image_alt, display_order")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (active && !error) setMembers(data || []);
      });

    return () => {
      active = false;
    };
  }, []);

  return members;
}
