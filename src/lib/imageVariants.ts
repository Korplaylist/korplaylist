const DEFAULT_WIDTHS = [360, 480, 640, 768, 960, 1200];

function getImageParts(src: string) {
  const match = src.match(/^\/images\/([^/]+)\/([^/.]+)\.(?:jpg|jpeg|png)$/i);
  if (!match) return null;
  return {
    folder: match[1],
    name: match[2]
  };
}

export function getWebpSrc(src: string, width: number) {
  const parts = getImageParts(src);
  if (!parts) return src;
  return `/images/optimized/${parts.folder}/${parts.name}-${width}.webp`;
}

export function getWebpSrcSet(src: string, widths = DEFAULT_WIDTHS) {
  if (!getImageParts(src)) return undefined;
  return widths.map((width) => `${getWebpSrc(src, width)} ${width}w`).join(", ");
}
