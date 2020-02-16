const navInit = () => {
  // Set variable names
  const navElement = document.querySelector(".nav-sidebar");
  const hamburgerElement = document.querySelector(".hamburger");

  navElement.addEventListener("mouseenter", function() {
    hamburgerElement.classList.toggle("is-active");
  });
  navElement.addEventListener("mouseleave", function() {
    hamburgerElement.classList.toggle("is-active");
  });
}