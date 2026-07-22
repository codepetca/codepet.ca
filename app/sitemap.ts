import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const routes = ["/", "/about", "/contact", "/dash", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly",
  }));
}
