import { useEffect, useState } from "react";
import { defaultContent } from "../content/defaults";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export function useSiteContent() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;
    supabase
      .from("site_content")
      .select("section, content")
      .eq("is_published", true)
      .then(({ data, error }) => {
        if (!active || error || !data) return;
        const remoteContent = data.reduce(
          (acc, row) => ({ ...acc, [row.section]: row.content }),
          {},
        );
        setContent((current) => ({ ...current, ...remoteContent }));
      });

    return () => {
      active = false;
    };
  }, []);

  return content;
}

