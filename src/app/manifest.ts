import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Warehouse Scanner",
    short_name: "Scanner",
    description: "Mobile warehouse inventory scanner",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
