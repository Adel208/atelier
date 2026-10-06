"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const navigation = [
  ["LE SALON", "#manifeste"],
  ["FEMME", "#femme-homme"],
  ["HOMME", "#femme-homme"],
  ["EXPERTISE", "#expertise"],
  ["GALERIE", "#galerie"],
  ["CONTACT", "#rendez-vous"],
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [lightHeader, setLightHeader] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const hero = heroRef.current;
    if (!hero) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 700px)").matches;

    const context = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>(".hero-scene");
      const line = ".blade-light";
      const halo = ".warm-halo";
      const slit = ".vertical-light";

      if (reducedMotion) {
        gsap.set(scenes, { autoAlpha: 0 });
        gsap.set(scenes[0], { autoAlpha: 1 });
      } else {
        gsap.set(scenes, { autoAlpha: 0 });
        gsap.set(scenes[0], { autoAlpha: 1 });
        gsap.set(scenes[0].querySelector(".hero-scene__inner"), { y: 18, filter: "blur(5px)" });
        gsap.to(scenes[0].querySelector(".hero-scene__inner"), {
          y: 0, filter: "blur(0px)", duration: 1.1, ease: "power3.out", delay: 0.15,
        });
        gsap.set(line, { autoAlpha: 0, scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(halo, { autoAlpha: 0, yPercent: 25, scale: 0.8 });
        gsap.set(slit, { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 100%" });
        gsap.set(".sculpture", { xPercent: compact ? 23 : 29, rotation: 24 });
        gsap.set(".sculpture-blade--a", { rotation: -12, svgOrigin: "300 610" });
        gsap.set(".sculpture-blade--b", { rotation: 12, svgOrigin: "300 610" });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.25,
            onUpdate: (self) => {
              if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        timeline
          .to(".sculpture", { xPercent: compact ? -24 : -28, rotation: -30, scale: 0.9, duration: 0.22, ease: "sine.inOut" }, 0.1)
          .to(".sculpture-blade--a", { rotation: -26, duration: 0.22, ease: "sine.inOut" }, 0.1)
          .to(".sculpture-blade--b", { rotation: 26, duration: 0.22, ease: "sine.inOut" }, 0.1)
          .to(".sculpture-reflection", { yPercent: 130, duration: 0.32, ease: "none" }, 0.05)
          .to(".sculpture", { xPercent: compact ? 23 : 29, rotation: 15, scale: 1.06, duration: 0.2, ease: "sine.inOut" }, 0.36)
          .to(".sculpture-blade--a", { rotation: -7, duration: 0.2 }, 0.36)
          .to(".sculpture-blade--b", { rotation: 7, duration: 0.2 }, 0.36)
          .to(".sculpture", { xPercent: compact ? 25 : -27, rotation: -8, scale: 1.14, duration: 0.16, ease: "sine.inOut" }, 0.65)
          .to(line, { autoAlpha: 0.48, scaleX: 1, duration: 0.055, ease: "power2.out" }, 0.19)
          .to(scenes[0], { autoAlpha: 0, clipPath: "inset(0 0 100% 0)", duration: 0.07, ease: "power2.inOut" }, 0.2)
          .fromTo(scenes[1], { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" }, { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: 0.07, ease: "power2.out" }, 0.22)
          .to(line, { autoAlpha: 0, xPercent: 35, duration: 0.09 }, 0.28)
          .to(scenes[1], { autoAlpha: 0, clipPath: "inset(0 0 0 100%)", duration: 0.06, ease: "power2.inOut" }, 0.435)
          .to(halo, { autoAlpha: 0.75, yPercent: 0, scale: 1, duration: 0.1, ease: "sine.out" }, 0.43)
          .fromTo(scenes[2], { autoAlpha: 0, clipPath: "inset(0 0 100% 0)" }, { autoAlpha: 1, clipPath: "inset(0 0 0% 0)", duration: 0.07, ease: "power2.out" }, 0.46)
          .to(halo, { autoAlpha: 0, yPercent: -12, duration: 0.12 }, 0.56)
          .to(scenes[2], { autoAlpha: 0, clipPath: "inset(100% 0 0 0)", duration: 0.07, ease: "power2.inOut" }, 0.685)
          .to(".hero-vignette", { opacity: 0.92, duration: 0.09 }, 0.68)
          .to(slit, { autoAlpha: 0.7, scaleY: 1, duration: 0.1, ease: "power2.out" }, 0.69)
          .fromTo(scenes[3], { autoAlpha: 0, clipPath: "inset(0 0 100% 0)", y: 12 }, { autoAlpha: 1, clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.08, ease: "power3.out" }, 0.72)
          // Hold Personality, then let the sticky stage leave with the normal page flow.
          .to(".sculpture-edge", { opacity: 0.55, duration: 0.45, ease: "sine.out" }, 0.8);



        gsap.utils.toArray<HTMLElement>(".reveal-line").forEach((element, index) => {
          gsap.fromTo(element, { clipPath: "inset(0 0 100% 0)", y: 12 }, {
            clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 82%", toggleActions: "play none none reverse" },
            delay: index % 2 ? 0.08 : 0,
          });
        });
        gsap.fromTo(".expertise-rule__fill", { scaleX: 0 }, {
          scaleX: 1, transformOrigin: "left center", ease: "none",
          scrollTrigger: { trigger: "#expertise", start: "top 70%", end: "bottom 60%", scrub: true },
        });
        gsap.utils.toArray<HTMLElement>(".gallery-image").forEach((image, index) => {
          gsap.fromTo(image, { clipPath: index === 1 ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)" }, {
            clipPath: "inset(0 0 0 0)", ease: "power2.out",
            scrollTrigger: { trigger: image, start: "top 85%", end: "top 45%", scrub: 0.45 },
          });
          gsap.to(image, { yPercent: -4, ease: "none", scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.fromTo(".signature-second", { clipPath: "inset(100% 0 0 0)", y: 22 }, {
          clipPath: "inset(0 0 0 0)", y: 0, ease: "power2.out",
          scrollTrigger: { trigger: ".signature-section", start: "top 58%", end: "top 20%", scrub: 0.45 },
        });
      }

      ["#manifeste", "#le-temps", "#prestations", ".gallery-section", ".signature-section", "#femme-homme", "#expertise", "#rendez-vous"]
        .forEach((selector) => {
          const section = document.querySelector<HTMLElement>(selector);
          if (!section) return;
          const isLight = section.classList.contains("tone-light");
          ScrollTrigger.create({
            trigger: section, start: "top 55%", end: "bottom 45%",
            onToggle: (self) => setLightHeader(self.isActive && isLight),
          });
        });

    }, document);

    const scrollHandler = () => {
      setHeaderScrolled(window.scrollY > 18);
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });
    scrollHandler();
    return () => {
      window.removeEventListener("scroll", scrollHandler);
      context.revert();
    };
  }, []);

  return (
    <main>
      <header ref={headerRef} className={`site-header ${lightHeader ? "site-header--light" : ""} ${headerScrolled ? "header--scrolled" : ""}`}>
        <a className="wordmark" href="#top" aria-label="Atelier — accueil">atelier<span>•</span></a>
        <nav className={menuOpen ? "nav nav--open" : "nav"} aria-label="Navigation principale">
          {navigation.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <a className="header-book" href="#rendez-vous">PRENDRE RENDEZ-VOUS <span>↗</span></a>
        <button className="menu-toggle" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span />
        </button>
      </header>

      <section ref={heroRef} id="top" className="hero-scroll" aria-label="L’art du geste">
        <div className="hero-stage">
          <div className="sculpture" aria-hidden="true">
            <svg className="sculpture-svg" viewBox="0 0 600 900" fill="none">
              <defs>
                <linearGradient id="blade-metal" x1="255" y1="200" x2="350" y2="540" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#100E0C" /><stop offset=".35" stopColor="#29221B" /><stop offset=".48" stopColor="#58432F" /><stop offset=".52" stopColor="#211A14" /><stop offset="1" stopColor="#090908" />
                </linearGradient>
                <linearGradient id="blade-edge" x1="300" y1="70" x2="300" y2="800" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EEE7DE" stopOpacity=".1" /><stop offset=".3" stopColor="#C8B9A5" /><stop offset=".65" stopColor="#A67B50" /><stop offset="1" stopColor="#A67B50" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="blade-reflection" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="#A67B50" stopOpacity="0" /><stop offset=".5" stopColor="#C8B9A5" stopOpacity=".35" /><stop offset="1" stopColor="#A67B50" stopOpacity="0" /></linearGradient>
                <path id="blade-shape" d="M300 65 C286 157 255 356 269 540 L290 616 L271 765 Q269 801 287 805 Q308 811 310 774 L320 610 L330 540 C341 364 319 165 300 65Z" />
                <clipPath id="blade-mask"><use href="#blade-shape" /></clipPath>
              </defs>
              {["a", "b"].map((blade) => <g key={blade} className={`sculpture-blade sculpture-blade--${blade}`}>
                <use href="#blade-shape" fill="url(#blade-metal)" />
                <use className="sculpture-edge" href="#blade-shape" stroke="url(#blade-edge)" strokeWidth="1.1" />
                <g clipPath="url(#blade-mask)"><rect className="sculpture-reflection" x="240" y="-160" width="110" height="600" fill="url(#blade-reflection)" /></g>
                <path d="M300 77 L300 546" stroke="#EEE7DE" strokeOpacity=".12" strokeWidth=".6" />
              </g>)}
              <circle cx="300" cy="610" r="12" fill="#17130F" stroke="#A67B50" strokeOpacity=".45" />
              <circle cx="300" cy="610" r="4" fill="#57412D" />
            </svg>
          </div>
          <div className="hero-vignette" />
          <div className="warm-halo" />
          <div className="vertical-light" />
          <div className="blade-light" />
          <div className="hero-index"><span>ATELIER / PARIS</span><span>LE GESTE / SCROLL</span></div>
          <div className="hero-scenes">
            <article className="hero-scene scene-one">
              <div className="hero-scene__inner scene-one__inner">
                <p className="eyebrow">MAISON DE COIFFURE <span>·</span> PARIS</p>
                <h1>L’ART<br /><span>DU GESTE</span></h1>
                <p className="scene-copy">Coupe, matière et mouvement.<br />Une vision contemporaine de la coiffure<br className="desktop-only" /> pour elle et lui.</p>
                <a className="text-link" href="#rendez-vous">PRENDRE RENDEZ-VOUS <span>↗</span></a>
              </div>
              <div className="scroll-cue"><span>SCROLL TO DISCOVER</span><i /></div>
            </article>
            <article className="hero-scene scene-two">
              <div className="hero-scene__inner">
                <p className="scene-number">01 <i /></p><h2>PRÉCISION</h2>
                <p className="scene-copy">Chaque geste dessine<br />une intention.</p>
                <p className="micro-list">CUT <span>—</span> SHAPE <span>—</span> DETAIL</p>
              </div>
            </article>
            <article className="hero-scene scene-three">
              <div className="hero-scene__inner">
                <p className="scene-number">02 <i /></p><h2>MATIÈRE</h2>
                <p className="scene-copy">Une texture. Un mouvement.<br />Une façon de vous reconnaître.</p>
                <p className="micro-list">COUPE <span>—</span> COULEUR <span>—</span><br /> TEXTURE <span>—</span> SOIN</p>
              </div>
            </article>
            <article className="hero-scene scene-four">
              <div className="hero-scene__inner">
                <p className="scene-number">03 <i /></p><h2>PERSONNALITÉ</h2>
                <div className="for-you"><span>POUR ELLE.</span><span>POUR LUI.</span><span>POUR VOUS.</span></div>
              </div>
            </article>

          </div>
          <div className="hero-progress" aria-hidden="true"><span ref={progressRef} /></div>
        </div>
      </section>

      <section id="manifeste" className="manifesto-section tone-light">
        <div className="manifesto-meta"><span>FEMME & HOMME — PARIS</span><span>01 / NOTRE VISION</span></div>
        <div className="manifesto-layout">
          <h2><span className="reveal-line">LA COIFFURE</span><span className="reveal-line indent">COMME</span><span className="reveal-line">SIGNATURE<span className="period">.</span></span></h2>
          <div className="manifesto-note"><span className="note-rule" /><p>Nous travaillons la coupe, la matière et le mouvement pour construire un style qui vous appartient.</p><a href="#expertise" className="dark-link">NOTRE APPROCHE <span>↓</span></a></div>
        </div>
        <span className="manifesto-index">A — 01</span>
      </section>

      <section id="femme-homme" className="duo-section" aria-label="Nos univers femme et homme">
        <article className="duo-panel duo-women">
          <img src="/femme-editorial.webp" alt="Portrait éditorial d’une femme aux cheveux courts sculpturaux" />
          <div className="duo-shade" />
          <div className="duo-content"><p className="eyebrow">01 — UNIVERS</p><h2>FEMME</h2><p className="universe-intention">Des lignes libres.<br />Une allure singulière.</p><ul><li>Coupe</li><li>Brushing</li><li>Coloration</li><li>Balayage</li><li>Soins</li></ul><a className="duo-link" href="#prestations">EXPLORER LES PRESTATIONS <span>↗</span></a></div>
        </article>
        <article className="duo-panel duo-men">
          <img src="/homme-editorial.webp" alt="Portrait éditorial d’un homme à la coupe texturée" />
          <div className="duo-shade" />
          <div className="duo-content"><p className="eyebrow">02 — UNIVERS</p><h2>HOMME</h2><p className="universe-intention">Une coupe juste.<br />Du caractère au quotidien.</p><ul><li>Coupe</li><li>Dégradé</li><li>Styling</li><li>Barbe</li><li>Soins</li></ul><a className="duo-link" href="#prestations">EXPLORER LES PRESTATIONS <span>↗</span></a></div>
        </article>
        <div className="duo-caption"><span>UNE MAISON, DEUX UNIVERS</span><span>PARIS · DEPUIS TOUJOURS</span></div>
      </section>

      <section id="prestations" className="services-section tone-light">
        <div className="section-topline"><span>LA CARTE / NOS INTENTIONS</span><span>CHAQUE CHEVEU, UNE APPROCHE</span></div>
        <div className="services-layout"><h2><span className="reveal-line">TROUVER</span><span className="reveal-line">VOTRE LIGNE.</span></h2><div className="services-list">
          {[
            ["01", "Coupe & mouvement", "FEMME · HOMME", "Une ligne dessinée pour votre visage, votre texture et votre quotidien. Coupe, brushing ou styling : trouver une forme qui reste juste, même après le rendez-vous."],
            ["02", "Couleur & lumière", "COLORATION · BALAYAGE", "Des nuances qui dialoguent avec votre base naturelle. Travailler la profondeur, adoucir les contrastes et placer la lumière là où elle révèle le mouvement."],
            ["03", "Contours & caractère", "DÉGRADÉ · BARBE", "Des contours précis, des transitions maîtrisées et des volumes équilibrés. Chaque détail participe à une silhouette qui vous ressemble."],
            ["04", "Soin & texture", "FEMME · HOMME", "Prendre le temps de comprendre la fibre et ses besoins. Un soin adapté et des conseils simples pour accompagner la matière au quotidien."],
          ].map(([number, title, label, description]) => <details key={number}><summary><span>{number}</span><h3>{title}</h3><i aria-hidden="true">+</i></summary><div className="service-description"><span>{label}</span><p>{description}</p><a href="#rendez-vous" className="dark-link">PARLONS DE VOTRE ENVIE ↗</a></div></details>)}
        </div></div>
      </section>

      <section id="le-temps" className="salon-section tone-light">
        <div className="section-topline"><span>LA MAISON / L’EXPÉRIENCE</span><span>PRENDRE LE TEMPS</span></div>
        <div className="salon-heading"><h2><span className="reveal-line">UN TEMPS</span><span className="reveal-line">POUR VOUS.</span></h2><p>Un échange, un regard, une intention. Chaque rendez-vous commence par comprendre votre quotidien, vos envies et votre façon de porter vos cheveux.</p></div>
        <figure className="salon-photo"><img className="gallery-image" src="/salon-editorial.png" alt="Ambiance imaginée du salon : fauteuils noirs, bois sombre et lumière naturelle" loading="lazy" /><figcaption><span>01 / UN LIEU POUR SOUFFLER</span><span>ÉCOUTER. OBSERVER. CRÉER.</span></figcaption></figure>
        <div className="salon-after"><span>LE LUXE DE L’ATTENTION</span><p>Une envie précise ou une idée encore floue.<br />Tout commence par une conversation.</p><a href="#rendez-vous" className="dark-link">PRENDRE RENDEZ-VOUS ↗</a></div>
      </section>

      <section id="expertise" className="expertise-section tone-dark">
        <div className="section-topline"><span>02 / SAVOIR-FAIRE</span><span>LE SALON — PARIS</span></div>
        <h2><span className="reveal-line">LE DÉTAIL</span><span className="reveal-line indent">FAIT LA</span><span className="reveal-line">DIFFÉRENCE<span className="period">.</span></span></h2>
        <div className="expertise-rule"><span className="expertise-rule__fill" /></div>
        <div className="expertise-steps">
          <article><span className="step-number">01</span><div><h3>DIAGNOSTIC</h3><p>Observer avant<br />d’intervenir.</p></div><span className="step-arrow">↘</span></article>
          <article><span className="step-number">02</span><div><h3>GESTE</h3><p>Une précision adaptée<br />à chaque matière.</p></div><span className="step-arrow">↘</span></article>
          <article><span className="step-number">03</span><div><h3>FINITION</h3><p>La signature se joue<br />dans les détails.</p></div><span className="step-arrow">↘</span></article>
        </div>
      </section>

      <section id="galerie" className="gallery-section tone-light">
        <div className="section-topline"><span>03 / INSPIRATION</span><span>FORMES EN MOUVEMENT</span></div>
        <div className="gallery-heading"><h2 className="reveal-line">MATIÈRE<span className="period">.</span></h2><p>La beauté d’un mouvement libre.</p></div>
        <div className="gallery-grid">
          <figure className="gallery-figure gallery-large"><img className="gallery-image" src="/texture-editorial.png" alt="Boucles châtain et texture naturelle dans une lumière chaude" loading="lazy" /><figcaption><span>01 / TEXTURE</span><span>RÉVÉLER LA TEXTURE</span></figcaption></figure>
          <figure className="gallery-figure gallery-tall"><img className="gallery-image" src="/homme-editorial.webp" alt="Silhouette éditoriale et coupe masculine texturée" /><figcaption><span>02 / FORME</span><span>DESSINER LA LIGNE</span></figcaption></figure>
          <div className="gallery-word">MOUVEMENT<span>—</span></div>
          <figure className="gallery-figure gallery-wide"><img className="gallery-image" src="/femme-editorial.webp" alt="Détail de coiffure sculpté dans la lumière" /><figcaption><span>03 / LUMIÈRE</span><span>NUANCER LA LUMIÈRE</span></figcaption></figure>
        </div>
        <div className="material-notes"><article><span>01 / TEXTURE</span><h3>Révéler la texture</h3><p>Composer avec le mouvement naturel du cheveu, lui donner de l’espace et laisser vivre sa singularité.</p></article><article><span>02 / LIGNE</span><h3>Dessiner la ligne</h3><p>Trouver l’équilibre entre structure et liberté. Une forme précise, qui accompagne votre allure.</p></article><article><span>03 / NUANCE</span><h3>Nuancer la lumière</h3><p>Créer de la profondeur, sans figer la couleur. Des reflets qui se découvrent au fil du mouvement.</p></article></div>
      </section>

      <section className="signature-section tone-light">
        <span className="signature-label">UNE QUESTION DE REGARD</span>
        <h2><span className="reveal-line">IL N’EXISTE PAS</span><span className="reveal-line">UNE BONNE COUPE.</span><span className="signature-second">IL EXISTE</span><span className="signature-second signature-emphasis">LA VÔTRE.</span></h2>
        <span className="signature-mark">A / P</span>
      </section>

      <section id="rendez-vous" className="booking-section tone-dark">
        <div className="section-topline"><span>04 / À VOUS</span><span>PRENDRE LE TEMPS</span></div>
        <div className="booking-copy"><p className="eyebrow">VOTRE PROCHAIN STYLE COMMENCE ICI.</p><h2>PRENDRE<br /><span>RENDEZ-VOUS</span></h2><a className="booking-cta" href="https://virtuos.life/contact.html?offre=pro" target="_blank" rel="noopener">RÉSERVER UNE EXPÉRIENCE <span>↗</span><i /></a></div>
        <span className="booking-aside">01 — 02<br />FEMME & HOMME</span>
      </section>

      <footer className="site-footer tone-dark">
        <div className="footer-top"><a className="wordmark" href="#top">atelier<span>•</span></a><span className="footer-mantra">LE GESTE, JUSTE.</span><a className="footer-up" href="#top">REVENIR EN HAUT ↑</a></div>
        <div className="footer-grid"><div><span className="footer-label">NOUS TROUVER</span><p>Maquette de démonstration<br />Adresse fictive, Paris</p><span>AUCUN SALON RÉEL</span></div><div><span className="footer-label">NOUS JOINDRE</span><p>Coordonnées fictives.<br />Site réalisé par Virtuos Studio.</p><a href="https://virtuos.life/" target="_blank" rel="noopener">VIRTUOS.LIFE ↗</a></div><div><span className="footer-label">HORAIRES</span><p>Mardi — samedi<br />10:00 — 19:00</p><span>SUR RENDEZ-VOUS</span></div><div><span className="footer-label">EXPLORER</span>{navigation.slice(0, 5).map(([label, href]) => <a className="footer-nav-link" key={label} href={href}>{label}</a>)}</div></div>
        <div id="mentions" className="footer-bottom"><span>© ATELIER PARIS 2026</span><a href="#mentions">MENTIONS LÉGALES</a><span>FÉMININ · MASCULIN · SINGULIER</span></div>
        <span className="footer-ghost" aria-hidden="true">ATELIER</span>
      </footer>
      <CustomCursor />
    </main>
  );
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const move = (event: MouseEvent) => gsap.to(cursor, { x: event.clientX, y: event.clientY, xPercent: -50, yPercent: -50, duration: 0.22, ease: "power2.out", overwrite: true });
    const over = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const label = target?.closest(".duo-panel, .gallery-figure") ? "VIEW" : target?.closest(".booking-cta, .header-book, .text-link") ? "BOOK" : "";
      const interactive = target?.closest("a, button, .duo-panel, .gallery-figure");
      cursor.dataset.label = label;
      cursor.classList.toggle("cursor--active", Boolean(interactive));
    };
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); };
  }, []);
  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span /></div>;
}
