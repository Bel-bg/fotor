"use client";

import { gsap } from "gsap";
import { Flip } from "gsap/Flip";

// Enregistrer les plugins GSAP si on est côté client
if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

// Exporter gsap et Flip pour usage dans les composants
export { gsap, Flip };