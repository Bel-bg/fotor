# Fotor — Design System

> Objectif : un catalogue d'images qui a le feeling Pinterest — dense, fluide, tactile —
> mais avec une identité propre (Chill White + True Pink) et des animations plus
> soignées que l'original grâce à GSAP.

---

## 1. Philosophie

- **Dense mais respirable** : la grille masonry est la star, l'UI autour doit être minimale et silencieuse.
- **Tactile** : chaque interaction (hover, clic, ouverture d'image) a un feedback animé, jamais instantané/brutal.
- **Rose = action** : le True Pink n'est utilisé QUE pour les éléments interactifs/actifs, jamais en décoration gratuite. Ça le garde percutant.
- **Continuité visuelle** : quand on ouvre une image en grand, elle doit sembler "grandir" depuis sa position dans la grille, pas apparaître d'un bloc (shared element transition via GSAP Flip).

---

## 2. Palette de couleurs

### Tokens principaux

| Token               | Hex       | Usage                                                        |
|---------------------|-----------|---------------------------------------------------------------|
| `--color-bg`         | `#FFF9FA` | Fond global de l'app (Chill White)                            |
| `--color-accent`     | `#FD1843` | Actions principales, états actifs, focus (True Pink)          |
| `--color-accent-hover`| `#E01038`| Hover/pressed sur éléments accent                              |
| `--color-accent-soft`| `#FFE3EA` | Fonds légers (badge actif, hover subtil, sélection catégorie) |
| `--color-surface`    | `#FFFFFF` | Fond des cartes, navbar, modales (contraste léger avec le bg) |
| `--color-text`       | `#1A1417` | Texte principal (noir chaud, pas de noir pur)                 |
| `--color-text-muted` | `#8A7F84` | Texte secondaire, sous-titres, placeholders                   |
| `--color-border`     | `#F2E1E5` | Bordures/dividers très discrets                               |
| `--color-overlay`    | `rgba(23,16,18,0.92)` | Fond de la vue agrandie (lightbox)             |

### Pourquoi ces choix
- `#FFF9FA` au lieu d'un blanc pur : évite l'effet "hôpital", donne une chaleur subtile qui met le rose en valeur sans l'affronter.
- `#FD1843` est saturé et chaud → on ne l'utilise jamais en aplat sur de grandes surfaces (fatigue visuelle), seulement sur boutons, icônes actives, indicateurs.
- `--color-text` n'est pas `#000000` : un noir légèrement teinté rose-brun (`#1A1417`) garde l'ensemble cohérent avec la palette chaude.

### Config Tailwind (`tailwind.config.ts`)

```ts
export default {
  theme: {
    extend: {
      colors: {
        bg: "#FFF9FA",
        accent: {
          DEFAULT: "#FD1843",
          hover: "#E01038",
          soft: "#FFE3EA",
        },
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#1A1417",
          muted: "#8A7F84",
        },
        border: "#F2E1E5",
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
    },
  },
};
```

---

## 3. Typographie

- **Corps de texte / UI** : `Inter` (déjà dispo via next/font, lisible, neutre)
- **Logo / titres forts** : `Poppins` (600/700) — ses formes rondes évoquent le wordmark Pinterest sans le copier
- Échelle : `text-xs` (12px) pour métadonnées, `text-sm` (14px) UI courante, `text-base` (16px) corps, `text-xl/2xl` titres de section

---

## 4. Layout général

```
┌────┬──────────────────────────────────────────────┐
│    │  [Logo Fotor]        [barre de recherche]     │  ← Top navbar (64px)
│    ├──────────────────────────────────────────────┤
│ N  │                                                │
│ a  │                                                │
│ v  │           Grille masonry (Catalogue)           │
│    │                                                │
│(72 │                                                │
│ px)│                                                │
└────┴──────────────────────────────────────────────┘
```

### 4.1 Navbar verticale (gauche, 72px de large, fixe, fond `surface`)
- Icônes seules (pas de texte), empilées verticalement, centrées
- Ordre suggéré : **Accueil**, **Explorer/Recherche**, **Créer** (bouton accent, rond, légèrement mis en avant), **Notifications**, **Messages**, puis en bas **Profil** (avatar rond)
- Icône active : fond `accent-soft` en pastille arrondie derrière l'icône, icône elle-même en `accent`
- Hover : léger scale (1.1) + fond `accent-soft` qui fade in — animé en GSAP (voir §6)
- Le bouton "Créer" se distingue : fond `accent` plein, icône blanche, léger halo au hover

### 4.2 Navbar horizontale (haut, 64px, fond `surface`, `border-bottom` avec `--color-border`)
- Gauche : logo/wordmark "Fotor" (Poppins 600, `accent`)
- Centre : barre de recherche — pill shape (`rounded-pill`), fond `bg`, bordure `border`, icône loupe à gauche
  - Au focus : bordure devient `accent`, léger scale up (1.02), ombre douce colorée (`shadow-accent/20`)
- Droite (optionnel v2) : filtres rapides ou toggle de vue

### 4.3 Zone principale
- Padding généreux (`px-6 py-6` desktop), max-width contenue sur très grands écrans (`max-w-[1600px] mx-auto`) pour ne pas étirer la grille à l'infini
- Colonnes masonry : largeur cible ~236px par colonne (comme Pinterest), gap 16px, coins `rounded-card` (16px)

---

## 5. Composant : Image Card

- Coins arrondis 16px, `overflow-hidden`
- **Hover** (desktop uniquement) :
  - L'image fait un léger `scale(1.03)` (zoom doux, jamais brutal)
  - Un overlay dégradé sombre apparaît en bas (pour la lisibilité d'un futur titre/actions)
  - Un bouton rond "Enregistrer" (fond `accent`, texte blanc) apparaît en haut à droite, slide-in + fade
  - Le tout animé en GSAP, pas en CSS transition pure (voir §6.2)
- Ombre au repos : quasi nulle (`shadow-sm` léger), au hover : `shadow-lg` teintée rose très subtile

---

## 6. Vue agrandie (Lightbox) avec navigation au scroll

### 6.1 Comportement
- Clic sur une image → elle "grandit" jusqu'à occuper le centre de l'écran, fond qui s'assombrit (`--color-overlay`) derrière
- **Scroll (molette/trackpad) pendant que la lightbox est ouverte** = passe à l'image suivante/précédente du catalogue (au lieu de scroller la page). On bloque le scroll du body pendant que la lightbox est ouverte.
- Navigation alternative : flèches clavier (←/→), boutons flèche discrets sur les bords, swipe sur mobile
- Fermeture : bouton X en haut à droite, touche `Échap`, ou clic sur le fond sombre (hors image)
- Un compteur discret ("12 / 340") en bas peut aider à se repérer dans le catalogue

### 6.2 Animation d'ouverture — GSAP Flip (shared element transition)
C'est LE détail qui distingue un projet "de ouf" d'un projet basique : l'image ne doit
pas juste apparaître, elle doit **continuer son mouvement** depuis sa position dans la
grille jusqu'au centre de l'écran.

- Utiliser le plugin **GSAP Flip** (`gsap/Flip`) :
  1. Avant d'ouvrir la lightbox, capturer l'état (`Flip.getState`) de l'image cliquée
  2. Monter le composant lightbox avec cette même image en position "finale" (centrée, taille plein écran)
  3. `Flip.from(state, { duration: 0.5, ease: "power2.inOut", absolute: true })` anime la transition entre les deux états automatiquement
- Le fond sombre (`overlay`) fait un simple fade-in (`opacity 0 → 1`, 0.3s) en parallèle
- À la fermeture : on rejoue l'inverse (Flip vers l'état d'origine dans la grille), puis on démonte la lightbox

### 6.3 Changement d'image (next/prev dans la lightbox)
- Pas de Flip ici (pas d'élément partagé) : un cross-fade + léger slide horizontal
  (l'image sortante part vers la gauche/droite en fondu, la nouvelle arrive de l'autre côté), ~0.35s, `power1.inOut`
- Débouncer le scroll (un scroll = une image suivante, pas un défilement continu) pour éviter de "sur-scroller" plusieurs images d'un coup

---

## 7. Spécifications d'animation GSAP (récapitulatif technique)

| Élément                         | Trigger                  | Animation                                                | Durée  | Ease           |
|----------------------------------|---------------------------|-----------------------------------------------------------|--------|----------------|
| Image card (apparition scroll)  | entre dans le viewport     | `opacity 0→1`, `y: 24→0`                                   | 0.5s   | `power2.out`   |
| Image card (hover)               | `mouseenter`               | `scale 1→1.03` sur l'image, overlay + bouton fade/slide-in | 0.25s  | `power2.out`   |
| Icône nav (hover)                | `mouseenter`               | `scale 1→1.1`, pastille fond fade-in                       | 0.2s   | `power1.out`   |
| Barre de recherche (focus)       | `focus`                    | `scale 1→1.02`, bordure + ombre colorée                    | 0.2s   | `power1.out`   |
| Lightbox — ouverture              | `click` sur une card       | GSAP **Flip** (position/taille de la card → plein écran)   | 0.5s   | `power2.inOut` |
| Lightbox — fond                  | ouverture/fermeture        | `opacity 0→1` (overlay sombre)                             | 0.3s   | `power1.inOut` |
| Lightbox — image suivante/préc.  | `wheel` / flèches clavier  | cross-fade + slide horizontal léger                        | 0.35s  | `power1.inOut` |
| Grille (chargement page suivante)| nouvelles cards montées     | stagger `opacity 0→1`, `y: 24→0`, `stagger: 0.05`           | 0.5s   | `power2.out`   |

**Note d'implémentation** : utiliser `useGSAP` (déjà en place) pour chaque composant
animé, et centraliser le plugin Flip via `gsap.registerPlugin(Flip)` dans un module
partagé (`src/lib/gsap.ts`) importé une seule fois côté client.

---

## 8. Responsive

| Breakpoint | Colonnes masonry | Navbar verticale                          |
|------------|-------------------|--------------------------------------------|
| `< 500px`  | 2                 | Passe en bottom tab bar horizontale        |
| `500–768px`| 2                 | Verticale, icônes uniquement                |
| `768–1024px`| 3                | Verticale, icônes uniquement                |
| `> 1024px` | 4                 | Verticale, icônes uniquement                |

Sur mobile, la lightbox devient plein écran natif avec swipe horizontal (au lieu du scroll molette, non pertinent sur tactile).

---

## 9. Accessibilité

- Contraste texte/fond validé (`#1A1417` sur `#FFF9FA` largement > WCAG AA)
- Le rose `#FD1843` sur blanc est utilisé uniquement pour du texte de taille ≥ 16px ou des icônes (contraste suffisant, mais on évite le petit texte rose sur blanc)
- Toute animation respecte `prefers-reduced-motion` : si activé, on remplace les transitions GSAP par des `duration: 0` ou des simples fades courts
- La lightbox est navigable entièrement au clavier (Tab, flèches, Échap)

---

## 10. Prochaines étapes d'implémentation

1. Mettre à jour `tailwind.config.ts` avec les tokens du §2
2. Créer `src/lib/gsap.ts` pour enregistrer les plugins (`Flip`, `ScrollTrigger` si besoin) une seule fois
3. Refaire `Sidebar.tsx` (navbar verticale) et `TopNavbar.tsx` (logo + recherche) en composants dédiés
4. Ajouter le hover state sur `ImageCard.tsx` (overlay + bouton save)
5. Créer `Lightbox.tsx` avec la logique Flip + navigation scroll/clavier
6. Ajouter `prefers-reduced-motion` comme garde dans les hooks d'animation
