const navInit = () => {
  // Set variable names
  const leftMenu = document.querySelector(".nav-left-menu-wrap");
  const rightMenu = document.querySelector(".nav-right-menu-wrap");
  const ham = document.querySelector(".hamburger");
  const user = document.querySelector(".nav-user")

  ham.addEventListener("click", function () {
    leftMenu.classList.toggle('nav-left-menu-active');
    if (rightMenu.classList.contains('nav-right-menu-active')) {
      console.log('hi')
      rightMenu.classList.remove('nav-right-menu-active');
    }
  });

  user.addEventListener("click", function () {
    rightMenu.classList.toggle('nav-right-menu-active');
    if (leftMenu.classList.contains('nav-left-menu-active')) {
      console.log('hi');
      leftMenu.classList.remove('nav-left-menu-active');
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