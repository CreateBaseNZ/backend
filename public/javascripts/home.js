/* ========================================================================================
VARIABLES
======================================================================================== */

let home = {
  // VARIABLES
  mediaQuery: undefined,
  landscape: undefined,
  // Elements
  landingCarousel: undefined,
  landing1: undefined,
  landing2: undefined,
  landing3: undefined,
  landingBtn1: undefined,
  landingBtn2: undefined,
  landingBtn3: undefined,
  // FUNCTIONS
  initialise: undefined,
  declareVariables: undefined,
  addListener: undefined,
  slideOne: undefined,
  slideTwo: undefined,
  slideThree: undefined,
  addImages: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  home.initialise
// @desc  
home.initialise = async () => {
  history.scrollRestoration = "manual";
  // DECLARE VARIABLES
  home.declareVariables();
  // LOAD NAVIGATION
  try {
    await navigation.initialise();
  } catch (error) {
    return console.log(error);
  }
  // ADD IMAGES
  try {
    await home.addImages();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  document.querySelector(".full-page-loading").classList.add("hide");
  // LOAD SESSION
  try {
    await session.initialise();
  } catch (error) {
    return console.log(error);
  }
  // PAGE CONFIGURATIONS
  textSequence(0, ['COMING SOON', 'MARKETPLACE', 'COMING SOON', 'ENG KITS'], "change-text");
  home.addListener();
}

// @func  home.declareVariables
// @desc  
home.declareVariables = () => {
  home.mediaQuery = window.matchMedia("(min-width: 850px)");
  home.landscape = window.innerWidth > window.innerHeight;
  home.landingCarousel = document.querySelector('.landing-carousel');
  home.landing1 = document.querySelector('#landing-1');
  home.landing2 = document.querySelector('#landing-2');
  home.landing3 = document.querySelector('#landing-3');
  home.landingBtn1 = document.querySelector('#landing-btn-1');
  home.landingBtn2 = document.querySelector('#landing-btn-2');
  home.landingBtn3 = document.querySelector('#landing-btn-3');
}

// @func  home.addListener
// @desc  
home.addListener = () => {
  if (home.mediaQuery.matches && home.landscape) {
    home.landingBtn1.addEventListener("click", home.slideOne);
    home.landingBtn2.addEventListener("click", home.slideTwo);
    home.landingBtn3.addEventListener("click", home.slideThree);
    home.landing1.addEventListener("click", home.slideOne);
    home.landing2.addEventListener("click", home.slideTwo);
    home.landing3.addEventListener("click", home.slideThree);
  }
}

// @func  home.slideOne
// @desc  
home.slideOne = () => {
  if (home.landingBtn2.classList.contains('landing-slide-nav-btn-focus')) {
    home.landing1.classList.remove('landing-slide-left');
    home.landing2.classList.remove('landing-slide-middle');
    home.landing3.classList.remove('landing-slide-right');
    home.landing1.classList.add('landing-slide-middle');
    home.landing2.classList.add('landing-slide-right');
    home.landingCarousel.style.marginLeft = "150vmax";
    home.landingBtn2.classList.remove('landing-slide-nav-btn-focus');
    home.landingBtn1.classList.add('landing-slide-nav-btn-focus');
  } else if (home.landingBtn3.classList.contains('landing-slide-nav-btn-focus')) {
    home.landing2.classList.remove('landing-slide-left');
    home.landing3.classList.remove('landing-slide-middle');
    home.landing1.classList.add('landing-slide-middle');
    home.landing2.classList.add('landing-slide-right');
    home.landingCarousel.style.marginLeft = "150vmax";
    home.landingBtn3.classList.remove('landing-slide-nav-btn-focus');
    home.landingBtn1.classList.add('landing-slide-nav-btn-focus');
  }
}

// @func  home.slideTwo
// @desc  
home.slideTwo = () => {
  if (home.landingBtn1.classList.contains('landing-slide-nav-btn-focus')) {
    home.landing1.classList.remove('landing-slide-middle');
    home.landing2.classList.remove('landing-slide-right');
    home.landing1.classList.add('landing-slide-left');
    home.landing2.classList.add('landing-slide-middle');
    home.landing3.classList.add('landing-slide-right');
    home.landingCarousel.style.marginLeft = "0vmax";
    home.landingBtn1.classList.remove('landing-slide-nav-btn-focus');
    home.landingBtn2.classList.add('landing-slide-nav-btn-focus');
  } else if (home.landingBtn3.classList.contains('landing-slide-nav-btn-focus')) {
    home.landing3.classList.remove('landing-slide-middle');
    home.landing2.classList.remove('landing-slide-left');
    home.landing1.classList.add('landing-slide-left');
    home.landing2.classList.add('landing-slide-middle');
    home.landing3.classList.add('landing-slide-right');
    home.landingCarousel.style.marginLeft = "0vmax";
    home.landingBtn3.classList.remove('landing-slide-nav-btn-focus');
    home.landingBtn2.classList.add('landing-slide-nav-btn-focus');
  }
}

// @func  home.slideThree
// @desc  
home.slideThree = () => {
  if (home.landingBtn1.classList.contains('landing-slide-nav-btn-focus')) {
    home.landing1.classList.remove('landing-slide-middle');
    home.landing2.classList.remove('landing-slide-right');
    home.landing2.classList.add('landing-slide-left');
    home.landing3.classList.add('landing-slide-middle');
    home.landingCarousel.style.marginLeft = "-150vmax";
    home.landingBtn1.classList.remove('landing-slide-nav-btn-focus');
    home.landingBtn3.classList.add('landing-slide-nav-btn-focus');
  } else if (home.landingBtn2.classList.contains('landing-slide-nav-btn-focus')) {
    home.landing1.classList.remove('landing-slide-left');
    home.landing2.classList.remove('landing-slide-middle');
    home.landing3.classList.remove('landing-slide-right');
    home.landing2.classList.add('landing-slide-left');
    home.landing3.classList.add('landing-slide-middle');
    home.landingCarousel.style.marginLeft = "-150vmax";
    home.landingBtn2.classList.remove('landing-slide-nav-btn-focus');
    home.landingBtn3.classList.add('landing-slide-nav-btn-focus');
  }
}

// @func  home.addImages
// @desc  
home.addImages = () => {
  return new Promise(async (resolve, reject) => {
    // IMAGES
    const image1 = {
      src: "./../../public/images/landing-7.png", id: "",
      alt: "Landing 1", classes: [], parentId: "landing-1"
    }
    const image2 = {
      src: "./../../public/images/landing-5.png", id: "",
      alt: "Landing 2", classes: [], parentId: "landing-2"
    }
    const image3 = {
      src: "./../../public/images/landing-6.png", id: "",
      alt: "Landing 3", classes: [], parentId: "landing-3"
    }
    // LOAD IMAGES
    const objects = [image1, image2, image3];
    try {
      await imageLoader(objects);
    } catch (error) {
      reject(error)
    }
    // SUCCESS RESPONSE
    // Add classes for animation
    document.querySelector("#landing-1").classList.add("landing-1");
    document.querySelector("#landing-2").classList.add("landing-2");
    document.querySelector("#landing-3").classList.add("landing-3");
    resolve();
  });
}

/* ========================================================================================
END
======================================================================================== */