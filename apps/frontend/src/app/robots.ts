import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/auth",
          "/dashboard",
          "/workspace",
          "/meetings",
          "/analytics",
          "/settings",
          "/profile",
          "/onboarding",
          "/api",
        ],
      },
    ],
    sitemap: "/sitemap.xml",
  };
}