import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export function useGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;
    supabase
      .from("gallery")
      .select("id, title, description, image_url, image_alt, display_order")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (active && !error) setImages(data || []);
      });

    return () => {
      active = false;
    };
  }, []);

  return { images };
}
