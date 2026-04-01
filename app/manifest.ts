import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sloka — Student Results",
    short_name: "Sloka Results",
    description:
      "View student report cards for Sloka — The Global School. Formative and summative results.",
    start_url: "/results",
    scope: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#004d40",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/brand/sloka-logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/sloka-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
