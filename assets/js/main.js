/* SUPP360 — site interactions (no dependencies) */
(function () {
  "use strict";

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
  }

  /* ---- Services dropdown ---- */
  var items = document.querySelectorAll(".nav-item");
  Array.prototype.forEach.call(items, function (item) {
    var btn = item.querySelector("button");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    item.addEventListener("mouseenter", function () {
      if (window.matchMedia("(min-width:901px)").matches) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });

    item.addEventListener("mouseleave", function () {
      if (window.matchMedia("(min-width:901px)").matches) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.addEventListener("click", function () {
    Array.prototype.forEach.call(items, function (item) {
      item.classList.remove("is-open");
      var btn = item.querySelector("button");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    Array.prototype.forEach.call(items, function (item) {
      item.classList.remove("is-open");
    });
    if (nav && nav.classList.contains("is-open")) {
      closeNav();
      if (toggle) toggle.focus();
    }
  });

  /* ---- Tabbed service switcher ---- */
  var tabs = document.querySelectorAll(".tab");
  Array.prototype.forEach.call(tabs, function (tab) {
    tab.addEventListener("click", function () {
      var group = tab.closest(".tab-group") || document;
      var targetId = tab.getAttribute("aria-controls");

      Array.prototype.forEach.call(group.querySelectorAll(".tab"), function (t) {
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });
      Array.prototype.forEach.call(group.querySelectorAll(".panel"), function (p) {
        p.classList.toggle("is-active", p.id === targetId);
      });
    });
  });

  /* ---- Current year ---- */
  var years = document.querySelectorAll("[data-year]");
  for (var i = 0; i < years.length; i++) {
    years[i].textContent = String(Math.max(new Date().getFullYear(), 2026));
  }

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  if (!("IntersectionObserver" in window)) {
    for (var k = 0; k < reveals.length; k++) reveals[k].classList.add("is-in");
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  for (var j = 0; j < reveals.length; j++) io.observe(reveals[j]);
})();
