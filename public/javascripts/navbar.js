const navInit = () => {
  // Set variable names
  const navElement = document.querySelector(".nav-sidebar");
  const hamburgerElement = document.querySelector(".hamburger");
  const darkFilter = document.querySelector(".nav-darken-filter");
    

  function toggleSideMenu() {
    if (hamburgerElement.classList.contains('is-active')) {
      hamburgerElement.classList.remove("is-active");
      darkFilter.style.opacity = "0";
    } else {
      hamburgerElement.classList.add("is-active");
      darkFilter.style.opacity = "0.1";
    }
  }

  navElement.addEventListener("mouseenter", function() {
    if (!hamburgerElement.classList.contains('is-active')) {
      hamburgerElement.classList.add("is-active");
    }
    darkFilter.style.opacity = "0.1";
  });
  navElement.addEventListener("mouseleave", function() {
    if (hamburgerElement.classList.contains('is-active')) {
      hamburgerElement.classList.remove("is-active");
    }
    darkFilter.style.opacity = "0";
  });
  hamburgerElement.addEventListener("onclick", function () {
    toggleSideMenu();
  });
}