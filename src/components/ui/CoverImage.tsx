import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { artDataUri } from "@/lib/art";

/**
 * Image with a graceful, never-broken fallback:
 * shimmer skeleton -> (given url | deterministic arcane art).
 * Decorative by default; pass a name for alt text on meaningful images.
 */
export function CoverImage({
  src,
  seed,
  ratio = "portrait",
  alt,
  className,
  imgClassName,
}: {
  src?: string | null;
  seed: string;
  ratio?: "portrait" | "wide";
  alt?: string;
  className?: string;
  imgClassName?: string;
}) {
  const fallback = useMemo(() => artDataUri(seed, ratio), [seed, ratio]);
  const effectiveSrc = src && src.trim().length > 0 ? src : fallback;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // A cached image can complete before React attaches onLoad.
  useEffect(() => {
    const img = new Image();
    img.src = effectiveSrc;
    if (img.complete) setLoaded(true);
  }, [effectiveSrc]);

  const finalSrc = failed ? fallback : effectiveSrc;

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden bg-panel", className)}
      style={{ backgroundColor: "#14161d" }}
    >
      {!loaded && <div className="skeleton absolute inset-0" aria-hidden="true" />}
      <img
        src={finalSrc}
        alt={alt ?? ""}
        aria-hidden={alt ? undefined : true}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </div>
  );
}
