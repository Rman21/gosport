import type { MetadataRoute } from "next";
import { facilities } from "@/demo-data";
import { locales } from "@/i18n";
import { absoluteUrl } from "@/site-config";

const publicLocalePaths = ["", "verification"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls = new Set<string>();

  urls.add(absoluteUrl("/"));

  for (const locale of locales) {
    for (const path of publicLocalePaths) {
      urls.add(absoluteUrl(path ? `/${locale}/${path}` : `/${locale}`));
    }

    for (const facility of facilities) {
      urls.add(absoluteUrl(`/${locale}/facilities/${facility.id}`));
    }
  }

  return Array.from(urls).map((url) => ({
    changeFrequency: url.includes("/facilities/") ? "weekly" : "daily",
    lastModified: now,
    priority: url === absoluteUrl("/") ? 1 : url.includes("/facilities/") ? 0.7 : 0.8,
    url,
  }));
}
