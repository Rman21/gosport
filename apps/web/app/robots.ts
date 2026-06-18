import type { MetadataRoute } from "next";
import { siteOrigin } from "@/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: ["/api/", "/ru/admin/", "/he/admin/", "/en/admin/"],
      userAgent: "*",
    },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
