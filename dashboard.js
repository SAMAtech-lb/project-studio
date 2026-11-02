const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const state = {
  category: "All",
  status: "all",
  query: "",
  sort: "new",
  view: localStorage.getItem("forma-view") || "grid",
  device: "desktop",
  current: -1, // index into the live list while the viewer is open
};

const CATEGORIES = ["All", ...new Set(TEMPLATES.map((t) => t.category))];
const LIVE = TEMPLATES.filter((t) => t.status === "live");
const PREVIEW_WIDTH = 1440;

/* ---------- Sidebar categories ---------- */
function renderCategories() {
  $("#cats").innerHTML = CATEGORIES.map((cat) => {
    const count = cat === "All" ? TEMPLATES.length : TEMPLATES.filter((t) => t.category === cat).length;
    return `<button class="cat ${cat === state.category ? "on" : ""}" data-cat="${cat}">
      <span>${cat === "All" ? "All templates" : plural(cat)}</span>
      <span class="cat__count">${count}</span>
    </button>`;
  }).join("");
}

const plural = (cat) => (["E-commerce", "Business"].includes(cat) ? cat : cat + "s");

/* ---------- Filtering ---------- */
function filtered() {
  const q = state.query.trim().toLowerCase();
  const list = TEMPLATES.filter((t) => {
    if (state.category !== "All" && t.category !== state.category) return false;
    if (state.status === "sama") { if (!sama.includes(t.id)) return false; }
    else if (state.status !== "all" && t.status !== state.status) return false;
    if (!q) return true;
    return [t.name, t.category, t.description, ...t.tags].join(" ").toLowerCase().includes(q);
  });

  const sorters = {
    new: (a, b) => b.added.localeCompare(a.added),
    az: (a, b) => a.name.localeCompare(b.name),
    cat: (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
  };
  // live templates always come first so the gallery leads with real work
  return list.sort((a, b) => (a.status === b.status ? sorters[state.sort](a, b) : a.status === "live" ? -1 : 1));
}

/* ---------- SAMA portfolio ---------- */
let sama = samaPortfolio().filter((id) => TEMPLATES.some((t) => t.id === id));
let samaSaved = JSON.stringify(SAMA_DEFAULT);
const pfLabel = (id) => (sama.includes(id) ? "Remove from portfolio" : "Add to portfolio");
const pfRank = (id) => (sama.includes(id) ? `<b>#${sama.indexOf(id) + 1}</b> on SAMA` : "Not on SAMA");
const pfButton = (id) => `<div class="pf-row"><span class="pf-rank" data-pfrank="${id}">${pfRank(id)}</span><button class="pf-btn ${sama.includes(id) ? "is-on" : ""}" data-pf="${id}" aria-pressed="${sama.includes(id)}">${pfLabel(id)}</button></div>`;

function syncPortfolio() {
  $$("[data-pf]").forEach((b) => {
    const on = sama.includes(b.dataset.pf);
    b.textContent = pfLabel(b.dataset.pf);
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", on);
  });
  $$("[data-pfrank]").forEach((el) => { el.innerHTML = pfRank(el.dataset.pfrank); });
  const unsaved = JSON.stringify(sama) !== samaSaved;
  $("#pfCount").textContent = sama.length;
  $("#pfCount").classList.toggle("over", sama.length !== 30);
  $("#pfSave").hidden = !unsaved;
  $("#pfNote").textContent = unsaved
    ? "Showing on SAMA in this browser. Save to publish it for visitors."
    : "SAMA is up to date.";
}

function togglePortfolio(id) {
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) return;
  const adding = !sama.includes(id);
  sama = adding ? [...sama, id] : sama.filter((x) => x !== id);
  samaRemember(sama);
  syncPortfolio();
  if (state.status === "sama") renderGrid();
  if (adding && sama.length > 30) toast(`${t.name} added at #${sama.length}. That's over your top 30, so consider removing one.`);
  else toast(`${t.name} ${adding ? `added to SAMA at #${sama.length}` : "removed from SAMA"}`);
}

function portfolioFile() {
  return `/* Projects on the SAMA portfolio, best first. Forma's "Save to website" button rewrites this file. */\nconst SAMA_DEFAULT = [\n${sama.map((id) => `  "${id}",\n`).join("")}];\n`;
}

async function savePortfolio() {
  const text = portfolioFile();
  if (window.showSaveFilePicker) {
    try {
      const handle = await showSaveFilePicker({ suggestedName: "portfolio.js", types: [{ description: "JavaScript", accept: { "text/javascript": [".js"] } }] });
      const file = await handle.createWritable();
      await file.write(text);
      await file.close();
      samaSaved = JSON.stringify(sama);
      syncPortfolio();
      toast("Saved. Choose the portfolio.js in your studio folder, then publish it with the site.");
      return;
    } catch (e) {
      if (e.name === "AbortError") return;
    }
  }
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([text], { type: "text/javascript" }));
  link.download = "portfolio.js";
  link.click();
  URL.revokeObjectURL(link.href);
  toast("Downloaded portfolio.js. Replace the one in your studio folder with it.");
}

/* ---------- Cards ---------- */
function cardHTML(t, i) {
  const live = t.status === "live";
  const dots = t.palette.map((c) => `<i style="background:${c}"></i>`).join("");
  const tags = t.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");

  const thumb = live
    ? `<iframe data-src="${t.path}?nointro" title="${t.name} thumbnail" loading="lazy" tabindex="-1" aria-hidden="true"></iframe>
       <div class="thumb__overlay"><span>Preview →</span></div>`
    : `<div class="placeholder" style="background:${t.palette[0]};color:${t.palette[1]}">
         <div class="shape" style="background:${t.palette[2]}"></div>
         <div class="bars"><i style="width:60px;background:${t.palette[1]}"></i><i style="width:40px;background:${t.palette[1]}"></i></div>
         <b>${t.name}</b>
       </div>`;

  return `<article class="card card--${t.status}" style="animation-delay:${i * 60}ms"
      ${live ? `data-id="${t.id}" tabindex="0" role="button" aria-label="Preview ${t.name}"` : ""}>
    <div class="thumb">
      <span class="status ${live ? "" : "status--soon"}"><i></i>${live ? "Live" : "In progress"}</span>
      ${thumb}
    </div>
    <div class="card__meta">
      <h3>${t.name}</h3>
      <div class="dots">${dots}</div>
      <span class="mono">${t.category}</span>
      <div class="card__tags">${tags}</div>
      ${live ? pfButton(t.id) : ""}
    </div>
  </article>`;
}

function renderGrid() {
  const list = filtered();
  const grid = $("#grid");
  grid.classList.toggle("is-list", state.view === "list");
  grid.innerHTML = list.map(cardHTML).join("");
  $("#empty").hidden = list.length > 0;

  $("#resultsLabel").textContent =
    (state.category === "All" ? "All templates" : plural(state.category)) +
    (state.query ? ` · "${state.query}"` : "");
  $("#resultsCount").textContent = `${list.length} result${list.length === 1 ? "" : "s"}`;

  grid.querySelectorAll(".thumb iframe").forEach((frame) => thumbObserver.observe(frame));
  grid.querySelectorAll(".thumb").forEach((thumb) => resizeObserver.observe(thumb));
}

/* Lazy-load thumbnails only when they scroll into view */
const thumbObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const frame = entry.target;
      frame.src = frame.dataset.src;
      frame.addEventListener("load", () => frame.classList.add("ready"), { once: true });
      thumbObserver.unobserve(frame);
    });
  },
  { rootMargin: "200px" }
);

/* Scale the 1440px-wide preview down to whatever size the card is */
const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const frame = entry.target.querySelector("iframe");
    if (frame) frame.style.transform = `scale(${entry.contentRect.width / PREVIEW_WIDTH})`;
  });
});

/* ---------- Viewer ---------- */
function openViewer(id, push = true) {
  const index = LIVE.findIndex((t) => t.id === id);
  if (index === -1) return;
  state.current = index;
  const t = LIVE[index];

  $("#viewer").hidden = false;
  document.body.classList.add("locked");

  $("#loader").classList.remove("done");
  $("#frame").src = t.path;
  $("#openNew").href = t.path;

  $("#vName").textContent = t.name;
  $("#vCat").textContent = t.category;
  $("#vIndex").textContent = `${String(index + 1).padStart(2, "0")} / ${String(LIVE.length).padStart(2, "0")}`;

  $("#iName").textContent = t.name;
  $("#iDesc").textContent = t.description;
  $("#iCat").textContent = t.category;
  $("#iFonts").textContent = t.fonts;
  $("#iStack").textContent = t.stack;
  $("#iPalette").innerHTML = t.palette.map((c) => `<span style="background:${c}" data-hex="${c}"></span>`).join("");
  $("#iTags").innerHTML = t.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
  $("#vPf").dataset.pf = t.id;
  syncPortfolio();
  $("#iCta").href = `mailto:hello@forma.studio?subject=${encodeURIComponent(`I'm interested in the ${t.name} template`)}`;

  if (push) history.pushState(null, "", `#/preview/${t.id}`);
}

function closeViewer(push = true) {
  $("#viewer").hidden = true;
  $("#frame").src = "about:blank";
  document.body.classList.remove("locked");
  state.current = -1;
  if (push) history.pushState(null, "", location.pathname);
}

function step(dir) {
  if (state.current === -1) return;
  const next = (state.current + dir + LIVE.length) % LIVE.length;
  openViewer(LIVE[next].id, false);
  history.replaceState(null, "", `#/preview/${LIVE[next].id}`);
}

function setDevice(device) {
  state.device = device;
  $("#device").dataset.device = device;
  $$("#devices button").forEach((b) => b.classList.toggle("on", b.dataset.device === device));
}

/* ---------- Routing (deep links like #/preview/landing-pulse) ---------- */
function route() {
  const match = location.hash.match(/^#\/preview\/(.+)$/);
  if (match) openViewer(match[1], false);
  else if (!$("#viewer").hidden) closeViewer(false);
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------- Events ---------- */
$("#cats").addEventListener("click", (e) => {
  const btn = e.target.closest(".cat");
  if (!btn) return;
  state.category = btn.dataset.cat;
  renderCategories();
  renderGrid();
  $("#side").classList.remove("open");
});

$("#statusFilter").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  state.status = btn.dataset.status;
  $$("#statusFilter .chip").forEach((c) => c.classList.toggle("on", c === btn));
  renderGrid();
});

$("#search").addEventListener("input", (e) => {
  state.query = e.target.value;
  renderGrid();
});

$("#sort").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderGrid();
});

$("#viewToggle").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  state.view = btn.dataset.view;
  localStorage.setItem("forma-view", state.view);
  $$("#viewToggle button").forEach((b) => b.classList.toggle("on", b === btn));
  renderGrid();
});

$("#grid").addEventListener("click", (e) => {
  const pf = e.target.closest("[data-pf]");
  if (pf) { togglePortfolio(pf.dataset.pf); return; }
  const card = e.target.closest(".card");
  if (!card) return;
  if (card.dataset.id) openViewer(card.dataset.id);
  else toast("This template is still in the oven 🔥");
});

$("#grid").addEventListener("keydown", (e) => {
  if (e.target.closest("[data-pf]")) return;
  const card = e.target.closest(".card--live");
  if (card && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    openViewer(card.dataset.id);
  }
});

$("#vPf").addEventListener("click", (e) => togglePortfolio(e.currentTarget.dataset.pf));
$("#pfSave").addEventListener("click", savePortfolio);
$("#menuBtn").addEventListener("click", () => $("#side").classList.toggle("open"));
$("#closeViewer").addEventListener("click", () => closeViewer());
$("#prevBtn").addEventListener("click", () => step(-1));
$("#nextBtn").addEventListener("click", () => step(1));
$("#devices").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) setDevice(btn.dataset.device);
});
$("#infoBtn").addEventListener("click", () => {
  $("#info").classList.toggle("open");
  $("#infoBtn").classList.toggle("on");
});
$("#frame").addEventListener("load", () => $("#loader").classList.add("done"));

document.addEventListener("keydown", (e) => {
  const typing = ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName);
  const viewerOpen = !$("#viewer").hidden;

  if (e.key === "/" && !typing && !viewerOpen) {
    e.preventDefault();
    $("#search").focus();
  } else if (viewerOpen && e.key === "Escape") {
    closeViewer();
  } else if (viewerOpen && e.key === "ArrowRight") {
    step(1);
  } else if (viewerOpen && e.key === "ArrowLeft") {
    step(-1);
  }
});

window.addEventListener("popstate", route);

/* ---------- Init ---------- */
$("#countLive").textContent = LIVE.length;
$$("#viewToggle button").forEach((b) => b.classList.toggle("on", b.dataset.view === state.view));
renderCategories();
renderGrid();
syncPortfolio();
setDevice("desktop");
route();
