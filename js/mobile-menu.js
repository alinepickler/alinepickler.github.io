document.getElementById("menu-mobile-btn").onclick = toggleMobileMenu;

function toggleMobileMenu() {
  var button = document.getElementById("menu-mobile-btn");
  var isOpen = document.getElementById("nav-mobile").classList.toggle("show");
  button.getElementsByClassName("hamburger-menu")[0].classList.toggle("change");
  button.setAttribute("aria-expanded", isOpen);
}
