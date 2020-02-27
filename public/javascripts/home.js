const homeInit = () => {
  history.scrollRestoration = "manual"

  const navSideBar = document.querySelector('.nav-global');
  const hamburger = document.querySelector('.hamburger');

  const landingCarousel = document.querySelector('.landing-carousel');
  const landing1 = document.querySelector('#landing-1');
  const landing2 = document.querySelector('#landing-2');
  const landing3 = document.querySelector('#landing-3');
  const landingBtn1 = document.querySelector('#landing-btn-1');
  const landingBtn2 = document.querySelector('#landing-btn-2');
  const landingBtn3 = document.querySelector('#landing-btn-3');

  function slide1Click() {
    if (landingBtn2.classList.contains('landing-slide-nav-btn-focus')) {
      landing1.classList.remove('landing-slide-left');
      landing2.classList.remove('landing-slide-middle');
      landing3.classList.remove('landing-slide-right');
      landing1.classList.add('landing-slide-middle');
      landing2.classList.add('landing-slide-right');
      landingCarousel.style.marginLeft = "150vmax";
      landingBtn2.classList.remove('landing-slide-nav-btn-focus');
      landingBtn1.classList.add('landing-slide-nav-btn-focus');
    } else if (landingBtn3.classList.contains('landing-slide-nav-btn-focus')) {
      landing2.classList.remove('landing-slide-left');
      landing3.classList.remove('landing-slide-middle');
      landing1.classList.add('landing-slide-middle');
      landing2.classList.add('landing-slide-right');
      landingCarousel.style.marginLeft = "150vmax";
      landingBtn3.classList.remove('landing-slide-nav-btn-focus');
      landingBtn1.classList.add('landing-slide-nav-btn-focus');
    }
  }
  function slide2Click() {
    if (landingBtn1.classList.contains('landing-slide-nav-btn-focus')) {
      landing1.classList.remove('landing-slide-middle');
      landing2.classList.remove('landing-slide-right');
      landing1.classList.add('landing-slide-left');
      landing2.classList.add('landing-slide-middle');
      landing3.classList.add('landing-slide-right');
      landingCarousel.style.marginLeft = "0vmax";
      landingBtn1.classList.remove('landing-slide-nav-btn-focus');
      landingBtn2.classList.add('landing-slide-nav-btn-focus');
    } else if (landingBtn3.classList.contains('landing-slide-nav-btn-focus')) {
      landing3.classList.remove('landing-slide-middle');
      landing2.classList.remove('landing-slide-left');
      landing1.classList.add('landing-slide-left');
      landing2.classList.add('landing-slide-middle');
      landing3.classList.add('landing-slide-right');
      landingCarousel.style.marginLeft = "0vmax";
      landingBtn3.classList.remove('landing-slide-nav-btn-focus');
      landingBtn2.classList.add('landing-slide-nav-btn-focus');
    }
  }
  function slide3Click() {
    if (landingBtn1.classList.contains('landing-slide-nav-btn-focus')) {
      landing1.classList.remove('landing-slide-middle');
      landing2.classList.remove('landing-slide-right');
      landing2.classList.add('landing-slide-left');
      landing3.classList.add('landing-slide-middle');
      landingCarousel.style.marginLeft = "-150vmax";
      landingBtn1.classList.remove('landing-slide-nav-btn-focus');
      landingBtn3.classList.add('landing-slide-nav-btn-focus');
    } else if (landingBtn2.classList.contains('landing-slide-nav-btn-focus')) {
      landing1.classList.remove('landing-slide-left');
      landing2.classList.remove('landing-slide-middle');
      landing3.classList.remove('landing-slide-right');
      landing2.classList.add('landing-slide-left');
      landing3.classList.add('landing-slide-middle');
      landingCarousel.style.marginLeft = "-150vmax";
      landingBtn2.classList.remove('landing-slide-nav-btn-focus');
      landingBtn3.classList.add('landing-slide-nav-btn-focus');
    }
  }

  landingBtn1.addEventListener("click", function() {
    slide1Click();
  });
  landingBtn2.addEventListener("click", function() {
    slide2Click();
  });
  landingBtn3.addEventListener("click", function() {
    slide3Click();
  });

  landing1.addEventListener("click", function() {
    slide1Click();
  });
  landing2.addEventListener("click", function() {
    slide2Click();
  });
  landing3.addEventListener("click", function() {
    slide3Click();
  });



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

    if (scrollPosition > clientHeight && navSideBar.classList.contains('screen-mode')) {
      navSideBar.classList.remove('screen-mode');
      hamburger.classList.remove('hamburger-screen-mode');
    } else if (scrollPosition <= clientHeight && !(navSideBar.classList.contains('screen-mode'))) {
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



