// Shows a frame's rendered size as a redline dimension when it is hovered or focused
(function () {
  var frames = document.querySelectorAll(".hero-frame, .work-item, .case-img-box, .case .blueprint");

  for (var i = 0; i < frames.length; i++) {
    frames[i].classList.add("is-measurable");
    frames[i].addEventListener("pointerenter", show);
    frames[i].addEventListener("pointerleave", hide);
    frames[i].addEventListener("focusin", show);
    frames[i].addEventListener("focusout", hide);
  }

  function show() {
    var r = this.getBoundingClientRect();
    this.setAttribute("data-measure", Math.round(r.width) + " × " + Math.round(r.height));
    this.classList.add("is-measuring");
  }

  function hide() {
    this.classList.remove("is-measuring");
  }
})();
