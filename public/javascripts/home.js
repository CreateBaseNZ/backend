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

  const navSideBar = document.querySelector('.nav-global');
  const hamburger = document.querySelector('.hamburger');

  window.onscroll = function() {navbarOnScroll()};

  const brycepButton = document.querySelector('#eng-kit-btn-brycep');
  const hyelosButton = document.querySelector('#eng-kit-btn-hyelos');
  const stcButton = document.querySelector('#eng-kit-btn-stc');
  const brycepSlide = document.querySelector('.eng-kit-brycep');
  const hyelosSlide = document.querySelector('.eng-kit-hyelos');
  const stcSlide = document.querySelector('.eng-kit-stc');
  let firstLoad = true;
  let activeSlide = brycepSlide;
  let activeButton = brycepButton;
  
  brycepButton.addEventListener("click", function() {
    activeSlide.style.display = 'none'
    brycepSlide.style.display = 'flex';
    activeSlide = brycepSlide;

    activeButton.classList.remove('eng-kit-btn-focus');
    brycepButton.classList.add('eng-kit-btn-focus');
    activeButton = brycepButton;
  });

  hyelosButton.addEventListener("click", function() {
    activeSlide.style.display = 'none'
    hyelosSlide.style.display = 'flex';
    activeSlide = hyelosSlide;

    activeButton.classList.remove('eng-kit-btn-focus');
    hyelosButton.classList.add('eng-kit-btn-focus');
    activeButton = hyelosButton;
  });

  stcButton.addEventListener("click", function() {
    activeSlide.style.display = 'none'
    stcSlide.style.display = 'flex';
    activeSlide = stcSlide;

    activeButton.classList.remove('eng-kit-btn-focus');
    stcButton.classList.add('eng-kit-btn-focus');
    activeButton = stcButton;
  });

  function navbarOnScroll() {
    let scrollPosition = document.documentElement.scrollTop;
    let clientHeight = document.documentElement.clientHeight;

    if (scrollPosition > clientHeight/2 && navSideBar.classList.contains('screen-mode')) {
      navSideBar.classList.remove('screen-mode');
      hamburger.classList.remove('hamburger-screen-mode');
    } else if (scrollPosition <= clientHeight/2 && !(navSideBar.classList.contains('screen-mode'))) {
      navSideBar.classList.add('screen-mode');
      hamburger.classList.add('hamburger-screen-mode');
    }

    if (scrollPosition > clientHeight/2 && firstLoad) {
      activeSlide.style.display = "flex";
      activeButton.classList.add('eng-kit-btn-focus');
      firstLoad = false;
    } else if (scrollPosition == 0) {
      activeSlide.style.display = 'none';
      activeButton.classList.remove('eng-kit-btn-focus');
      firstLoad = true;
    }
    
  }
}



