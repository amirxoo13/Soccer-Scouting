import { decode, encode } from "jpeg-js";

type JpegFrame = { bytes: Buffer; mime: string; source: string; width: number; height: number };
type Raster = { width: number; height: number; data: Uint8Array };

function toRaster(frame: JpegFrame): Raster | null {
  try {
    if (!frame.mime.includes("jpeg") && !frame.mime.includes("jpg")) return null;
    const img = decode(frame.bytes, { useTArray: true, maxMemoryUsageInMB: 40, maxResolutionInMP: 12 });
    return { width: img.width, height: img.height, data: img.data };
  } catch {
    return null;
  }
}

function pixel(r: Raster, x: number, y: number) {
  const i = (Math.max(0, Math.min(r.height - 1, y)) * r.width + Math.max(0, Math.min(r.width - 1, x))) * 4;
  return { r: r.data[i], g: r.data[i + 1], b: r.data[i + 2] };
}

export function isGrass(r: number, g: number, b: number) {
  return g > 55 && g > r + 12 && g > b + 8 && r < 170;
}

export function grassRatio(frame: JpegFrame) {
  const img = toRaster(frame);
  if (!img) return 0;
  const step = Math.max(4, Math.floor(Math.min(img.width, img.height) / 80));
  let grass = 0;
  let n = 0;
  for (let y = 0; y < img.height; y += step) {
    for (let x = 0; x < img.width; x += step) {
      const p = pixel(img, x, y);
      n += 1;
      if (isGrass(p.r, p.g, p.b)) grass += 1;
    }
  }
  return n ? grass / n : 0;
}

export function shirtColor(frame: JpegFrame, box: { x: number; y: number; w: number; h: number }) {
  const img = toRaster(frame);
  if (!img) return { r: 80, g: 80, b: 80, lum: 80 };
  const x0 = Math.max(0, Math.round(box.x + box.w * 0.25));
  const x1 = Math.min(img.width - 1, Math.round(box.x + box.w * 0.75));
  const y0 = Math.max(0, Math.round(box.y + box.h * 0.12));
  const y1 = Math.min(img.height - 1, Math.round(box.y + box.h * 0.48));
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  const step = 2;
  for (let y = y0; y <= y1; y += step) {
    for (let x = x0; x <= x1; x += step) {
      const p = pixel(img, x, y);
      if (isGrass(p.r, p.g, p.b)) continue;
      r += p.r;
      g += p.g;
      b += p.b;
      n += 1;
    }
  }
  if (!n) return { r: 80, g: 80, b: 80, lum: 80 };
  r = Math.round(r / n);
  g = Math.round(g / n);
  b = Math.round(b / n);
  return { r, g, b, lum: Math.round(0.3 * r + 0.59 * g + 0.11 * b) };
}

export function cropSpriteCell(frame: JpegFrame, cols: number, rows: number, index: number): JpegFrame | null {
  const img = toRaster(frame);
  if (!img) return null;
  const cw = Math.floor(img.width / cols);
  const ch = Math.floor(img.height / rows);
  if (cw < 80 || ch < 45) return null;
  const col = index % cols;
  const row = Math.floor(index / cols);
  if (row >= rows) return null;
  const data = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++) {
    const src = ((row * ch + y) * img.width + col * cw) * 4;
    const dst = y * cw * 4;
    data.set(img.data.subarray(src, src + cw * 4), dst);
  }
  const out = encode({ data, width: cw, height: ch }, 78);
  return { bytes: Buffer.from(out.data), mime: "image/jpeg", source: `${frame.source}#${index}`, width: cw, height: ch };
}

export function rgbHex(c: { r: number; g: number; b: number }) {
  return `#${[c.r, c.g, c.b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

export function colorDist(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) {
  return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
}
