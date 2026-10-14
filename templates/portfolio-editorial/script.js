const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Live clock ---------- */
const clock = document.getElementById("clock");
const tick = () => {
  clock.textContent = new Date().toLocaleTimeString("en-GB", { hour12: false });
};
tick();
setInterval(tick, 1000);

/* ---------- Custom cursor ---------- */
const cursor = document.querySelector(".cursor");
const cursorLabel = cursor.querySelector(".cursor__label");
const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
const pos = { ...mouse };

if (finePointer) {
  addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.querySelectorAll("[data-hover], a").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorLabel.textContent = el.dataset.cursor;
      cursor.classList.add("is-label");
    });
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-label"));
  });
}

/* ---------- Project hover preview ---------- */
const preview = document.querySelector(".preview");
const previewInner = preview.querySelector(".preview__inner");
const previewShape = preview.querySelector(".preview__shape");
const previewTitle = preview.querySelector(".preview__title");
const previewPos = { ...mouse };
previewShape.innerHTML = "<i></i>".repeat(9);

document.querySelectorAll(".project").forEach((project) => {
  project.addEventListener("mouseenter", () => {
    previewInner.style.background = project.dataset.color;
    previewShape.dataset.shape = project.dataset.shape;
    previewTitle.textContent = project.querySelector(".project__name").textContent;
    preview.classList.add("is-visible");
  });
  project.addEventListener("mouseleave", () => preview.classList.remove("is-visible"));
});

/* ---------- Animation loop (cursor + preview easing) ---------- */
const lerp = (a, b, t) => a + (b - a) * t;

function loop() {
  pos.x = lerp(pos.x, mouse.x, 0.22);
  pos.y = lerp(pos.y, mouse.y, 0.22);
  cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;

  const dx = mouse.x - previewPos.x;
  previewPos.x = lerp(previewPos.x, mouse.x, 0.1);
  previewPos.y = lerp(previewPos.y, mouse.y, 0.1);
  const tilt = Math.max(-12, Math.min(12, dx * 0.05));
  preview.style.transform = `translate(${previewPos.x}px, ${previewPos.y}px) translate(-50%, -50%) rotate(${tilt}deg)`;

  requestAnimationFrame(loop);
}
if (finePointer) loop();

/* ---------- Magnetic buttons ---------- */
if (finePointer && !reduceMotion) {
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s, color 0.4s";
      el.style.transform = "";
      setTimeout(() => (el.style.transition = ""), 600);
    });
  });
}

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  revealObserver.observe(el);
  // clear the stagger delay once revealed so hover effects stay snappy
  el.addEventListener("transitionend", () => (el.style.transitionDelay = "0ms"), { once: true });
});

/* ---------- Count-up stats ---------- */
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = reduceMotion ? 0 : 1600;
      const start = performance.now();

      const step = (now) => {
        const p = duration ? Math.min((now - start) / duration, 1) : 1;
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));
