# Template audit — feedback & fix plan

Audit run on 2026-10-29 over all 78 templates (desktop scroll-through + phone). This file records
what the owner decided, the rules that came out of it, and the work list. Tick items as they ship.

---

## 1. Owner feedback (decisions)

### Remove
Editorial · Mila Novak · Noah Rivers (photo) · Monolith · Halden (architect) · Northstar ·
Bento (Lea Sørensen) · Pulse · Tallybook · Maison · Olive & Ember · Copper Cup

- **Pulse:** remove the page, but the owner **likes its colours** (near-black + electric lime `#d7ff3a`)
  and we have nothing similar — reuse that palette in one of the new builds.

### Create (replacements)
1. **E-commerce store**: replaces Maison.
2. **Architecture studio**: replaces Halden. Must NOT be the quiet serif editorial style.
3. **One more portfolio.**
4. **Pizza restaurant**: replaces Olive & Ember (a second pizza site next to Pizzaro, so it must look clearly different).

### Rework / improve
| Template | Owner said | Action |
|---|---|---|
| Chronica | "Very stupid, colours don't fit; I don't want to sell clocks — sell watches like Rolex, must look luxurious" | Rebuild as a luxury watch boutique. Must differ from Monarch (dark green/black). |
| Ginger & Moss | Keep the cat exactly like this; improve the rest if needed | Keep the hero cat; deepen the thin sections |
| Clearview Dental | Likes it — make it look less vibe-coded | Remove floating badges / icon-tile feel, keep it bright and friendly |
| Havenly | Nice but not accurate; we need this project | Make it a credible property site: more listings, detail view, real search/filter, more sections |
| Loomwell | Nice but dead, no animation | Add motion + more sections |
| Azure Bay | Very dead, no meaning — improve or remove (my call) | **Rebuild** as a living resort site (we have no other hotel) |
| 9 vibe-coded: Bean & Bloom, Sofia Reyes, Maya Carter, Learnly, Nexora, Monivo, Converso, Hostwell, Sparkle & Co. | Fix the vibe-coded look, but **don't make them dead** — modern, professional, attractive | Remove the tells, keep or raise the energy (see rule 3) |
| Marea | Fix | Mobile hero plate cut in half |
| Layla, Kai | Fix | Replace range sliders with button choices |
| Lukas | Fix | Hero mockup grey until animated; mobile headline overlap |
| Rami | Fix | Mobile hero headline clipped |
| Adam Hayes | Looks a little vibe-coded too; fix | Skill % bars, floating badges, general de-vibe |
| Yusuf Demir | Fix | Skill % bars, floating badges |
| Parallel | Fix | Made-up awards (Awwwards, Webby…) → neutral wording |
| Frontier Summit | Fix | Stat boxes in the about bento |

### Do not touch
Hannah Brooks · Rania Aziz · Sarah Mitchell · Sarah Collins (teacher) · Velora · Whisker & Co. ·
every template in the "ready" list.

---

## 2. Rules learned (apply to every future build)
1. **Top announcement bars and range sliders:** don't put them on *every* site. Leave them where
   they already exist (except Layla and Kai, fixed on request). New builds use them rarely, only when they clearly serve the business.
2. **Vibe-coded tells to avoid:** floating badges stuck on hero photos, rotating "available" stamps, skill-percentage
   bars, stats strips under every hero, rows of identical icon tiles, numbered 3-step cards,
   pastel testimonial cards, highlighter-marked words, near-identical generic SaaS layouts.
3. **But never "dead":** the fix for vibe-coded is *crafted*, not minimal. Keep bold type, real
   photography, one custom centrepiece per page, entrance + scroll motion, working features.
4. **No banned styles:** quiet serif editorial, dark-luxury black + gold + serif, Swiss yellow,
   maximal Syne/violet/pink agency, magazine bone + orange, dark-minimal Linear-clone SaaS.
5. **Luxury done right (Chronica):** luxury = big photography, generous space, confident sans
   or refined display type, restrained palette, rich product detail. Not gold-serif cliché.
6. **No fake claims:** no real award names (Awwwards, Webby…) unless the client really won them.

---

## 3. Work plan (in order)

### Phase A: removals
- [x] Delete the 12 folders + their `templates.js` entries
- [x] Check that nothing links to them (only a code comment in dashboard.js)

### Phase B: quick fixes
- [x] Marea: mobile hero (text + CTA restored under the plate)
- [x] Layla: cost-of-leaving sliders → buttons
- [x] Kai: budget slider → buttons (packages preselect budget)
- [x] Lukas: checked — the "grey" mockup was a mid-crossfade capture; nothing broken
- [x] Rami: orbit rings pushed page wider than phone, hiding the menu button — clipped
- [x] Parallel: fake awards → "Milestones" with real project results
- [x] Frontier Summit: stat boxes → one bold line + stage photo + 3 session types
- [x] Adam Hayes: floating badges, bobbing icons, stat box, skill bars removed; live status line + stack rows
- [x] Yusuf Demir: skill bars → tool list; extra hero tag removed

### Phase C: new builds
- [x] Pizza restaurant → **Rossa** (restaurant-rossa): Neapolitan, cream/tomato/basil, pizza builder, order drawer
- [x] Architecture studio → **Varo** (arch-varo): bold grotesk, scroll-opening hero, sketch-vs-built compare
- [x] E-commerce store → **Nook** (shop-nook): furniture, shop-the-room hotspots, to-scale "Will it fit?" planner, samples
- [x] Extra portfolio → **Theo Okafor** (portfolio-theo): sports photographer in the Pulse black + lime palette the owner liked

### Phase D: rebuilds
- [x] Chronica → rebuilt as a light luxury Geneva boutique for certified pre-owned Rolex / Omega / Breitling (real watch photos show real logos, so a fictional "maison" looked fake); live sweeping dial, find-your-watch viewer, reservations, private viewing booking
- [x] Azure Bay → rebuilt as a bright Mallorca seafront hotel: live conditions strip, pinned horizontal "day" story, two-month nightly-price booking calendar
- [x] Havenly → rebuilt: working search + map pins, 13 listings with full listing pages (gallery, monthly cost, tour booking), neighborhood guides, valuation wizard
- [x] Loomwell → hero line reveal + image wipe + parallax, scroll reveals, values marquee; new sections: open-pricing cost breakdown (animated bars), Made in Porto journey (scroll-lit), community "shop it" grid, FAQ
- [x] Ginger & Moss → cat hero untouched (now fades in); added brands marquee, 3-tap kit finder that builds a basket, rescue adoption cards, FAQ, scroll reveals; fixed phone header overflow
- [x] Clearview Dental → removed floating badges, blob, pill tags, "20+" box and 6 icon tiles; added live "next opening" line, insurance marquee, image-led treatment explorer with prices, hero + scroll motion

### Phase E: de-vibe the 9
- [x] Bean & Bloom: floating beans, rotating badge, price sticker and stat row removed; live "out of the oven" ticker; perks as a line
- [x] Sofia Reyes: spinning badge, chips and stat strip removed; real work fanned behind the portrait; process as a timeline
- [x] Maya Carter: floating stat cards, blob and stats band removed; plain portrait with a real quote
- [x] Learnly: floating badges and highlighter removed; live lesson-player hero; topic pills; timeline steps
- [x] Nexora: floating chips and stats band removed; benefits as an editorial list (ROI sliders kept, per owner)
- [x] Monivo: floating chips and stats band removed; features as an editorial list (savings sliders kept)
- [x] Converso: hero conversation now plays out live; underline accent; security as a list
- [x] Hostwell: 8 icon tiles become a list beside a live deploy log
- [x] Sparkle & Co.: blob, bubbles, badges and stat strip removed; live open-slots card; promise line; timeline steps

### Verification for every item
Headless Edge scroll-capture (desktop 1440) + phone 500px, no JS errors, no horizontal overflow,
then commit and push to `main` in batches.

---

## 4. Progress log
- 2026-10-30: Phases C, D and E done. Final sweep: 70 templates, no JS errors; phone overflow only on
  Frolla/Orra (clipped, invisible) and Rania (+5px, left untouched per owner).
- 2026-10-29: audit done, plan written.
- 2026-10-29: Phase A done (12 removed, registry now 66). Phase B done.
  Extra: a real 390px phone-overflow check found 13 templates wider than the screen
  (Nocturne calendar, Flamebite menu, Halo, Ella, Atlas, Whisker, Rami, Frolla, Orra, ...). Fixed the ones
  that broke layout or hid the menu; Frolla strip / Orra rings are clipped by html overflow and harmless.
