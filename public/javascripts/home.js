/* ========================================================================================
VARIABLES
======================================================================================== */

let home = {
  // VARIABLES
  words: ['COMING SOON', 'MARKETPLACE', 'COMING SOON', 'ENG KITS'],
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
  addImages: undefined,
  subscription: undefined,
  subscribe: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  home.initialise
// @desc  
home.initialise = async () => {
  console.log("THIS IS A TEST TO SEE IF THE PIPELINE BETWEEN GITHUB AND AWS IS ESTABLISHED");
  //updateSessionPage();
  history.scrollRestoration = "manual";
  // DECLARE VARIABLES
  home.declareVariables();
  /*// GET LOGIN STATUS 
  let data;
  try {
    data = (await axios.get("/login-status"))["data"];
  } catch (error) {
    return console.log(error);
  }
  const login = data.status;*/
  // LOAD NAVIGATION AND ADD IMAGES
  //promises = [global.initialise(true, true, login), home.addImages()];
  promises = [global.initialise(), home.addImages()];
  try {
    await Promise.all(promises);
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
  // LOAD SESSION
  //session.initialise();
  // PAGE CONFIGURATIONS
  textSequence(0, home.words, "change-text");
  home.addListener();
  //home.subscription(login);
  home.subscription();
}

// @func  home.declareVariables
// @desc  
home.declareVariables = () => {
  home.mediaQuery = window.matchMedia("(min-width: 850px)");
  home.landscape = window.innerWidth > window.innerHeight;
  home.landingCarousel = document.querySelector('.landing-carousel');
  home.landing1 = document.getElementById('landing-1');
  home.landing2 = document.getElementById('landing-2');
  home.landing3 = document.getElementById('landing-3');
  home.landingBtn1 = document.getElementById('landing-btn-1');
  home.landingBtn2 = document.getElementById('landing-btn-2');
  home.landingBtn3 = document.getElementById('landing-btn-3');
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
    document.getElementById('subscribe-email-input').addEventListener('keypress', ({key}) => {
      if (key === "Enter") {
        home.subscribe(false)
      }
    })
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
      src: "/public/images/home/landing-1.jpg", id: "",
      alt: "Landing 1", classes: [], parentId: "landing-1"
    }
    const image2 = {
      src: "/public/images/home/landing-2.jpg", id: "",
      alt: "Landing 2", classes: [], parentId: "landing-2"
    }
    const image3 = {
      src: "/public/images/home/landing-3.jpg", id: "",
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

// @func  home.subscription
// @desc  
home.subscription = (login = false) => {
  // INPUT FIELD DISPLAY
  if (login) {
    document.querySelector("#subscribe-field").classList.add("hide");
  }
  // BUTTON ATTRIBUTE
  document.querySelector("#subscribe-main").setAttribute("onclick", `home.subscribe(${login});`);
}

// @func  home.subscribe
// @desc  
home.subscribe = async (login) => {
  document.querySelector("#subscribe-email-error").innerHTML = "";
  // DISABLE
  document.querySelector("#subscribe-main").setAttribute("disabled", "");
  // COLLECT
  const email = (!login) ? document.querySelector("#subscribe-email-input").value : "";
  // VALIDATE
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email === "") {
    document.querySelector("#subscribe-email-error").innerHTML = "An email is required";
    return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
  } else if (!emailRE.test(String(email).toLowerCase())) {
    document.querySelector("#subscribe-email-error").innerHTML = "Invalid email";
    return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
  }
  // SUBMIT
  try {
    await global.subscribeToMailingList(email);
  } catch (error) {
    return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
  }
  return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
}

/* ========================================================================================
END
======================================================================================== */