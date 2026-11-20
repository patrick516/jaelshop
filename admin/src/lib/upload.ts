import { api } from "./api";

const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIDE = 1600; // pixels, the longest side

// Shrinks a big phone photo and saves it as a JPEG, so the shop loads fast on slow networks.
// A GIF is kept as it is (to keep its animation). If anything fails, the original file is used
async function shrink(file: File): Promise<File> {
  if (file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff"; // a transparent PNG would otherwise turn black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file; // it was already small
    return new File([blob], `${file.name.replace(/\.\w+$/, "")}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

// Uploads one picture to the backend and returns its web address
export async function uploadPicture(file: File): Promise<string> {
  if (!TYPES.includes(file.type)) throw new Error("Please choose a JPG, PNG, WebP or GIF picture");
  if (file.size > 25 * 1024 * 1024) throw new Error("That picture is too big (25 MB at most)");
  const form = new FormData();
  form.append("file", await shrink(file));
  const res = await api.post<{ url: string }>("/uploads", form);
  return res.data.url;
}
