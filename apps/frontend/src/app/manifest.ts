import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IntellMeet",
    short_name: "IntellMeet",
    description:
      "A meeting workspace for live collaboration, AI summaries, transcripts, and action items.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0f19",
    theme_color: "#0b0f19",
    icons: [
      {
        src: "/Logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}