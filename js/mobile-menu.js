document.getElementById("menu-mobile-btn").onclick = toggleMobileMenu;

function toggleMobileMenu() {
  document.getElementById("nav-mobile").classList.toggle("show");
  document.getElementById("menu-mobile-btn")
    .getElementsByClassName("hamburger-menu")[0].classList.toggle("change");
}
