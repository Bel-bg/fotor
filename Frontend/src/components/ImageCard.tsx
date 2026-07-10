"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { FotorImage } from "@/types/graphql";
import { Bookmark } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ImageCardProps {
  image: FotorImage;
  onClick?: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!cardRef.current || prefersReducedMotion) return;
      // Animation d'apparition (scroll)
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    },
    { scope: cardRef, dependencies: [prefersReducedMotion] }
  );

  const handleMouseEnter = () => {
    if (prefersReducedMotion || !imgRef.current || !btnRef.current) return;
    // Animation hover
    gsap.to(imgRef.current, {
      scale: 1.03,
      duration: 0.25,
      ease: "power2.out",
    });
    // Overlay degradé
    gsap.fromTo(
      ".overlay",
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "power2.out" }
    );
    // Bouton "Enregistrer"
    gsap.fromTo(
      btnRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" }
    );
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion || !imgRef.current || !btnRef.current) return;
    gsap.to(imgRef.current, {
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.to([".overlay", btnRef.current], {
      opacity: 0,
      duration: 0.2,
    });
  };

  const aspectRatio =
    image.width && image.height ? image.width / image.height : 1;

  return (
    <div
      ref={cardRef}
      className="mb-4 overflow-hidden rounded-card bg-surface shadow-sm cursor-zoom-in"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div ref={imgRef} className="relative w-full" style={{ aspectRatio }}>
        <Image
          src={image.url}
          alt={image.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          data-flip-id={`image-${image.id}`}
        />
        {/* Overlay dégradé au hover */}
        <div className="overlay absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0" />
        {/* Bouton "Enregistrer" */}
        <button
          ref={btnRef}
          className="absolute top-3 right-3 p-2 bg-accent text-white rounded-full opacity-0"
          aria-label="Enregistrer"
          onClick={(e) => {
            e.stopPropagation(); // Évite d'ouvrir la lightbox au clic sur le bouton
            // Logique d'enregistrement future
          }}
        >
          <Bookmark size={16} />
        </button>
      </div>
      {/* <div className="p-3">
        <p className="truncate text-sm font-medium text-ink">
          {image.title}
        </p>
        <p className="text-xs text-ink-muted">{image.category.name}</p>
      </div> */}
    </div>
  );
}
