var hero = document.querySelector(".hero");
var specButtons = document.querySelectorAll(".spec-btn");

for (var i = 0; i < specButtons.length; i++) {
  specButtons[i].onclick = showView;
}

function showView() {
  var view = this.getAttribute("data-view");
  hero.classList.toggle("is-spec", view === "spec");
  for (var i = 0; i < specButtons.length; i++) {
    var isActive = specButtons[i] === this;
    specButtons[i].classList.toggle("is-active", isActive);
    specButtons[i].setAttribute("aria-pressed", isActive);
  }
}
