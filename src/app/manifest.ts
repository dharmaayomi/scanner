import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Warehouse Scanner",
    short_name: "Scanner",
    description: "Mobile warehouse inventory scanner",
    start_url: "/",
    display: "standalone",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
