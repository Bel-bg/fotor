"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { FotorImage } from "@/types/graphql";

export function ImageCard({ image }: { image: FotorImage }) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!cardRef.current) return;
      // Petit fade + translation vers le haut à l'apparition de la carte
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    },
    { scope: cardRef }
  );

  const aspectRatio =
    image.width && image.height ? image.width / image.height : 1;

  return (
    <div
      ref={cardRef}
      className="mb-4 overflow-hidden rounded-2xl bg-neutral-100 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative w-full" style={{ aspectRatio }}>
        <Image
          src={image.url}
          alt={image.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium text-neutral-800">
          {image.title}
        </p>
        <p className="text-xs text-neutral-500">{image.category.name}</p>
      </div>
    </div>
  );
}
