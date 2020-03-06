const navInit = () => {

  const mq = window.matchMedia("(min-width: 850px)");
  const leftMenu = document.querySelector(".nav-left-menu-wrap");
  const rightMenu = document.querySelector(".nav-right-menu-wrap");
  const ham = document.querySelector(".hamburger");
  const user = document.querySelector(".nav-user");
  const darken = document.querySelector(".nav-darken-overlay");

  if (mq.matches) {
    darken.addEventListener("click", function () {
      if (leftMenu.classList.contains('nav-left-menu-active')) {
        leftMenu.classList.remove('nav-left-menu-active');
        ham.classList.remove('is-active');
      }
      if (rightMenu.classList.contains('nav-right-menu-active')) {
        rightMenu.classList.remove('nav-right-menu-active');
        user.classList.remove('nav-user-active');
      }
      darken.classList.remove('nav-darken-overlay-active')
    });

    ham.addEventListener("click", function () {
      leftMenu.classList.toggle('nav-left-menu-active');
      ham.classList.toggle('is-active');
      
      if (!(rightMenu.classList.contains('nav-right-menu-active'))) {
        darken.classList.toggle('nav-darken-overlay-active');
      }
    });

    user.addEventListener("click", function () {
      rightMenu.classList.toggle('nav-right-menu-active');
      user.classList.toggle('nav-user-active');

      if (!(leftMenu.classList.contains('nav-left-menu-active'))) {
        darken.classList.toggle('nav-darken-overlay-active');
      }
    });
  } else {
    
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
  }
}