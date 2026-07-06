import Image from "next/image";

import { generarImagenPlaceholder } from "@/lib/generate-entity-image";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
} as const;

interface EntityImageProps {
  src: string | null | undefined;
  alt: string;
  size?: keyof typeof sizeMap;
  className?: string;
}

export function EntityImage({ src, alt, size = "md", className }: EntityImageProps) {
  const resolvedSrc = src?.trim() ? src : generarImagenPlaceholder(alt);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg bg-muted",
        sizeMap[size],
        className,
      )}
    >
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        unoptimized
        className="object-cover"
        sizes={size === "sm" ? "40px" : size === "md" ? "56px" : "80px"}
      />
    </div>
  );
}
