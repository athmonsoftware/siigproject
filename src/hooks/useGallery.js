import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export function useGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;

    // Try the new schema first (with topics)
    supabase
      .from("gallery")
      .select(
        "id, image_url, image_alt, display_order, title, description, gallery_topics(id, title, description, display_order as topic_display_order)",
      )
      .eq("is_published", true)
      .order("topic_id", { ascending: true, nullsFirst: false })
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (active) {
          if (!error && data) {
            // New schema: use title/description from gallery table (copied from topic)
            // Fallback to topic title/description if gallery table is empty
            const flattenedImages = data.map((img) => ({
              id: img.id,
              image_url: img.image_url,
              image_alt: img.image_alt,
              title: img.title || img.gallery_topics?.title || "",
              description:
                img.description || img.gallery_topics?.description || "",
              display_order: img.display_order,
              topic_id: img.gallery_topics?.id,
            }));
            setImages(flattenedImages);
          } else {
            // Fallback to old schema (direct title/description on gallery)
            supabase
              .from("gallery")
              .select(
                "id, title, description, image_url, image_alt, display_order",
              )
              .eq("is_published", true)
              .order("display_order", { ascending: true })
              .order("created_at", { ascending: true })
              .then(({ data: oldData, error: oldError }) => {
                if (active && !oldError) {
                  setImages(oldData || []);
                }
              });
          }
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { images };
}
