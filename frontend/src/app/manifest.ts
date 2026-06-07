import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Golib Shop",
    short_name: "Golib Shop",
    description: "Премиальная одежда — Golib Shop",
    start_url: "/ru",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f3ef",
    theme_color: "#0b6b38",
    lang: "ru",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
