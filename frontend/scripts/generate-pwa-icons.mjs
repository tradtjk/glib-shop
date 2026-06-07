import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source = path.join(root, "src/stores/main.jpg");
const outDir = path.join(root, "public/icons");

const sizes = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

await mkdir(outDir, { recursive: true });
const input = await readFile(source);

for (const { name, size } of sizes) {
  const buffer = await sharp(input)
    .resize(size, size, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
  await writeFile(path.join(outDir, name), buffer);
  console.log(`wrote ${name} (${size}x${size})`);
}
