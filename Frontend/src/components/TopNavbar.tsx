"use client";

import { Search } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useEffect, useRef, useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function TopNavbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const setQuery = useSearchStore((s) => s.setQuery);
  const [input, setInput] = useState("");
  const debouncedInput = useDebouncedValue(input, 350);

  useEffect(() => {
    setQuery(debouncedInput.trim());
  }, [debouncedInput, setQuery]);

  useGSAP(
    () => {
      gsap.fromTo(
        ".nav-item",
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" }
      );
    },
    { scope: containerRef }
  );

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    gsap.to(e.target, { scale: 1.01, duration: 0.2, ease: "power1.out" });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    gsap.to(e.target, { scale: 1, duration: 0.2, ease: "power1.out" });

  return (
    <header
      ref={containerRef}
      className="fixed top-0 left-0 right-0 h-16 bg-bg/80 backdrop-blur-md px-6 flex items-center gap-6 z-40"
    >
      <span
        className="nav-item text-2xl font-bold text-accent"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Fotor
      </span>

      <div className="nav-item flex-1 max-w-md relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          size={18}
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Rechercher..."
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full pl-10 pr-4 py-2 bg-surface/60 text-sm rounded-pill outline-none placeholder:text-ink-muted focus:bg-surface transition-colors"
        />
      </div>
    </header>
  );
}