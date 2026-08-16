/* ==========================================================================
   Alpha Omega Catering & Idly Center — Main JavaScript
   Vanilla JS: sticky header, mobile menu, smooth scroll, scroll animations,
   counters, back-to-top, form validation.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* ---------------- Sticky header shadow on scroll ---------------- */
  var header = document.querySelector(".site-header");
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  /* ---------------- Mobile hamburger menu ---------------- */
  var hamburger = document.querySelector(".hamburger");
  var navMenu = document.querySelector(".nav-menu");
  var navOverlay = document.querySelector(".nav-overlay");

  function closeMobileMenu() {
    hamburger.classList.remove("is-active");
    navMenu.classList.remove("is-open");
    if (navOverlay) navOverlay.classList.remove("is-visible");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("mobile-menu-open");
  }

  function toggleMobileMenu() {
    var isOpen = navMenu.classList.toggle("is-open");
    hamburger.classList.toggle("is-active", isOpen);
    if (navOverlay) navOverlay.classList.toggle("is-visible", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("mobile-menu-open", isOpen);
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", toggleMobileMenu);
    if (navOverlay) navOverlay.addEventListener("click", closeMobileMenu);

    /* Mobile dropdown toggle (About / Menu sub-items) */
    document.querySelectorAll(".has-dropdown > a").forEach(function (link) {
      link.addEventListener("click", function (e) {
        if (window.innerWidth <= 991) {
          var parent = link.closest(".has-dropdown");
          var expanded = parent.classList.contains("is-open");
          if (!expanded) {
            e.preventDefault();
            parent.classList.add("is-open");
          }
        }
      });
    });

    /* Close menu when a nav link is clicked (mobile) */
    navMenu.querySelectorAll("a:not(.has-dropdown > a)").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 991) closeMobileMenu();
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 991) closeMobileMenu();
    });
  }

  /* ---------------- Smooth scroll for in-page anchors ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var headerHeight = header ? header.offsetHeight : 0;
          var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      }
    });
  });

  /* ---------------- Scroll reveal animations (fade in / slide up) ---------------- */
  var animatedEls = document.querySelectorAll("[data-animate]");
  if ("IntersectionObserver" in window && animatedEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.getAttribute("data-delay") || 0;
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, Number(delay));
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    animatedEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    animatedEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------- Counter animation ---------------- */
  var counters = document.querySelectorAll("[data-counter]");
  if (counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-counter"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1500;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = Math.floor(progress * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  /* ---------------- Back to top button ---------------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 400) {
          backToTop.classList.add("is-visible");
        } else {
          backToTop.classList.remove("is-visible");
        }
      },
      { passive: true }
    );
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Active nav link based on current page ---------------- */
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });

  /* ---------------- Form validation (Contact / Career / Newsletter / Inquiry) ---------------- */
  document.querySelectorAll("form[data-validate]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll(".form-control[required]").forEach(function (field) {
        var group = field.closest(".form-group");
        var fieldValid = field.checkValidity();
        if (!fieldValid) valid = false;
        if (group) group.classList.toggle("was-validated-group", !fieldValid);
        field.classList.toggle("is-invalid", !fieldValid);
      });

      var successMsg = form.querySelector(".form-success");

      if (valid) {
        if (successMsg) {
          successMsg.classList.add("show");
          successMsg.setAttribute("role", "status");
        }
        form.reset();
        form.querySelectorAll(".is-invalid").forEach(function (f) {
          f.classList.remove("is-invalid");
        });
      } else if (successMsg) {
        successMsg.classList.remove("show");
      }
    });

    /* Live validation on blur */
    form.querySelectorAll(".form-control[required]").forEach(function (field) {
      field.addEventListener("blur", function () {
        var group = field.closest(".form-group");
        var fieldValid = field.checkValidity();
        field.classList.toggle("is-invalid", !fieldValid);
        if (group) group.classList.toggle("was-validated-group", !fieldValid);
      });
    });
  });
});
