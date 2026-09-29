import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let active = true;
    supabase
      .from("articles")
      .select(
        "id, title, slug, excerpt, content, cover_image, cover_image_alt, created_at"
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (active) {
          if (!error) setArticles(data || []);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { articles, loading };
}
