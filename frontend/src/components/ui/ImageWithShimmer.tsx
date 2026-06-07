"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { Shimmer } from "./Shimmer";
import { cn } from "@/lib/utils";

export function ImageWithShimmer({
  className,
  containerClassName,
  fallbackSrc,
  src,
  onError,
  ...props
}: ImageProps & { containerClassName?: string; fallbackSrc?: string }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setFailed(false);
  }, [src]);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setLoaded(false);
      return;
    }
    setFailed(true);
    onError?.(event);
  };

  return (
    <span className={cn("relative block overflow-hidden bg-neutral-100", containerClassName)}>
      {!loaded && !failed && <Shimmer className="absolute inset-0 rounded-none" />}
      {failed ? (
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-[10px] text-neutral-400",
            className
          )}
          aria-hidden
        >
          Golib
        </span>
      ) : (
        <Image
          {...props}
          alt={props.alt ?? ""}
          src={currentSrc}
          className={cn(
            className,
            "transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
          onError={handleError}
        />
      )}
    </span>
  );
}
