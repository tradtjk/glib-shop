import { readFileSync } from "fs";

const text = readFileSync("src/lib/product-images.ts", "utf8");
const ids = [...text.matchAll(/"(photo-[^"]+)"/g)].map((m) => m[1]);
const unique = [...new Set(ids)];

const bad = [];
for (const id of unique) {
  const u = `https://images.unsplash.com/${id}?w=100`;
  try {
    const r = await fetch(u, { method: "HEAD" });
    if (r.status !== 200) bad.push({ id, status: r.status });
    else console.log("OK", id);
  } catch {
    bad.push({ id, status: "ERR" });
  }
}
if (bad.length) {
  console.log("\nBROKEN:");
  console.log(JSON.stringify(bad, null, 2));
  process.exit(1);
}
