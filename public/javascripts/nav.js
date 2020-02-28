const navInit = () => {
  // Set variable names
  const leftMenu = document.querySelector(".nav-left-menu-wrap");
  const rightMenu = document.querySelector(".nav-right-menu");
  const ham = document.querySelector(".hamburger");

  ham.addEventListener("click", function () {
    console.log('hi');
    leftMenu.classList.toggle('nav-left-menu-active');
    if (rightMenu.classList.contains('.nav-left-menu-active')) {
      rightMenu.classList.remove('.nav-right-menu-active');
    }
  });

  // navElement.addEventListener("mouseenter", function() {
  //   if (!hamburgerElement.classList.contains('is-active')) {
  //     hamburgerElement.classList.add("is-active");
  //   }
  //   darkFilter.style.opacity = "0.1";
  // });
  // navElement.addEventListener("mouseleave", function() {
  //   if (hamburgerElement.classList.contains('is-active')) {
  //     hamburgerElement.classList.remove("is-active");
  //   }
  //   darkFilter.style.opacity = "0";
  // });
}