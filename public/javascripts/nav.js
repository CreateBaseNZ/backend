const navInit = () => {
  // Set variable names
  const leftMenu = document.querySelector(".nav-left-menu-wrap");
  const rightMenu = document.querySelector(".nav-right-menu-wrap");
  const ham = document.querySelector(".hamburger");
  const user = document.querySelector(".nav-user")

  ham.addEventListener("click", function () {
    leftMenu.classList.toggle('nav-left-menu-active');
    ham.classList.toggle('is-active');
    if (rightMenu.classList.contains('nav-right-menu-active')) {
      rightMenu.classList.remove('nav-right-menu-active');
      user.classList.remove('nav-user-active');
    }
  });

  user.addEventListener("click", function () {
    rightMenu.classList.toggle('nav-right-menu-active');
    user.classList.toggle('nav-user-active');
    if (leftMenu.classList.contains('nav-left-menu-active')) {
      leftMenu.classList.remove('nav-left-menu-active');
      ham.classList.remove('is-active');
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