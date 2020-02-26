const homeInit = () => {
  history.scrollRestoration = "manual"
  
  const navHitbox = document.querySelector('.landing-nav-hitbox');
  const navWrapper = document.querySelector('.landing-nav-wrapper');
  const navSwitch = document.querySelector('.landing-nav-switch');
  const slide = document.querySelector('.slide-2');

  navHitbox.addEventListener("click", () => {
    navSwitch.classList.toggle("right-switch-active");
    navWrapper.classList.toggle("right-wrapper-active");
    slide.classList.toggle("slide-right-active");
  });

  window.onscroll = function() {navbarOnScroll()};

  function navbarOnScroll() {
    let navSideBar = document.querySelector('.nav-global');
    let hamburger = document.querySelector('.hamburger');
    let scrollPosition = document.documentElement.scrollTop;
    let clientHeight = document.documentElement.clientHeight;

    if (scrollPosition > clientHeight/2 && navSideBar.classList.contains('screen-mode')) {
      navSideBar.classList.remove('screen-mode');
      hamburger.classList.remove('hamburger-screen-mode');
    } else if (scrollPosition <= clientHeight/2 && !(navSideBar.classList.contains('screen-mode'))) {
      navSideBar.classList.add('screen-mode');
      hamburger.classList.add('hamburger-screen-mode');
    }
  }

  const brycepButton = document.querySelector('#eng-kit-btn-brycep');
  const hyelosButton = document.querySelector('#eng-kit-btn-hyelos');
  const stcButton = document.querySelector('#eng-kit-btn-stc');
  const brycepSlide = document.querySelector('.eng-kit-brycep');
  const hyelosSlide = document.querySelector('.eng-kit-hyelos');
  const stcSlide = document.querySelector('.eng-kit-stc');
  
  brycepButton.addEventListener("click", function() {
    brycepButton.classList.add('eng-kit-btn-focus');
    if (hyelosButton.classList.contains('eng-kit-btn-focus')) {
      hyelosButton.classList.remove('eng-kit-btn-focus');
    } else if (stcButton.classList.contains('eng-kit-btn-focus')) {
      stcButton.classList.remove('eng-kit-btn-focus');
    }
    brycepSlide.style.display = "flex";
    hyelosSlide.style.display = "none";
    stcSlide.style.display = "none";
  });

  hyelosButton.addEventListener("click", function() {
    if (brycepButton.classList.contains('eng-kit-btn-focus')) {
      brycepButton.classList.remove('eng-kit-btn-focus');
    } else if (stcButton.classList.contains('eng-kit-btn-focus')) {
      stcButton.classList.remove('eng-kit-btn-focus');
    }
    hyelosButton.classList.add('eng-kit-btn-focus');
    brycepSlide.style.display = "none";
    hyelosSlide.style.display = "flex";
    stcSlide.style.display = "none";
  });

  stcButton.addEventListener("click", function() {
    if (brycepButton.classList.contains('eng-kit-btn-focus')) {
      brycepButton.classList.remove('eng-kit-btn-focus');
    } else if (hyelosButton.classList.contains('eng-kit-btn-focus')) {
      hyelosButton.classList.remove('eng-kit-btn-focus');
    }
    stcButton.classList.add('eng-kit-btn-focus');
    brycepSlide.style.display = "none";
    hyelosSlide.style.display = "none";
    stcSlide.style.display = "flex";
  });
}



