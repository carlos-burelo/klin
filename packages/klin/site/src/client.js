/**
 * JS del sitio (vanilla, sin framework): tema claro/oscuro con memoria.
 * Los charts llegan renderizados del build; sin este archivo todo se ve igual.
 */
(() => {
  const KEY = "klin-theme";
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const label = btn.querySelector("[data-theme-label]");
  function paint() {
    const dark = root.classList.contains("dark");
    btn.setAttribute("aria-pressed", String(dark));
    if (label) label.textContent = dark ? "Claro" : "Oscuro";
  }
  btn.addEventListener("click", () => {
    const dark = !root.classList.contains("dark");
    root.classList.toggle("dark", dark);
    try {
      localStorage.setItem(KEY, dark ? "dark" : "light");
    } catch {
      // Sin almacenamiento: el tema vive solo en la sesión.
    }
    paint();
  });
  paint();
})();
