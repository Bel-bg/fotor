"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, Flip } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { FotorImage } from "@/types/graphql";

interface LightboxProps {
  image: FotorImage;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  image,
  currentIndex,
  totalCount,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTime = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  // Bloquer le scroll du body quand la lightbox est ouverte
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Clavier : flèches et escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Scroll wheel debounce
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 600) return; // debounce de 600ms
    if (e.deltaY > 20) {
      onNext();
      lastScrollTime.current = now;
    } else if (e.deltaY < -20) {
      onPrev();
      lastScrollTime.current = now;
    }
  };

  // Flip et animations d'apparition
  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.to(bgRef.current, { opacity: 1, duration: 0.2 });
        gsap.to(imageRef.current, { opacity: 1, duration: 0.2 });
        return;
      }

      // Anim du fond de 0 à 1
      gsap.fromTo(
        bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power1.inOut" }
      );

      // GSAP Flip de l'image de la grille vers la lightbox
      const state = Flip.getState(`[data-flip-id="image-${image.id}"]`);
      if (state) {
        Flip.from(state, {
          duration: 0.5,
          ease: "power2.inOut",
          absolute: true,
          targets: imageRef.current,
        });
      }
    },
    { scope: containerRef, dependencies: [image.id, prefersReducedMotion] }
  );

  // Transition lors du changement d'image (next/prev)
  const navigateWithTransition = (action: () => void, direction: "next" | "prev") => {
    if (prefersReducedMotion) {
      action();
      return;
    }

    const xOffset = direction === "next" ? -100 : 100;
    
    // Slide sortant
    gsap.to(imageRef.current, {
      x: xOffset,
      opacity: 0,
      duration: 0.2,
      ease: "power1.inOut",
      onComplete: () => {
        action();
        // Une fois l'état mis à jour, l'image change, on l'anime arrivant de l'autre côté
        gsap.fromTo(
          imageRef.current,
          { x: -xOffset, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.25, ease: "power1.out" }
        );
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-100 flex items-center justify-center"
      onWheel={handleWheel}
    >
      {/* Fond sombre */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-overlay cursor-zoom-out"
        onClick={onClose}
      />

      {/* Bouton de fermeture */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 text-white/70 hover:text-white transition-colors z-50 rounded-full hover:bg-white/10"
        aria-label="Fermer"
      >
        <X size={24} />
      </button>

      {/* Navigation Flèche Gauche */}
      <button
        onClick={() => navigateWithTransition(onPrev, "prev")}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white transition-colors z-50 rounded-full hover:bg-white/10"
        aria-label="Image précédente"
      >
        <ChevronLeft size={36} />
      </button>

      {/* Zone Image */}
      <div className="relative max-w-[85vw] max-h-[85vh] flex items-center justify-center z-40 select-none">
        <div className="relative overflow-hidden rounded-card bg-surface shadow-2xl">
          <Image
            ref={imageRef}
            src={image.url}
            alt={image.title}
            width={image.width || 800}
            height={image.height || 600}
            data-flip-id={`image-${image.id}`}
            className="max-w-[85vw] max-h-[80vh] object-contain block"
            priority
          />
          <div className="p-4 bg-surface flex flex-col gap-1 border-t border-border">
            <h2 className="font-bold text-lg text-ink">{image.title}</h2>
            <p className="text-sm text-ink-muted">{image.category.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation Flèche Droite */}
      <button
        onClick={() => navigateWithTransition(onNext, "next")}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white transition-colors z-50 rounded-full hover:bg-white/10"
        aria-label="Image suivante"
      >
        <ChevronRight size={36} />
      </button>

      {/* Compteur d'images */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white/90 px-4 py-2 rounded-pill text-sm font-medium z-50">
        {currentIndex + 1} / {totalCount}
      </div>
    </div>
  );
}