const navInit = () => {
  // Set variable names
  const navElement = document.querySelector(".nav-sidebar");
  const hamburgerElement = document.querySelector(".hamburger");
  const darkFilter = document.querySelector(".nav-darken-filter");

  navElement.addEventListener("mouseenter", function() {
    hamburgerElement.classList.toggle("is-active");
    darkFilter.style.opacity = "0.25";
  });
  navElement.addEventListener("mouseleave", function() {
    hamburgerElement.classList.toggle("is-active");
    darkFilter.style.opacity = "0";
  });
}