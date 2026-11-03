(function () {
  var hero = document.querySelector(".hero");
  var frame = document.querySelector(".hero-frame");
  var toggle = document.querySelector(".spec-toggle");
  var specButtons = document.querySelectorAll(".spec-btn");

  for (var i = 0; i < specButtons.length; i++) {
    specButtons[i].onclick = function () {
      stopDemo();
      setView(this.getAttribute("data-view"));
    };
  }

  function setView(view) {
    hero.classList.toggle("is-spec", view === "spec");
    for (var i = 0; i < specButtons.length; i++) {
      var isActive = specButtons[i].getAttribute("data-view") === view;
      specButtons[i].classList.toggle("is-active", isActive);
      specButtons[i].setAttribute("aria-pressed", isActive);
    }
    moveSlider();
  }

  // Places the sliding block over the active button. The first placement
  // (and any after a resize or the fonts loading) happens without animation.
  function moveSlider(instant) {
    var active = toggle.querySelector(".spec-btn.is-active");
    if (!active) return;
    if (instant) toggle.classList.add("is-measuring");
    // The block also covers the toggle's border, so offsets include it
    var edge = toggle.clientLeft;
    var left = active.offsetLeft + edge;
    var right = toggle.clientWidth - active.offsetLeft - active.offsetWidth + edge;
    mask.style.clipPath = "inset(0 " + right + "px 0 " + left + "px)";
    if (instant) {
      toggle.getBoundingClientRect();
      toggle.classList.remove("is-measuring");
    }
  }

  function placeSlider() {
    alignMaskLabels();
    moveSlider(true);
  }

  // Light copies of the labels inside the sliding block, lined up with the
  // real buttons
  var mask = document.createElement("span");
  var maskLabels = [];
  mask.className = "spec-mask";
  mask.setAttribute("aria-hidden", "true");
  for (var m = 0; m < specButtons.length; m++) {
    var label = document.createElement("span");
    label.className = "spec-mask-label";
    label.textContent = specButtons[m].textContent;
    mask.appendChild(label);
    maskLabels.push(label);
  }
  toggle.appendChild(mask);

  function alignMaskLabels() {
    for (var i = 0; i < specButtons.length; i++) {
      var border = parseFloat(getComputedStyle(specButtons[i]).borderLeftWidth) || 0;
      maskLabels[i].style.left = specButtons[i].offsetLeft + border + toggle.clientLeft + "px";
      maskLabels[i].style.width = specButtons[i].offsetWidth - border + "px";
    }
  }

  toggle.classList.add("has-slider");
  placeSlider();
  window.addEventListener("resize", placeSlider);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeSlider);

  // Automatic demo: once per visit, after the page settles, the toggle
  // switches to Spec and stays there, so the visitor can switch back to UI.
  // It only starts while the screen is in view and the tab is in front, never
  // starts once the visitor has reached for the toggle, and does not run at
  // all when reduced motion is requested.
  var START_DELAY = 1600;
  var STORAGE_KEY = "spec-demo-played";

  var state = "waiting"; // waiting, done
  var timers = [];
  var inView = false;

  if (!shouldRunDemo()) {
    state = "done";
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    inView = entries[0].intersectionRatio >= 0.6;
    update();
  }, { threshold: [0, 0.6] });
  observer.observe(frame);

  document.addEventListener("visibilitychange", update);
  toggle.addEventListener("pointerenter", onInteract);
  toggle.addEventListener("focusin", onInteract);

  function shouldRunDemo() {
    if (!("IntersectionObserver" in window)) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try {
      return !window.sessionStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return true;
    }
  }

  function canPlay() {
    return inView && document.visibilityState === "visible";
  }

  function update() {
    if (state === "done") return;
    clearTimers();
    if (canPlay()) later(play, START_DELAY);
  }

  function play() {
    remember();
    setView("spec");
    finish();
  }

  function onInteract() {
    remember();
    stopDemo();
  }

  function stopDemo() {
    if (state === "done") return;
    finish();
  }

  function finish() {
    state = "done";
    clearTimers();
    observer.disconnect();
    document.removeEventListener("visibilitychange", update);
    toggle.removeEventListener("pointerenter", onInteract);
    toggle.removeEventListener("focusin", onInteract);
  }

  function remember() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {}
  }

  function later(fn, ms) {
    timers.push(setTimeout(fn, ms));
  }

  function clearTimers() {
    while (timers.length) clearTimeout(timers.pop());
  }
})();
