(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (!toggle || !nav) {
    return;
  }

  var links = nav.querySelectorAll('a[href^="#"]');

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function setCurrent(id) {
    links.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function applyFilter(filter) {
    var block = document.getElementById("directions");
    if (!block || !filter) {
      return;
    }
    block.setAttribute("data-filter", filter);
    block.querySelectorAll("[data-filter-tab]").forEach(function (tab) {
      var on = tab.getAttribute("data-filter-tab") === filter;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      var id = link.getAttribute("href").slice(1);
      if (id) {
        setCurrent(id);
      }
      setOpen(false);
    });
  });

  document.querySelectorAll(".hero__actions [data-filter]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      var block = document.getElementById("directions");
      applyFilter(link.getAttribute("data-filter"));
      setCurrent("directions");
      if (block) {
        event.preventDefault();
        block.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.querySelectorAll("#directions [data-filter-tab]").forEach(function (tab) {
    tab.addEventListener("click", function () {
      applyFilter(tab.getAttribute("data-filter-tab"));
    });
  });

  document.querySelectorAll(".dir-card").forEach(function (card) {
    function activate() {
      card.parentElement.querySelectorAll(".dir-card").forEach(function (item) {
        item.classList.toggle("is-active", item === card);
      });
    }
    card.addEventListener("mouseenter", activate);
    card.addEventListener("click", activate);
    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });

  document.addEventListener("click", function (event) {
    if (!nav.classList.contains("is-open")) {
      return;
    }
    if (event.target.closest(".nav") || event.target.closest(".nav-toggle")) {
      return;
    }
    setOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 980) {
      setOpen(false);
    }
  });

  if ("IntersectionObserver" in window) {
    var sections = [];
    links.forEach(function (link) {
      var section = document.getElementById(link.getAttribute("href").slice(1));
      if (section) {
        sections.push(section);
      }
    });

    if (sections.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setCurrent(entry.target.id);
          }
        });
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 });

      sections.forEach(function (section) {
        observer.observe(section);
      });
    }
  }

  if (window.location.hash.length > 1) {
    setCurrent(window.location.hash.slice(1));
  }

  var logo = document.querySelector(".brand__mark-link");
  if (logo) {
    var syncLogo = function () {
      logo.classList.toggle("is-compact", window.scrollY > 80);
    };
    syncLogo();
    window.addEventListener("scroll", syncLogo, { passive: true });
    logo.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  var route = document.querySelector(".gyms__route");
  if (route) {
    var mapFrame = route.querySelector(".gyms__map");
    var addressLine = route.querySelector(".gyms__address");
    var floorLine = route.querySelector(".gyms__floor");
    var routeLink = route.querySelector(".gyms__route-link");
    var gymTabs = route.querySelectorAll("[data-gym]");

    function showGym(tab) {
      var query = tab.getAttribute("data-query");
      gymTabs.forEach(function (item) {
        var on = item === tab;
        item.classList.toggle("is-active", on);
        item.setAttribute("aria-pressed", on ? "true" : "false");
      });
      addressLine.textContent = tab.getAttribute("data-address") + " (" + tab.getAttribute("data-floor") + ")";
      floorLine.textContent = tab.getAttribute("data-floor");
      mapFrame.title = "Карта: " + tab.textContent.trim();
      mapFrame.src = "https://yandex.ru/map-widget/v1/?text=" + encodeURIComponent(query) + "&z=16";
      routeLink.href = "https://yandex.ru/maps/?rtext=~" + encodeURIComponent(query) + "&rtt=mt";
    }

    gymTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        showGym(tab);
      });
    });
  }
})();
