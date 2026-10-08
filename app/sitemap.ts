import type { MetadataRoute } from "next";
import { supabase } from "../lib/supabase";

const siteUrl = "https://nevues.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: events } = await supabase
    .from("events")
    .select("slug, date, created_at")
    .order("date", { ascending: false });

  return [
    { url: siteUrl },
    ...(events ?? []).map((event) => ({
      url: `${siteUrl}/understand/${event.slug}`,
      ...(event.date || event.created_at
        ? { lastModified: event.date ?? event.created_at }
        : {}),
    })),
  ];
}
