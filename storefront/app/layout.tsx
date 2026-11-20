import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/store/cart";
import { AuthProvider } from "@/store/auth";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { getSettings } from "@/services/catalog";

// The font. variable makes it available to Tailwind as --font-inter (see tailwind.config.js)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Shown in the browser tab and in search results
export const metadata: Metadata = {
  title: "JAEL Enterprise",
  description: "Stationery, office equipment, electronics and clothing",
};

// async so it can ask the backend for the owner's WhatsApp number once, for every page
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // If the backend is down the shop still opens, just without the WhatsApp buttons
  const whatsappNumber = await getSettings().then((s) => s.whatsappNumber).catch(() => "");

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
        <CartProvider>
          <Header whatsappNumber={whatsappNumber} />
          {/* pb-24 leaves room above the bottom navigation on phones */}
          <main className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-4 md:pb-8">{children}</main>
          <BottomNav whatsappNumber={whatsappNumber} />
        </CartProvider>
        </AuthProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
