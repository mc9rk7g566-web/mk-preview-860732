/* Maarten Kievit — concept. GSAP-motion, nav-state, receptfilters. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Navigatie: glas na scroll (home), mobiel menu ---- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Receptfilters (recepten.html) ---- */
  var chips = document.querySelectorAll(".chip[data-filter]");
  if (chips.length) {
    var cards = document.querySelectorAll(".recipe-card[data-cat]");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        var f = chip.dataset.filter;
        cards.forEach(function (card) {
          var show = f === "alles" || card.dataset.cat.split(" ").indexOf(f) !== -1;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---- Motion (alleen zonder reduced-motion en mét GSAP) ---- */
  if (reduceMotion || typeof gsap === "undefined") {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    if (nav) nav.classList.add("is-scrolled");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Nav krijgt glas zodra de pagina scrolt (feedback: je hebt de hero verlaten)
  if (nav && !nav.classList.contains("is-solid")) {
    ScrollTrigger.create({
      start: 40,
      onEnter: function () { nav.classList.add("is-scrolled"); },
      onLeaveBack: function () { nav.classList.remove("is-scrolled"); }
    });
  } else if (nav) {
    nav.classList.add("is-scrolled");
  }

  // Hero: regels omhoog uit hun maskers (verhaal: het doek gaat open)
  var heroLines = document.querySelectorAll(".hero .line > span");
  if (heroLines.length) {
    gsap.set(heroLines, { yPercent: 110 });
    gsap.to(heroLines, {
      yPercent: 0,
      duration: 1.05,
      ease: "power4.out",
      stagger: 0.09,
      delay: 0.15
    });
    gsap.from(".hero-sub, .hero-cta", {
      opacity: 0, y: 18, duration: 0.8, ease: "power2.out", delay: 0.7, stagger: 0.1
    });
  }

  // Hero-beeld: trage parallax (transform-only)
  var heroImg = document.querySelector(".hero-media img");
  if (heroImg) {
    gsap.to(heroImg, {
      yPercent: 10,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  // Secties: rustige fade-up zodra ze in beeld komen (hiërarchie: één ding tegelijk)
  ScrollTrigger.batch(".reveal", {
    start: "top 88%",
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, {
        opacity: 1, y: 0, duration: 0.75, ease: "power2.out", stagger: 0.08
      });
    }
  });

  // Vangnet: alles wat na 2,5s nog verborgen is, tonen (bv. boven de vouw geladen)
  window.setTimeout(function () {
    document.querySelectorAll(".reveal").forEach(function (el) {
      if (parseFloat(window.getComputedStyle(el).opacity) < 0.05) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
      }
    });
  }, 2500);
})();
