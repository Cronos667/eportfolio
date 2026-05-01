(() => {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    reduceMotion: motionQuery.matches
  };

  document.addEventListener("DOMContentLoaded", () => {
    setYear();
    initHeaderState();
    initSmoothScroll();
    initReveal();
    initActiveNav();
    initKeyboardFocus();
    bindMotionPreference();
  });

  function setYear() {
    const year = document.getElementById("year");

    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  }

  function initHeaderState() {
    const header = document.querySelector(".site-header");

    if (!header) {
      return;
    }

    const sync = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
  }

  function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");

        if (!href || href === "#") {
          return;
        }

        const target = document.querySelector(href);

        if (!target) {
          return;
        }

        event.preventDefault();
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        target.scrollIntoView({
          behavior: state.reduceMotion ? "auto" : "smooth",
          block: "start"
        });
        window.setTimeout(() => target.removeAttribute("tabindex"), 400);
      });
    });
  }

  function initReveal() {
    const items = [...document.querySelectorAll(".reveal")];

    if (!items.length) {
      return;
    }

    if (state.reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 60, 180)}ms`;
      observer.observe(item);
    });
  }

  function initActiveNav() {
    const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

    if (!navLinks.length) {
      return;
    }

    const sections = navLinks
      .map((link) => {
        const id = link.getAttribute("href");
        return id ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    const setCurrent = (id) => {
      navLinks.forEach((link) => {
        link.setAttribute("aria-current", link.getAttribute("href") === id ? "true" : "false");
      });
    };

    setCurrent(navLinks[0].getAttribute("href"));

    if (!sections.length || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (!visibleEntries.length) {
          return;
        }

        const current = visibleEntries.sort(
          (left, right) => right.intersectionRatio - left.intersectionRatio
        )[0];

        setCurrent(`#${current.target.id}`);
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: "-25% 0px -45% 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initKeyboardFocus() {
    const onFirstTab = (event) => {
      if (event.key !== "Tab") {
        return;
      }

      document.documentElement.classList.add("using-keyboard");
      window.removeEventListener("keydown", onFirstTab);
    };

    window.addEventListener("keydown", onFirstTab);
  }

  function bindMotionPreference() {
    const applyMotionPreference = (event) => {
      state.reduceMotion = event.matches;

      if (!state.reduceMotion) {
        return;
      }

      document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
    };

    if ("addEventListener" in motionQuery) {
      motionQuery.addEventListener("change", applyMotionPreference);
      return;
    }

    motionQuery.addListener(applyMotionPreference);
  }
})();
