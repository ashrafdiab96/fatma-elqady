// Generated from the optimised artwork exports in /public/work.
// Each entry records the source dimensions (for aspect ratios) and the exported widths.
const manifest = {
  "marzouk-cover": { w: 5323, h: 3370, widths: [640, 1280, 2000] },
  "marzouk-spread-1": { w: 5323, h: 3370, widths: [640, 1280, 2000] },
  "marzouk-spread-2": { w: 5323, h: 3370, widths: [640, 1280, 2000] },
  "marzouk-spread-3": { w: 5323, h: 3370, widths: [640, 1280, 2000] },
  "marzouk-spread-4": { w: 5323, h: 3370, widths: [640, 1280, 2000] },
  "marzouk-spread-5": { w: 5323, h: 3370, widths: [640, 1280, 2000] },
  "marzouk-cover-portrait": { w: 3508, h: 4961, widths: [640, 1280, 2000] },
  "marzouk-mockup-cover": { w: 3200, h: 2400, widths: [640, 1280, 2000] },
  "marzouk-mockup-portrait": { w: 3200, h: 2400, widths: [640, 1280, 2000] },
  "marzouk-mockup-open-1": { w: 3000, h: 2000, widths: [640, 1280, 2000] },
  "marzouk-mockup-open-2": { w: 2692, h: 1794, widths: [640, 1280, 2000] },
  "xpark-zero-x-astronaut": { w: 1200, h: 1200, widths: [640, 1200] },
  "xpark-zero-x-dress": { w: 1200, h: 1200, widths: [640, 1200] },
  "xpark-note-11": { w: 1200, h: 1200, widths: [640, 1200] },
  "xpark-note-10": { w: 1200, h: 1200, widths: [640, 1200] },
  "xpark-hot-11": { w: 1200, h: 1200, widths: [640, 1200] },
  "ad-banque-misr": { w: 1500, h: 1500, widths: [640, 1280, 1500] },
  "ad-almarai": { w: 1200, h: 1200, widths: [640, 1200] },
  "ad-jira-market": { w: 1600, h: 900, widths: [640, 1280, 1600] },
  "accessorize-title": { w: 1600, h: 900, widths: [640, 1280, 1600] },
  "accessorize-1": { w: 622, h: 622, widths: [622] },
  "accessorize-2": { w: 622, h: 622, widths: [622] },
  "accessorize-3": { w: 622, h: 622, widths: [622] },
  "accessorize-4": { w: 622, h: 622, widths: [622] },
  "accessorize-5": { w: 622, h: 622, widths: [622] },
  "mermaid": { w: 4232, h: 4134, widths: [640, 1280, 2000] },
  "mermaid-clean": { w: 4232, h: 4134, widths: [640, 1280, 2000] },
  "character-jam": { w: 2480, h: 3508, widths: [640, 1280, 2000] },
  "character-drink": { w: 2668, h: 1904, widths: [640, 1280, 2000] },
  "character-circle": { w: 2114, h: 2577, widths: [640, 1280, 2000] },
  "character-flare": { w: 789, h: 1064, widths: [640, 789] },
  "character-locs": { w: 609, h: 970, widths: [609] },
  "portrait-koi": { w: 3508, h: 2480, widths: [640, 1280, 2000] },
  "portrait-chess": { w: 897, h: 1058, widths: [640, 897] },
  "portrait-flowers": { w: 752, h: 842, widths: [640, 752] },
  "landscape-marsh": { w: 2480, h: 3508, widths: [640, 1280, 2000] },
  "landscape-forest": { w: 1920, h: 1080, widths: [640, 1280, 1920] },
  "landscape-hills": { w: 1600, h: 900, widths: [640, 1280, 1600] },
  "landscape-dunes": { w: 3508, h: 2480, widths: [640, 1280, 2000] },
  "narrative-bedroom": { w: 1343, h: 778, widths: [640, 1280] },
  "narrative-purple": { w: 1118, h: 629, widths: [640, 1118] },
  "narrative-mexico": { w: 888, h: 681, widths: [640, 888] },
  "bg-temple": { w: 1920, h: 1080, widths: [640, 1280, 1920] },
  "bg-room": { w: 1711, h: 726, widths: [640, 1280, 1711] },
  "bg-interior": { w: 1920, h: 1080, widths: [640, 1280, 1920] },
  "bg-lighthouse": { w: 1280, h: 904, widths: [640, 1280] },
  "story-spooky": { w: 1600, h: 900, widths: [640, 1280, 1600] },
  "balcony": { w: 1600, h: 900, widths: [640, 1280, 1600] },
  "music-textured": { w: 3919, h: 2205, widths: [640, 1280, 2000] },
  "music-flat": { w: 1600, h: 900, widths: [640, 1280, 1600] },
  "scene-beach": { w: 3508, h: 2480, widths: [640, 1280, 2000] },
  "scene-pixel": { w: 8001, h: 4500, widths: [640, 1280, 2000] },
} as const

export type MediaKey = keyof typeof manifest

export type Media = { key: MediaKey; src: string; srcSet: string; width: number; height: number; ratio: number }

const BASE_PATH =
  process.env.NODE_ENV === "production"
    ? "/fatma-elqady"
    : "";

export function media(key: MediaKey): Media {
  const { w, h, widths } = manifest[key];

  const srcSet = widths
    .map(
      (width) =>
        `${BASE_PATH}/work/${key}-${width}.webp ${width}w`
    )
    .join(", ");

  const mid =
    widths.find((width) => width >= 1280) ??
    widths[widths.length - 1];

  return {
    key,
    src: `${BASE_PATH}/work/${key}-${mid}.webp`,
    srcSet,
    width: w,
    height: h,
    ratio: w / h,
  };
}

export function thumb(key: MediaKey) {
  return `${BASE_PATH}/work/${key}-${manifest[key].widths[0]}.webp`;
}