import type { MetadataRoute } from "next";

const routes = ["/", "/about", "/contact", "/dash", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://codepet.ca${route}`,
    changeFrequency: "monthly",
  }));
}
