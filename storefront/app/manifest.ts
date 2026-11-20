import type { MetadataRoute } from "next";

// The app's name, colours and icons. Next.js serves it at /manifest.webmanifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JAEL Enterprise",
    short_name: "JAEL",
    description: "Stationery, office equipment, electronics and clothing",
    start_url: "/",
    scope: "/",
    display: "standalone", // opens without the browser's address bar
    orientation: "portrait",
    background_color: "#F8FAFC",
    theme_color: "#0A2540",
    categories: ["shopping"],
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // Long-press the app icon on Android for these shortcuts
    shortcuts: [
      { name: "Shop", url: "/shop" },
      { name: "My Cart", url: "/cart" },
    ],
  };
}
