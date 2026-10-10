"use strict";

document.documentElement.classList.add("js");

function initNavigation() {
  const button = document.querySelector("[data-menu-button]");
  const navigation = document.querySelector("[data-site-nav]");
  if (!button || !navigation) return;

  const closeMenu = () => {
    button.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      button.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

function initHeaderScrollState() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function initRevealAnimations() {
  const elements = [...document.querySelectorAll("[data-reveal]")];
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 }
  );

  elements.forEach((element) => observer.observe(element));
}

function setActiveNavigation() {
  const currentPath = window.location.pathname.replace(/\/$/, "/index.html");
  document.querySelectorAll("[data-site-nav] a").forEach((link) => {
    const linkPath = new URL(link.href, window.location.href).pathname.replace(/\/$/, "/index.html");
    const isArticle = currentPath.includes("/insights/") && linkPath.endsWith("/insights.html");
    if (linkPath === currentPath || isArticle) link.setAttribute("aria-current", "page");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initHeaderScrollState();
  initRevealAnimations();
  setActiveNavigation();
});
