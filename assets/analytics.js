(function () {
  "use strict";

  var settings = window.KOMOREBI_ANALYTICS || {};
  var measurementId = settings.measurementId || "";
  var isValidId = /^G-[A-Z0-9]{6,}$/.test(measurementId);
  var exclusionKey = "komorebi_ga_exclude";
  var searchParams = new URLSearchParams(window.location.search);
  var excludeRequested = searchParams.get("ga_exclude") === "1";
  var includeRequested = searchParams.get("ga_include") === "1";
  var isExcluded = false;

  try {
    if (includeRequested) {
      window.localStorage.removeItem(exclusionKey);
    } else if (excludeRequested) {
      window.localStorage.setItem(exclusionKey, "1");
    }

    isExcluded = window.localStorage.getItem(exclusionKey) === "1";
  } catch (error) {
    isExcluded = excludeRequested && !includeRequested;
  }

  if (includeRequested) {
    isExcluded = false;
  } else if (excludeRequested) {
    isExcluded = true;
  }

  var analyticsEnabled = isValidId && !isExcluded;

  if (analyticsEnabled) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { anonymize_ip: true });

    var tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(tag);
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-amazon-link]");
    if (!link || !analyticsEnabled || typeof window.gtag !== "function") return;

    window.gtag("event", "amazon_click", {
      book_id: link.dataset.bookId || "unknown",
      book_title: link.dataset.bookTitle || "unknown",
      link_url: link.href,
      transport_type: "beacon"
    });
  });

  var revealItems = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(function (item) { observer.observe(item); });
})();
