// Scroll-triggered motion: soft reveals, hairlines that draw, the Key
// takeaway marker sweep and counting numbers. Only elements that start
// below the fold are prepared, so nothing visible on load is hidden.
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var foldLine = window.innerHeight * 0.92;
  var observer = new IntersectionObserver(onIntersect, { rootMargin: "0px 0px -8% 0px" });

  prepareAll(".home-section, .work-item, .case .blueprint, .takeaway", "m-rise");
  prepareAll(".exp-item, .takeaway, .case [style*='border-top:1px solid var(--color-accent-300)']", "m-line");
  prepareAll(".stat-num", "m-count");

  function prepareAll(selector, type) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.getBoundingClientRect().top < foldLine) continue;
      if (type === "m-rise" && el.parentElement.closest(".m-rise")) continue;
      if (type === "m-line" && parseFloat(getComputedStyle(el).borderTopWidth) === 0) continue;
      if (type === "m-count" && !prepareCount(el)) continue;
      el.classList.add(type, "m-pending");
      observer.observe(el);
    }
  }

  function onIntersect(entries) {
    var batch = 0;
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      var el = entries[i].target;
      observer.unobserve(el);
      reveal(el, batch * 90);
      batch++;
    }
  }

  function reveal(el, delay) {
    if (el.classList.contains("m-count")) {
      var signal = el.closest(".stat-signal");
      swap(el);
      setTimeout(function () {
        countUp(el, function () {
          if (signal) swap(signal);
        });
      }, signal ? 500 : delay);
      return;
    }
    el.style.transitionDelay = delay + "ms";
    swap(el);
    setTimeout(function () {
      el.style.transitionDelay = "";
    }, delay + 1500);
  }

  function swap(el) {
    el.classList.remove("m-pending");
    el.classList.add("m-in");
  }

  // Numbers count up from zero; the value keeps its prefix and suffix
  // (for example "R$" or "kr"), and zero values are left alone
  function prepareCount(el) {
    var node = el.firstChild;
    if (!node || node.nodeType !== 3) return false;
    var match = node.nodeValue.match(/^(\D*)(\d+)(.*)$/);
    if (!match || Number(match[2]) === 0) return false;
    el.countParts = match;
    el.style.width = el.offsetWidth + "px";
    node.nodeValue = match[1] + "0" + match[3];
    var signal = el.closest(".stat-signal");
    if (signal) signal.classList.add("m-pending");
    return true;
  }

  function countUp(el, done) {
    var parts = el.countParts;
    var node = el.firstChild;
    var target = Number(parts[2]);
    var duration = 700 + Math.min(target, 100) * 4;
    var start = performance.now();

    requestAnimationFrame(function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      node.nodeValue = parts[1] + Math.round(target * eased) + parts[3];
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        node.nodeValue = parts[0];
        el.style.width = "";
        done();
      }
    });
  }
})();
