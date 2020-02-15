const nav = document.querySelector(".nav-sidebar");
const hamburger = document.querySelector(".hamburger");

nav.addEventListener("mouseenter", function() {
  hamburger.classList.toggle("is-active");
});
nav.addEventListener("mouseleave", function() {
  hamburger.classList.toggle("is-active");
});