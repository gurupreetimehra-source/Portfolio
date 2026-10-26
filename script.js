const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const mobileMenu = document.getElementById("mobileMenu");
const nav = document.getElementById("nav");
const backToTop = document.getElementById("backToTop");
const navLinks = [...document.querySelectorAll(".nav-link")];

function setTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === "dark";
  themeToggle.innerHTML = `<span class="material-symbols-rounded">${dark ? "light_mode" : "dark_mode"}</span>`;
  themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  document.querySelector('meta[name="theme-color"]').content = dark ? "#101426" : "#f7f8ff";
  try { localStorage.setItem("portfolio-theme", theme); } catch (_) {}
}

let initialTheme = "light";
try { initialTheme = localStorage.getItem("portfolio-theme") || "light"; } catch (_) {}
setTheme(initialTheme);

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

mobileMenu.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  mobileMenu.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.innerHTML = `<span class="material-symbols-rounded">${isOpen ? "close" : "menu"}</span>`;
});

navLinks.forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  mobileMenu.setAttribute("aria-expanded", "false");
  mobileMenu.innerHTML = '<span class="material-symbols-rounded">menu</span>';
}));

const sections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
  sections.forEach(section => observer.observe(section));
}

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 450);
}, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Avoid leaving a mobile navigation menu open when the viewport is resized.
window.addEventListener("resize", () => {
  if (window.innerWidth > 850) {
    nav.classList.remove("open");
    mobileMenu.setAttribute("aria-expanded", "false");
    mobileMenu.innerHTML = '<span class="material-symbols-rounded">menu</span>';
  }
});
