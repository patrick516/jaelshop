import { ImageResponse } from "next/og";
import { iconImage } from "@/lib/appIcon";

// /icons/192, /icons/512, /icons/180 (iPhone) and /icons/maskable-512. The second value is "maskable"
const ICONS = { "192": [192, false], "512": [512, false], "180": [180, false], "maskable-512": [512, true] } as const;

export const dynamic = "force-static";
export const dynamicParams = false; // any other name is a 404
export const generateStaticParams = () => Object.keys(ICONS).map((name) => ({ name }));

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params; // in Next.js 16 the address parts arrive as a Promise
  const [size, maskable] = ICONS[name as keyof typeof ICONS];
  return new ImageResponse(iconImage(size, maskable), { width: size, height: size });
}
