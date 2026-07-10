"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Home, GalleryHorizontalEnd, SquarePlus, Sparkles, Info, HatGlasses } from "lucide-react";
import { useRef, useState } from "react";

const navItems = [
  { icon: Home, label: "Accueil" },
  { icon: GalleryHorizontalEnd, label: "Explorer" },
  { icon: SquarePlus, label: "Créer" },
  { icon: Sparkles, label: "Notifications" },
  { icon: Info, label: "Messages" },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Accueil");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".nav-icon",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, stagger: 0.1 }
      );
    },
    { scope: containerRef }
  );

  const handleHover = (e: React.MouseEvent<HTMLButtonElement>, entering: boolean) => {
    gsap.to(e.currentTarget, {
      scale: entering ? 1.1 : 1,
      duration: 0.2,
      ease: "power1.out",
    });
  };

  return (
    <aside
      ref={containerRef}
      className="fixed left-0 top-0 h-full w-18 bg-surface border-r border-border flex flex-col items-center py-6 gap-4 z-50"
    >
      <div className="text-accent font-bold text-xl">F</div>

      <nav className="flex flex-col gap-4 mt-8">
        {navItems.map((item) => {
          const isActive = activeItem === item.label;
          return (
            <button
              key={item.label}
              className={`nav-icon p-2 rounded-lg transition-colors ${
                isActive ? "text-accent" : "text-ink-muted"
              }`}
              onClick={() => setActiveItem(item.label)}
              onMouseEnter={(e) => handleHover(e, true)}
              onMouseLeave={(e) => handleHover(e, false)}
              aria-label={item.label}
              aria-current={isActive}
            >
              <item.icon
                size={20}
                fill={isActive ? "currentColor" : "none"}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
            </button>
          );
        })}
      </nav>

      <button
        className={`nav-icon mt-auto p-2 rounded-full transition-colors ${
          activeItem === "Profil" ? "text-accent" : "text-ink-muted"
        }`}
        onClick={() => setActiveItem("Profil")}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
        aria-label="Profil"
        aria-current={activeItem === "Profil"}
      >
        <HatGlasses
          size={20}
          fill={activeItem === "Profil" ? "currentColor" : "none"}
          strokeWidth={activeItem === "Profil" ? 2.4 : 1.8}
        />
      </button>
    </aside>
  );
}