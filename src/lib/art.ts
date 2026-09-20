/**
 * Deterministic generative artwork for missing images.
 * Same seed always produces the same arcane gradient + constellation,
 * so every series/character gets stable "cover art" without any backend.
 * Palettes stay inside the console's crimson + amethyst spectrum.
 */

export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type ArtPalette = { from: string; to: string };

const PALETTES: ArtPalette[] = [
  { from: "#8B1126", to: "#B31B34" }, // deep crimson -> blood
  { from: "#6D28D9", to: "#A78BFA" }, // deep violet -> amethyst
  { from: "#B31B34", to: "#A78BFA" }, // blood -> amethyst
  { from: "#7C5CCF", to: "#CDB9FA" }, // royal purple -> pale amethyst
  { from: "#5B0E1D", to: "#8B1126" }, // near-black crimson depth
  { from: "#A78BFA", to: "#E8DFC8" }, // amethyst -> parchment
  { from: "#8B1126", to: "#7C5CCF" }, // crimson -> violet
  { from: "#3F2E6E", to: "#B31B34" }, // midnight violet -> blood
];

export function paletteFor(seed: string): ArtPalette {
  return PALETTES[hashSeed(seed) % PALETTES.length];
}

/** Build an encoded data-URI SVG with an arcane gradient, sigil and constellation. */
export function artDataUri(seed: string, ratio: "portrait" | "wide" = "portrait"): string {
  const rand = mulberry32(hashSeed(seed));
  const palette = paletteFor(seed);
  const w = ratio === "portrait" ? 400 : 800;
  const h = ratio === "portrait" ? 560 : 450;

  // Constellation stars
  const stars = Array.from({ length: 9 }, () => ({
    x: 30 + rand() * (w - 60),
    y: 30 + rand() * (h - 60),
    r: 1 + rand() * 2.4,
  }));

  // Connect consecutive stars with hairlines
  const lines = stars
    .slice(0, 7)
    .map((s, i) => {
      const n = stars[i + 1];
      if (!n) return "";
      return `<line x1="${s.x.toFixed(1)}" y1="${s.y.toFixed(1)}" x2="${n.x.toFixed(1)}" y2="${n.y.toFixed(1)}" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
    })
    .join("");

  const circles = stars
    .map(
      (s) =>
        `<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="${s.r.toFixed(1)}" fill="rgba(255,255,255,0.75)"/>`,
    )
    .join("");

  // Rune ring position
  const rx = w * (0.3 + rand() * 0.4);
  const ry = h * (0.3 + rand() * 0.4);
  const rr = Math.min(w, h) * (0.18 + rand() * 0.1);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.from}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${palette.to}" stop-opacity="0.55"/>
    </linearGradient>
    <radialGradient id="v" cx="0.5" cy="0.35" r="0.9">
      <stop offset="0" stop-color="rgba(0,0,0,0)"/>
      <stop offset="1" stop-color="rgba(8,9,13,0.9)"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#v)"/>
  ${lines}
  ${circles}
  <circle cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" r="${rr.toFixed(1)}" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
  <circle cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" r="${(rr * 0.62).toFixed(1)}" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1" stroke-dasharray="4 6"/>
  <path d="M${rx} ${(ry - rr * 0.45).toFixed(1)} ${(rx + rr * 0.4).toFixed(1)} ${(ry + rr * 0.3).toFixed(1)} ${(rx - rr * 0.4).toFixed(1)} ${(ry + rr * 0.3).toFixed(1)} Z" fill="rgba(255,255,255,0.14)"/>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
