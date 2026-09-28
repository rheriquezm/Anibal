/* =========================================================
   Cabaña en Pelluhue · Maule
   ========================================================= */
(function () {
  "use strict";

  var WA_NUMBER = "56984241012";

  /* ---------- Año dinámico ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: fondo al hacer scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 60);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  function closeMenu() {
    navLinks.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
  if (burger) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Hero: pase de diapositivas ---------- */
  var slides = Array.prototype.slice.call(
    document.querySelectorAll("#heroSlides .hero__slide")
  );
  if (slides.length > 1) {
    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove("is-active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("is-active");
    }, 6000);
  }

  /* ---------- Reveal al hacer scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Respaldo: si algo falla, mostrar todo el contenido */
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
    }, 1600);
  });

  /* ---------- Galería: filtros ---------- */
  var filters = document.getElementById("filters");
  var items = Array.prototype.slice.call(
    document.querySelectorAll("#gallery .g-item")
  );

  if (filters) {
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      filters.querySelectorAll(".filter").forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");

      var cat = btn.getAttribute("data-filter");
      items.forEach(function (item) {
        var show = cat === "all" || item.getAttribute("data-cat") === cat;
        item.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCaption = document.getElementById("lbCaption");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");

  var currentList = [];
  var currentIndex = 0;

  function visibleItems() {
    return items.filter(function (it) {
      return !it.classList.contains("is-hidden");
    });
  }

  function show(index) {
    if (!currentList.length) return;
    currentIndex = (index + currentList.length) % currentList.length;
    var fig = currentList[currentIndex];
    lbImg.src = fig.getAttribute("data-src");
    lbImg.alt = fig.getAttribute("data-caption") || "";
    lbCaption.textContent = fig.getAttribute("data-caption") || "";
  }

  function openLightbox(fig) {
    currentList = visibleItems();
    currentIndex = currentList.indexOf(fig);
    if (currentIndex < 0) currentIndex = 0;
    show(currentIndex);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  items.forEach(function (fig) {
    fig.addEventListener("click", function () { openLightbox(fig); });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) lbPrev.addEventListener("click", function () { show(currentIndex - 1); });
  if (lbNext) lbNext.addEventListener("click", function () { show(currentIndex + 1); });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
  });

  /* ---------- Formulario -> WhatsApp ---------- */
  var form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nombre = (document.getElementById("fNombre").value || "").trim();
      var desde = document.getElementById("fDesde").value;
      var hasta = document.getElementById("fHasta").value;
      var personas = document.getElementById("fPersonas").value;
      var mensaje = (document.getElementById("fMensaje").value || "").trim();

      if (!nombre) {
        document.getElementById("fNombre").focus();
        alert("Por favor, cuéntanos tu nombre.");
        return;
      }

      var lineas = ["Hola, quiero consultar por la cabaña en Pelluhue."];
      lineas.push("Nombre: " + nombre);
      if (desde || hasta) {
        lineas.push("Fechas: " + (desde || "?") + " al " + (hasta || "?"));
      }
      if (personas) lineas.push("Huéspedes: " + personas);
      if (mensaje) lineas.push("Mensaje: " + mensaje);

      var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lineas.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }
})();
