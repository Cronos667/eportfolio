(() => {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    reduceMotion: reduceMotionQuery.matches
  };

  document.addEventListener("DOMContentLoaded", () => {
    setYear();
    initSmoothScroll();
    initReveal();
    initRotator();
    initPointerAura();
    initCursor();
    initMagnetic();
    initTilt();
    initBackground();
    initKeyboardFocus();
  });

  function setYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"], button#ctaExplore').forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        let targetId = element.getAttribute("href") || "#knowledge";
        if (element.id === "ctaExplore") {
          targetId = "#knowledge";
        }

        const target = document.querySelector(targetId);
        if (!target) {
          return;
        }

        target.scrollIntoView({
          behavior: state.reduceMotion ? "auto" : "smooth",
          block: "start"
        });
      });
    });
  }

  function initReveal() {
    const items = [...document.querySelectorAll(".reveal")];
    if (!items.length) {
      return;
    }

    if (state.reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("active"));
      return;
    }

    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 90, 280)}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    items.forEach((item) => observer.observe(item));
  }

  function initRotator() {
    const target = document.getElementById("typed");
    if (!target) {
      return;
    }

    const phrases = [
      "growth systems and digital storytelling.",
      "Layer 2 ecosystems and scalable adoption.",
      "strategy that can actually move people."
    ];

    if (state.reduceMotion) {
      target.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const phrase = phrases[phraseIndex];
      target.textContent = phrase.slice(0, charIndex);

      if (!deleting && charIndex < phrase.length) {
        charIndex += 1;
        window.setTimeout(tick, 52);
        return;
      }

      if (!deleting && charIndex === phrase.length) {
        deleting = true;
        window.setTimeout(tick, 1500);
        return;
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1;
        window.setTimeout(tick, 28);
        return;
      }

      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      window.setTimeout(tick, 220);
    };

    tick();
  }

  function initPointerAura() {
    const root = document.documentElement;
    const update = (x, y) => {
      root.style.setProperty("--pointer-x", `${x}px`);
      root.style.setProperty("--pointer-y", `${y}px`);
    };

    update(window.innerWidth * 0.5, window.innerHeight * 0.22);

    window.addEventListener(
      "pointermove",
      (event) => {
        update(event.clientX, event.clientY);
      },
      { passive: true }
    );
  }

  function initCursor() {
    const cursor = document.getElementById("cursor");
    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    if (!cursor || coarsePointer || state.reduceMotion) {
      document.documentElement.classList.add("no-cursor");
      return;
    }

    let currentX = window.innerWidth * 0.5;
    let currentY = window.innerHeight * 0.5;
    let targetX = currentX;
    let targetY = currentY;

    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      window.requestAnimationFrame(render);
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
      },
      { passive: true }
    );

    document.querySelectorAll("a, button").forEach((element) => {
      element.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
      element.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
    });

    render();
  }

  function initMagnetic() {
    if (state.reduceMotion) {
      return;
    }

    document.querySelectorAll(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const bounds = element.getBoundingClientRect();
        const offsetX = event.clientX - bounds.left - bounds.width / 2;
        const offsetY = event.clientY - bounds.top - bounds.height / 2;
        element.style.setProperty("--magnetic-x", `${offsetX * 0.12}px`);
        element.style.setProperty("--magnetic-y", `${offsetY * 0.12}px`);
      });

      element.addEventListener("pointerleave", () => {
        element.style.setProperty("--magnetic-x", "0px");
        element.style.setProperty("--magnetic-y", "0px");
      });
    });
  }

  function initTilt() {
    if (state.reduceMotion) {
      return;
    }

    document.querySelectorAll("[data-tilt], .tilt-card").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const bounds = element.getBoundingClientRect();
        const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
        const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -12;
        element.style.setProperty("--tilt-x", `${rotateX}deg`);
        element.style.setProperty("--tilt-y", `${rotateY}deg`);
        element.style.setProperty("--tilt-z", "12px");
      });

      element.addEventListener("pointerleave", () => {
        element.style.setProperty("--tilt-x", "0deg");
        element.style.setProperty("--tilt-y", "0deg");
        element.style.setProperty("--tilt-z", "0px");
      });
    });
  }

  function initBackground() {
    const canvas = document.getElementById("bgCanvas");
    if (!canvas || state.reduceMotion) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const pointer = {
      x: window.innerWidth * 0.7,
      y: window.innerHeight * 0.24
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let animationFrame = 0;

    const random = (min, max) => Math.random() * (max - min) + min;

    const createParticles = () => {
      const area = width * height;
      const count = Math.max(54, Math.min(110, Math.floor(area / 26000)));

      particles = Array.from({ length: count }, () => ({
        x: random(0, width),
        y: random(0, height),
        vx: random(-0.18, 0.18),
        vy: random(-0.12, 0.12),
        radius: random(0.8, 2.4),
        twinkle: random(0, Math.PI * 2)
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    };

    const drawParticle = (particle) => {
      const glow = Math.max(10, particle.radius * 9);
      const gradient = context.createRadialGradient(
        particle.x,
        particle.y,
        particle.radius * 0.1,
        particle.x,
        particle.y,
        glow
      );

      gradient.addColorStop(0, "rgba(122, 252, 255, 0.75)");
      gradient.addColorStop(0.5, "rgba(255, 176, 107, 0.12)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      context.beginPath();
      context.fillStyle = gradient;
      context.arc(particle.x, particle.y, glow, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.fillStyle = `rgba(255, 255, 255, ${0.55 + Math.abs(Math.sin(particle.twinkle)) * 0.35})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 150) {
            continue;
          }

          const pointerDistance = Math.min(
            Math.hypot(pointer.x - a.x, pointer.y - a.y),
            Math.hypot(pointer.x - b.x, pointer.y - b.y)
          );
          const alpha = (1 - distance / 150) * (pointerDistance < 220 ? 0.25 : 0.12);

          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.strokeStyle = `rgba(122, 252, 255, ${alpha})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }
    };

    const step = () => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.twinkle += 0.02;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        drawParticle(particle);
      });

      connectParticles();
      animationFrame = window.requestAnimationFrame(step);
    };

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
        return;
      }

      animationFrame = window.requestAnimationFrame(step);
    });

    window.addEventListener(
      "pointermove",
      (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
      },
      { passive: true }
    );

    window.addEventListener("resize", resize);

    resize();
    animationFrame = window.requestAnimationFrame(step);
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
})();
