/* Maarten, in de keuken — concept v2. GSAP-motion, menu-overlay, carousel, zoeken, filters. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  var nav = document.querySelector(".nav");

  /* ---- Smooth scroll (Lenis): buttery wheel-scroll op desktop; op touch blijft
         native (dat is daar al soepel). Niet bij reduced-motion. ---- */
  // Alleen op een echte muis/touchpad (desktop). Op touch NOOIT Lenis: die vecht
  // met de native momentum-scroll van iOS/Android → scroll blijft af en toe hangen
  // ("stopt op sommige plekken"). Native touch-scroll is daar al soepel.
  var isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  var lenis = null;
  if (!reduceMotion && !isTouch && typeof Lenis !== "undefined") {
    lenis = new Lenis({
      lerp: 0.1,            /* continu interpoleren = geen stop-start, geen 'random stops' */
      wheelMultiplier: 1,
      smoothWheel: true
    });
    if (!hasGsap) {
      var lenisRaf = function (t) { lenis.raf(t); requestAnimationFrame(lenisRaf); };
      requestAnimationFrame(lenisRaf);
    }
  }

  /* ---- Fullscreen menu-overlay (burger draait naar X, links staggeren in) ---- */
  var toggle = document.querySelector(".nav-toggle");
  var overlay = document.querySelector(".menu-overlay");

  if (toggle && overlay) {
    var overlayItems = overlay.querySelectorAll("a, .menu-tagline");

    var openMenu = function () {
      overlay.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      if (nav) nav.classList.add("menu-open");
      if (lenis) lenis.stop(); else document.body.style.overflow = "hidden";
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
      if (lenis) lenis.start(); else document.body.style.overflow = "";
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

  /* ---- In-page ankers soepel scrollen via Lenis (offset voor de vaste nav).
         Werkt voor '#over' én '/#over'; cross-page links (doel niet op deze
         pagina) laten we met rust. ---- */
  if (lenis) {
    document.querySelectorAll('a[href*="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href") || "";
        var i = href.indexOf("#");
        if (i === -1) return;
        var id = href.slice(i);
        if (id.length < 2 || id === "#MainContent") return;
        var target;
        try { target = document.querySelector(id); } catch (err) { return; }
        if (!target) return; /* doel staat niet op deze pagina → laat de browser navigeren */
        e.preventDefault();
        if (overlay && overlay.classList.contains("is-open") && typeof closeMenu === "function") closeMenu();
        lenis.scrollTo(target, { offset: -70, duration: 1.1 });
      });
    });
  }

  /* ---- Header verbergt bij scrollen omlaag, komt terug bij omhoog (soepel, geen getril) ---- */
  if (nav) {
    var lastNavY = window.pageYOffset || 0;
    var navTicking = false;
    var updateNav = function () {
      var y = window.pageYOffset || 0;
      if (Math.abs(y - lastNavY) > 8) {
        if (y > lastNavY && y > 200) nav.classList.add("nav--hidden");
        else if (y < lastNavY) nav.classList.remove("nav--hidden");
        lastNavY = y;
      }
      navTicking = false;
    };
    window.addEventListener("scroll", function () {
      if (!navTicking) { window.requestAnimationFrame(updateNav); navTicking = true; }
    }, { passive: true });
  }

  /* ---- Inschrijven: native submit (Shopify's spam-check/captcha moet de POST afhandelen;
         een AJAX-fetch omzeilt die en dan wordt de inschrijving stil geweigerd).
         Na terugkeer met ?customer_posted=true tonen we de bedankstaat. ---- */
  var signupWrap = document.querySelector("[data-signup]");
  var signupForm = document.getElementById("landing-signup");
  if (signupWrap && signupForm) {
    if (window.location.search.indexOf("customer_posted=true") !== -1) {
      signupWrap.classList.add("is-done");
    }
    signupForm.addEventListener("submit", function () {
      var btn = signupForm.querySelector("button[type=submit]");
      if (btn) { btn.setAttribute("aria-busy", "true"); }
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

  /* ---- Shopify productvarianten: prijs en beschikbaarheid direct bijwerken ---- */
  var variantSelect = document.querySelector("[data-variant-select]");
  if (variantSelect) {
    var productRoot = variantSelect.closest("[data-product-root]");
    var price = productRoot && productRoot.querySelector("[data-product-price]");
    var addButton = productRoot && productRoot.querySelector("[data-add-to-cart]");
    variantSelect.addEventListener("change", function () {
      var option = variantSelect.options[variantSelect.selectedIndex];
      var available = option.dataset.available === "true";
      if (price) price.textContent = option.dataset.price;
      if (addButton) {
        addButton.disabled = !available;
        var label = addButton.querySelector("span");
        if (label) label.textContent = available ? "In winkelwagen" : "Uitverkocht";
      }
      if (window.history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.set("variant", option.value);
        window.history.replaceState({}, "", url.toString());
      }
    });
  }

  /* ---- Video (Cellar Club). Twee manieren waarop hij begint:
         1. je klikt op de afspeelknop -> met geluid;
         2. je scrolt hem in beeld -> hij start uit zichzelf.
         Bij 2 mag er van de browser geen geluid uit (Chrome en Safari staan
         geluid alleen toe na een tik van de gebruiker). Daarom proberen we het
         eerst mét, en valt hij anders terug op stil + een knop "tik voor geluid".
         De video staat op preload="none", dus er wordt niets gedownload tot een
         van deze twee gebeurt. ---- */
  document.querySelectorAll("[data-video-player]").forEach(function (frame) {
    var video = frame.querySelector("video");
    var button = frame.querySelector("[data-video-play]");
    var soundButton = frame.querySelector("[data-video-sound]");
    if (!video || !button) return;
    var gestart = false;

    var speelAf = function (magGeluid) {
      gestart = true;
      video.controls = true;
      frame.classList.add("is-playing");
      video.muted = !magGeluid;
      frame.classList.toggle("is-muted", !magGeluid);
      var started = video.play();
      if (started && started.catch) {
        started.catch(function () {
          /* Geweigerd. Met geluid is dat de normale gang van zaken bij automatisch
             starten: opnieuw proberen zonder geluid en de geluidsknop tonen. */
          if (magGeluid) { speelAf(false); return; }
          gestart = false;
          frame.classList.remove("is-playing", "is-muted");
        });
      }
    };

    button.addEventListener("click", function () { speelAf(true); });

    if (soundButton) {
      soundButton.addEventListener("click", function () {
        /* Van voren af aan: de eerste zin is precies waar het om gaat. */
        video.currentTime = 0;
        speelAf(true);
      });
    }

    /* Automatisch openen zodra hij in beeld komt. Niet bij reduced-motion: wie
       beweging uit heeft gezet, wil geen video die uit zichzelf begint. */
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    /* Als het scrollen tot rust komt, schuift de video netjes naar het midden
       van het scherm. Bewust geen slot op de scroll: blijf je doorscrollen, dan
       scrol je gewoon door. */
    var cta = frame.closest(".cellar-video-wrap");
    cta = cta ? cta.querySelector(".feature-cta") : null;
    var parkeer = function () {
      var r = frame.getBoundingClientRect();
      var inBeeld = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (inBeeld < r.height * 0.5) return;              /* al voorbij: met rust laten */
      /* Niet de video alleen centreren maar video plus joinknop: Maarten verwijst
         aan het eind naar "de link hieronder", dus die moet in beeld staan. */
      var onderkant = cta ? cta.getBoundingClientRect().bottom : r.bottom;
      var hoogte = onderkant - r.top;
      var doel = window.scrollY + r.top - (window.innerHeight - hoogte) / 2;
      if (Math.abs(doel - window.scrollY) < 24) return;  /* staat al goed */
      if (lenis) lenis.scrollTo(doel, { duration: 0.8 });
      else window.scrollTo({ top: doel, behavior: "smooth" });
    };
    var rustTimer = null;
    var wachtOpStilstand = function () {
      window.clearTimeout(rustTimer);
      rustTimer = window.setTimeout(function () {
        window.removeEventListener("scroll", wachtOpStilstand);
        parkeer();
      }, 170);
    };

    var waarnemer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || gestart) return;
        waarnemer.disconnect();
        speelAf(true);
        window.addEventListener("scroll", wachtOpStilstand, { passive: true });
        wachtOpStilstand();
      });
    }, { threshold: 0.55 });
    waarnemer.observe(frame);
  });

  /* ---- FAQ-accordion: vloeiend open/dicht via de Web Animations API op de
         <details>-hoogte. Native <details> klapt bij het sluiten altijd hard
         dicht (geen animatie) → dat is de glitch. Hier animeren we beide kanten.
         Bij reduced-motion valt het terug op de standaard directe toggle. ---- */
  document.querySelectorAll(".cellar-faq details, details.cellar-transcript").forEach(function (el) {
    var summary = el.querySelector("summary");
    var content = el.querySelector(".faq-a");
    if (!summary || !content) return;
    var anim = null, closing = false, expanding = false;

    var settle = function (open) {
      el.open = open; anim = null; closing = false; expanding = false;
      el.style.height = ""; el.style.overflow = "";
    };
    var run = function (from, to, open) {
      el.style.overflow = "hidden";
      if (anim) anim.cancel();
      anim = el.animate({ height: [from, to] }, { duration: 340, easing: "cubic-bezier(0.4, 0, 0.2, 1)" });
      anim.onfinish = function () { settle(open); };
      anim.oncancel = function () { closing = false; expanding = false; };
    };
    summary.addEventListener("click", function (e) {
      if (reduceMotion) return; /* native toggle = direct, geen animatie */
      e.preventDefault();
      if (closing || !el.open) {
        el.style.height = el.offsetHeight + "px";
        el.open = true;
        window.requestAnimationFrame(function () {
          expanding = true;
          run(el.offsetHeight + "px", (summary.offsetHeight + content.offsetHeight) + "px", true);
        });
      } else if (expanding || el.open) {
        closing = true;
        run(el.offsetHeight + "px", summary.offsetHeight + "px", false);
      }
    });
  });

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

  // Lenis aan de GSAP-ticker koppelen zodat scroll-animaties synchroon en soepel blijven
  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // GSAP stuurt de reveals zelf aan; CSS-fallback-transition uit zodat die niet meevecht
  gsap.set(".reveal", { transition: "none" });

  // Lazy beelden verschuiven de layout bij laden → triggerposities herberekenen
  document.querySelectorAll("img[loading='lazy']").forEach(function (img) {
    if (!img.complete) img.addEventListener("load", function () { ScrollTrigger.refresh(); }, { once: true });
  });

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
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 }
    });
  }

  // Cellar Club: flessen zweven in verschillende snelheden mee met de scroll (diepte)
  var cellarBottles = document.querySelectorAll(".cellar-bottle[data-parallax]");
  if (cellarBottles.length) {
    cellarBottles.forEach(function (el) {
      gsap.to(el, {
        y: parseFloat(el.dataset.parallax) || 0,
        ease: "none",
        scrollTrigger: { trigger: ".cellar-hero", start: "top top", end: "bottom top", scrub: 0.5 }
      });
    });
  }

  // Cellar Club (v2): storytelling onder de hero
  if (document.querySelector(".cellar-body")) {
    // Haarlijnen onder de nummers tekenen zich van links naar rechts
    gsap.utils.toArray(".value-rule").forEach(function (r) {
      gsap.fromTo(r, { scaleX: 0 }, {
        scaleX: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: r, start: "top 88%", once: true }
      });
    });
    // Tijdlijn-lijn vult zich mee met de scroll
    var stepsEl = document.querySelector(".cellar-steps");
    var prog = document.querySelector(".steps-progress");
    if (stepsEl && prog) {
      gsap.fromTo(prog, { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: stepsEl, start: "top 72%", end: "bottom 78%", scrub: 0.5 }
      });
    }
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

  // Vangnet: alleen wat ná 2,5s nog verborgen is én (vlakbij) in beeld staat, tonen.
  // Below-fold reveals blijven aan ScrollTrigger — die klopt weer na refresh() hierboven.
  window.setTimeout(function () {
    document.querySelectorAll(".reveal").forEach(function (el) {
      if (parseFloat(window.getComputedStyle(el).opacity) < 0.05) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        }
      }
    });
  }, 2500);
})();
