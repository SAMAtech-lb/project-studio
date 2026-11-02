/* Reads and remembers the SAMA portfolio list.
   Changes made in Forma are kept in this browser until they are saved into portfolio.js.
   If portfolio.js has changed since then, the file wins. */
const SAMA_KEY = "sama-portfolio";
function samaPortfolio() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAMA_KEY));
    if (saved && saved.base === JSON.stringify(SAMA_DEFAULT) && Array.isArray(saved.list)) return saved.list;
  } catch (e) {}
  return SAMA_DEFAULT.slice();
}
function samaRemember(list) {
  try {
    if (JSON.stringify(list) === JSON.stringify(SAMA_DEFAULT)) localStorage.removeItem(SAMA_KEY);
    else localStorage.setItem(SAMA_KEY, JSON.stringify({ base: JSON.stringify(SAMA_DEFAULT), list }));
  } catch (e) {}
}
