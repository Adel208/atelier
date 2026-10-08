# Atelier — maison de coiffure premium (démonstration)

Page d’accueil d’une maison de coiffure premium mixte à Paris. C’est un projet de démonstration de Virtuos Studio : l’adresse, le téléphone, l’e-mail, l’Instagram et les horaires sont fictifs et à remplacer avant toute mise en ligne publique. Les portraits et ambiances sont des visuels générés pour la maquette.

Démo en ligne : https://atelier-coiffure-paris.netlify.app/

## Technologies

Next.js (App Router, adaptateur Vinext), React, TypeScript, Tailwind CSS 4, composants shadcn (`components/ui`), GSAP / ScrollTrigger, Lenis (défilement fluide, ordinateur uniquement) et framer-motion (section d’animation des quatre images).

## Ce que montre la page

1. **Hero « Le miroir »** : un miroir en arche, d’abord embué, se dégage au défilement puis s’ouvre sur toute la pièce. Trois scènes (Précision, Matière, Personnalité) accompagnent l’ouverture, puis la transition « la coupe » révèle le manifeste ivoire.
2. **Manifeste**, puis **Femme / Homme** : deux panneaux côte à côte avec survol sur ordinateur ; sur tablette et téléphone, une entrée animée au défilement.
3. **Prestations**, **Un temps pour vous** (texte révélé mot à mot, cadre qui s’ouvre, ligne du temps) et **Expertise**.
4. **Animation des quatre images** (`components/ui/scroll-choreography.tsx`) : quatre cadres qui se croisent, s’empilent, puis l’un d’eux passe en plein écran.
5. **Galerie « Matière »** en parallaxe, **Signature**, **Rendez-vous** et pied de page.

## Lancer en local

Prérequis : Node.js 22.13 ou plus récent.

```bash
npm ci
npm run dev
```

## Publier la démo

Le site de démonstration n’est pas relié à GitHub : il se publie à la main, en export statique.

```bash
STATIC_EXPORT=1 npx next build
netlify deploy --prod --dir=out --site 9d8c6b8b-94ec-49e8-87f7-700565a3b3e0
```

Toujours préciser `--site` : le dossier peut être lié à un autre projet Netlify.

## Images

- `public/choreo-1-texture.webp` à `choreo-4-miroir.webp` : les quatre images de l’animation (la 4ᵉ sert aussi au hero).
- `public/femme-editorial.webp`, `homme-editorial.webp`, `texture-editorial.png`, `salon-editorial.png` : univers Femme / Homme, galerie et section « Un temps pour vous ».
- Les portraits Femme et Homme ont été retouchés pour s’accorder à la lumière chaude des autres visuels.

## Accessibilité et responsive

- `prefers-reduced-motion` : les animations sont désactivées (hero fixe, grille de quatre images à la place de l’animation).
- Le défilement fluide (Lenis) n’est actif que sur ordinateur.
- Mise en page adaptée aux tablettes et aux téléphones, libellés d’au moins 9 à 10 px.
