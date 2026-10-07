"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ScrollChoreography } from "@/components/ui/scroll-choreography";

const TIMELINE = [
  ["01", "ACCUEIL", "Un fauteuil, un thé, le temps de se poser."],
  ["02", "ÉCHANGE", "Vos envies, votre quotidien, votre texture."],
  ["03", "GESTE", "La coupe se dessine, sans précipitation."],
  ["04", "FINITION", "Le détail qui signe l’ensemble."],
];

const CHOREOGRAPHY_IMAGES = {
  topLeft: "/choreo-1-texture.webp",
  bottomRight: "/choreo-2-geste.webp",
  bottomLeft: "/choreo-3-profil.webp",
  topRight: "/choreo-4-miroir.webp",
};
const CHOREOGRAPHY_ALTS = {
  topLeft: "Gros plan sur des boucles châtain dans une lumière dorée",
  bottomRight: "Les mains d’un coiffeur coupant une mèche avec des ciseaux et un peigne",
  bottomLeft: "Profil d’une femme à la coupe courte structurée, pull noir à col roulé",
  topRight: "Une cliente à la coupe courte se regarde dans le miroir du salon, lumière dorée de fin de journée",
};

const MARQUEE_WORDS = ["MOUVEMENT", "TEXTURE", "LIGNE", "LUMIÈRE"];

function Words({ text }: { text: string }) {
  return <>{text.split(" ").map((word, index) => <span key={index}><span className="word">{word}</span>{" "}</span>)}</>;
}

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

    // Défilement fluide : ordinateur uniquement, jamais en mouvement réduit ni sur téléphone.
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    if (!reducedMotion && !compact) {
      lenis = new Lenis({ lerp: 0.1, anchors: { offset: -82 } });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

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
        // « Le miroir » : un reflet embué dans un cadre en arche, qui se dégage puis s'ouvre sur toute la pièce.
        gsap.set(".mirror-photo", { filter: "blur(14px) brightness(0.38) saturate(0.8)", scale: 1.2 });
        gsap.set(".mirror-sheen", { xPercent: -160 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.25,
            onUpdate: (self) => {
              if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
              // L’ivoire atteint la barre de navigation : le menu passe en encre.
              setLightHeader(self.progress > 0.88);
            },
          },
        });
        timeline
          .to(".mirror-photo", { filter: "blur(0px) brightness(1) saturate(1)", duration: 0.36, ease: "power1.out" }, 0.04)
          .to(".mirror-photo", { scale: 1, duration: 0.9, ease: "none" }, 0.02)
          .to(".mirror-sheen", { xPercent: 260, duration: 0.4, ease: "none" }, 0.04)
          .to(".mirror-frame", { top: 0, bottom: 0, right: 0, width: "100vw", borderRadius: "0px 0px 0px 0px", boxShadow: "0 0 0 0px rgba(176,130,84,0), 0 0 0 0px rgba(7,7,6,0), 0 0 0 0px rgba(176,130,84,0), 0 0 0px rgba(166,123,80,0)", duration: 0.46, ease: "power2.inOut" }, 0.5)
          .to(".mirror-photo", { objectPosition: "50% 45%", duration: 0.46, ease: "power2.inOut" }, 0.5)
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
          .fromTo(scenes[3], { autoAlpha: 0, clipPath: "inset(0 0 100% 0)", y: 12 }, { autoAlpha: 1, clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.08, ease: "power3.out" }, 0.72);

        // « La coupe » : un trait bronze traverse l’écran, le noir se fend le long du trait
        // et l’ivoire du manifeste apparaît par l’ouverture qui s’agrandit.
        gsap.set(".hero-wipe", { autoAlpha: 1 });
        gsap.set(".cut-line", { autoAlpha: 0, scaleX: 0 });
        gsap.set(".cut-edge", { autoAlpha: 0, top: "50%" });
        timeline
          .to(".cut-line", { autoAlpha: 1, scaleX: 1, duration: 0.06, ease: "power3.inOut" }, 0.93)
          .set(".cut-line", { autoAlpha: 0 }, 0.995)
          .set(".cut-edge", { autoAlpha: 1 }, 0.995)
          .fromTo(".hero-wipe", { clipPath: "inset(50% 0% 50% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.19, ease: "power2.inOut" }, 1)
          .to(".hero-wipe", { "--grain": 0, duration: 0.12, ease: "none" }, 1.13)
          .to(".cut-edge--top", { top: "0%", duration: 0.19, ease: "power2.inOut" }, 1)
          .to(".cut-edge--bottom", { top: "100%", duration: 0.19, ease: "power2.inOut" }, 1)
          .to(".cut-edge", { autoAlpha: 0, duration: 0.03, ease: "none" }, 1.16);

        // « Un temps pour vous » : texte mot par mot, cadre qui s’ouvre, ligne du temps.
        gsap.fromTo(".salon-lede .word", { opacity: 0.14 }, {
          opacity: 1, stagger: 0.12, ease: "none",
          scrollTrigger: { trigger: ".salon-lede", start: "top 82%", end: "bottom 48%", scrub: true },
        });
        gsap.fromTo(".salon-frame", { clipPath: "inset(15% 17% 15% 17%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out",
          scrollTrigger: { trigger: ".salon-photo", start: "top 88%", end: "top 18%", scrub: 0.5 },
        });
        gsap.fromTo(".salon-frame img", { scale: 1.32, yPercent: -5 }, {
          scale: 1, yPercent: 5, ease: "none",
          scrollTrigger: { trigger: ".salon-photo", start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.fromTo(".salon-photo figcaption", { autoAlpha: 0, y: 10 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: ".salon-photo", start: "top 40%", end: "top 15%", scrub: true },
        });
        const timelineItems = gsap.utils.toArray<HTMLElement>(".timeline__step");
        gsap.fromTo(".timeline__fill", compact ? { scaleY: 0 } : { scaleX: 0 }, {
          ...(compact ? { scaleY: 1 } : { scaleX: 1 }), ease: "none",
          scrollTrigger: {
            trigger: ".timeline", start: compact ? "top 70%" : "top 82%", end: compact ? "bottom 60%" : "bottom 58%", scrub: 0.4,
            onUpdate: (self) => timelineItems.forEach((item, index) => item.classList.toggle("is-on", self.progress > index / timelineItems.length)),
          },
        });

        // « Matière » : titre contour qui se remplit, cadres à vitesses différentes, bande qui défile.
        gsap.fromTo(".outline-letter", { color: "rgba(7,7,6,0)" }, {
          color: "rgba(7,7,6,1)", stagger: 0.14, ease: "none",
          scrollTrigger: { trigger: ".gallery-heading", start: "top 80%", end: "bottom 38%", scrub: true },
        });
        const depth = compact ? 0.4 : 1;
        [[".gallery-large", 46, -46], [".gallery-tall", 120, -90], [".gallery-wide", -70, 60]].forEach(([selector, from, to]) => {
          gsap.fromTo(selector as string, { y: (from as number) * depth }, {
            y: (to as number) * depth, ease: "none",
            scrollTrigger: { trigger: ".gallery-grid", start: "top bottom", end: "bottom top", scrub: 0.7 },
          });
          gsap.fromTo(`${selector} .gallery-frame`, { clipPath: "inset(14% 16% 14% 16%)" }, {
            clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out",
            scrollTrigger: { trigger: selector as string, start: "top 90%", end: "top 40%", scrub: 0.5 },
          });
          gsap.fromTo(`${selector} img`, { scale: 1.3 }, {
            scale: 1.04, ease: "none",
            scrollTrigger: { trigger: selector as string, start: "top 90%", end: "bottom 30%", scrub: true },
          });
        });
        gsap.fromTo(".marquee-track", { xPercent: 4 }, {
          xPercent: -26, ease: "none",
          scrollTrigger: { trigger: ".gallery-marquee", start: "top bottom", end: "bottom top", scrub: 0.6 },
        });

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
        gsap.fromTo(".signature-second", { clipPath: "inset(100% 0 0 0)", y: 22 }, {
          clipPath: "inset(0 0 0 0)", y: 0, ease: "power2.out",
          scrollTrigger: { trigger: ".signature-section", start: "top 58%", end: "top 20%", scrub: 0.45 },
        });
      }

      ["#manifeste", "#le-temps", "#prestations", ".gallery-section", ".signature-section", "#femme-homme", "#expertise", "#choregraphie", "#rendez-vous"]
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
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      gsap.ticker.lagSmoothing(500, 33);
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
          <div className="mirror-frame">
            <img className="mirror-photo" src="/choreo-4-miroir.webp" alt="Une cliente à la coupe courte se regarde dans le miroir du salon, lumière dorée de fin de journée" width="1672" height="941" fetchPriority="high" />
            <span className="mirror-sheen" aria-hidden="true" />
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
          <div className="hero-wipe" aria-hidden="true" />
          <div className="cut-line" aria-hidden="true" />
          <div className="cut-edge cut-edge--top" aria-hidden="true" />
          <div className="cut-edge cut-edge--bottom" aria-hidden="true" />
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
        <div className="salon-heading"><h2><span className="reveal-line">UN TEMPS</span><span className="reveal-line">POUR VOUS.</span></h2><p className="salon-lede"><Words text="Un échange, un regard, une intention. Chaque rendez-vous commence par comprendre votre quotidien, vos envies et votre façon de porter vos cheveux." /></p></div>
        <figure className="salon-photo"><div className="salon-frame"><img src="/salon-editorial.png" alt="Ambiance imaginée du salon : fauteuils noirs, bois sombre et lumière naturelle" loading="lazy" /></div><figcaption><span>01 / UN LIEU POUR SOUFFLER</span><span>ÉCOUTER. OBSERVER. CRÉER.</span></figcaption></figure>
        <ol className="timeline" aria-label="Le déroulé d’un rendez-vous">
          <li className="timeline__rail" aria-hidden="true"><span className="timeline__fill" /></li>
          {TIMELINE.map(([number, label, text]) => <li className="timeline__step" key={number}><i className="timeline__dot" aria-hidden="true" /><span className="timeline__number">{number}</span><h3>{label}</h3><p>{text}</p></li>)}
        </ol>
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

      <section id="choregraphie" className="tone-dark" aria-label="Le salon en images">
        <ScrollChoreography images={CHOREOGRAPHY_IMAGES} alts={CHOREOGRAPHY_ALTS} />
      </section>

      <section id="galerie" className="gallery-section tone-light">
        <div className="section-topline"><span>03 / INSPIRATION</span><span>FORMES EN MOUVEMENT</span></div>
        <div className="gallery-heading"><h2 aria-label="Matière."><span className="outline-word" aria-hidden="true">{"MATIÈRE".split("").map((letter, index) => <span key={index} className="outline-letter">{letter}</span>)}</span><span className="period" aria-hidden="true">.</span></h2><p>La beauté d’un mouvement libre.</p></div>
        <div className="gallery-grid">
          <figure className="gallery-figure gallery-large"><div className="gallery-frame"><div className="gallery-media"><img src="/texture-editorial.png" alt="Boucles châtain et texture naturelle dans une lumière chaude" loading="lazy" /></div><figcaption><span>01 / TEXTURE</span><span>RÉVÉLER LA TEXTURE</span></figcaption></div></figure>
          <figure className="gallery-figure gallery-tall"><div className="gallery-frame"><div className="gallery-media"><img src="/homme-editorial.webp" alt="Silhouette éditoriale et coupe masculine texturée" /></div><figcaption><span>02 / FORME</span><span>DESSINER LA LIGNE</span></figcaption></div></figure>
          <div className="gallery-marquee" aria-hidden="true"><div className="marquee-track">{[0, 1].map((copy) => <span className="marquee-set" key={copy}>{MARQUEE_WORDS.map((word) => <span className="marquee-word" key={word}>{word}<i>—</i></span>)}</span>)}</div></div>
          <figure className="gallery-figure gallery-wide"><div className="gallery-frame"><div className="gallery-media"><img src="/femme-editorial.webp" alt="Détail de coiffure sculpté dans la lumière" /></div><figcaption><span>03 / LUMIÈRE</span><span>NUANCER LA LUMIÈRE</span></figcaption></div></figure>
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
      const label = target?.closest(".duo-panel, .gallery-figure") ? "VOIR" : target?.closest(".booking-cta, .header-book, .text-link") ? "BOOK" : "";
      const interactive = target?.closest("a, button, .duo-panel, .gallery-figure");
      cursor.dataset.label = label;
      cursor.classList.toggle("custom-cursor--active", Boolean(interactive));
    };
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); };
  }, []);
  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span /></div>;
}
