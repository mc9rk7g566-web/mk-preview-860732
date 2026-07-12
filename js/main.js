/* Maarten, in de keuken — concept v2. GSAP-motion, menu-overlay, carousel, zoeken, filters. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof gsap !== "undefined";
  var nav = document.querySelector(".nav");

  /* ---- Fullscreen menu-overlay (burger draait naar X, links staggeren in) ---- */
  var toggle = document.querySelector(".nav-toggle");
  var overlay = document.querySelector(".menu-overlay");

  if (toggle && overlay) {
    var overlayItems = overlay.querySelectorAll("a, .menu-tagline");

    var openMenu = function () {
      overlay.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      if (nav) nav.classList.add("menu-open");
      document.body.style.overflow = "hidden";
      if (hasGsap && !reduceMotion) {
        gsap.fromTo(overlayItems,
          { y: 34, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.06, delay: 0.12 });
      }
    };
    var closeMenu = function () {
      overlay.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (nav) nav.classList.remove("menu-open");
      document.body.style.overflow = "";
    };

    toggle.addEventListener("click", function () {
      overlay.classList.contains("is-open") ? closeMenu() : openMenu();
    });
    overlay.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) closeMenu();
    });
  }

  /* ---- Carousel: pijlen scrollen één kaart verder ---- */
  document.querySelectorAll(".carousel").forEach(function (carousel) {
    var track = carousel.querySelector(".carousel-track");
    var prev = carousel.querySelector("[data-prev]");
    var next = carousel.querySelector("[data-next]");
    if (!track || !prev || !next) return;
    var step = function () {
      var card = track.querySelector(".carousel-card");
      return card ? card.getBoundingClientRect().width + 24 : 400;
    };
    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }); });
  });

  /* ---- Recepten: zoeken + filterchips gecombineerd ---- */
  var searchInput = document.querySelector("[data-search]");
  var chips = document.querySelectorAll(".chip[data-filter]");
  var cards = document.querySelectorAll(".recipe-card[data-cat]");
  var noResults = document.querySelector(".no-results");

  if (cards.length && (searchInput || chips.length)) {
    var activeFilter = "alles";
    var applyFilters = function () {
      var q = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var shown = 0;
      cards.forEach(function (card) {
        var matchCat = activeFilter === "alles" || card.dataset.cat.split(" ").indexOf(activeFilter) !== -1;
        var matchText = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
        var show = matchCat && matchText;
        card.style.display = show ? "" : "none";
        if (show) shown++;
      });
      if (noResults) noResults.style.display = shown ? "none" : "block";
    };
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        activeFilter = chip.dataset.filter;
        applyFilters();
      });
    });
    if (searchInput) searchInput.addEventListener("input", applyFilters);
  }

  /* ---- Motion (alleen zonder reduced-motion en mét GSAP) ---- */
  if (reduceMotion || !hasGsap) {
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
    gsap.set(heroLines, { yPercent: 112 });
    gsap.to(heroLines, {
      yPercent: 0,
      duration: 1.05,
      ease: "power4.out",
      stagger: 0.1,
      delay: 0.15
    });
    gsap.from(".hero-sub, .hero-cta", {
      opacity: 0, y: 18, duration: 0.8, ease: "power2.out", delay: 0.75, stagger: 0.1
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
