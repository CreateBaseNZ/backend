/* ========================================================================================
VARIABLES
======================================================================================== */

let navigation = {
  // VARIABLES
  mediaQuery: undefined,
  loginStatus: undefined,
  // Elements
  darken: undefined,
  ham: undefined,
  leftMenu: undefined,
  userIn: undefined,
  userDesktopOut: undefined,
  userMobileOut: undefined,
  rightMenuIn: undefined,
  rightMenuOut: undefined,
  // FUNCTIONS
  initialise: undefined,
  declareVariables: undefined,
  toggleLeftMenu: undefined,
  toggleRightMenu: undefined,
  exitModal: undefined,
  configuration: undefined,
  menuContentDesktop: undefined,
  menuContentMobile: undefined,
  addImages: undefined
}


/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  navigation.initialise
// @desc  
navigation.initialise = (login = false, userMenu = true) => {
  return new Promise(async (resolve, reject) => {
    // DECLARE VARIABLES
    navigation.declareVariables();
    // CONFIGURATION AND CONTENTS
    navigation.configuration(login);
    navigation.mediaQuery.addListener(() => navigation.configuration(login));
    // ADD IMAGES
    try {
      await navigation.addImages(login, userMenu);
    } catch (error) {
      reject(error);
    }
    // SUCCESS RESOLVE
    resolve();
  });
}

// @func  navigation.declareVariables
// @desc  
navigation.declareVariables = () => {
  navigation.mediaQuery = window.matchMedia("(min-width: 850px)");
  navigation.darken = document.querySelector(".nav-darken-overlay");
  navigation.ham = document.querySelector(".hamburger");
  navigation.leftMenu = document.querySelector(".nav-left-menu-wrap");
  navigation.userIn = document.querySelector(".nav-in");
  navigation.userDesktopOut = document.querySelector(".nav-desktop-out");
  navigation.userMobileOut = document.querySelector(".nav-mobile-out");
  navigation.rightMenuIn = document.querySelector(".nav-right-menu-in");
  navigation.rightMenuOut = document.querySelector(".nav-right-menu-out");
  navigation.rightMenuGreeting = document.getElementById("nav-right-greeting")
  return;
}

// @func  navigation.toggleLeftMenu
// @desc  
navigation.toggleLeftMenu = () => {
  // Toggle all on left
  navigation.leftMenu.classList.toggle("nav-left-menu-active");
  navigation.ham.classList.toggle("is-active");

  // If right menu displayed, hide it
  if (navigation.rightMenuIn.classList.contains("nav-right-menu-active")) {
    navigation.rightMenuIn.classList.remove("nav-right-menu-active");
    navigation.rightMenuOut.classList.remove("nav-right-menu-active");
    navigation.userIn.classList.remove("nav-user-active");
    navigation.userDesktopOut.classList.remove("nav-user-active");
    navigation.userMobileOut.classList.remove("nav-user-active");
    // If right menu not displayed, darken
  } else {
    navigation.darken.classList.toggle("nav-darken-overlay-active");
  }
}

// @func  navigation.toggleRightMenu
// @desc  
navigation.toggleRightMenu = () => {
  // Toggle all on right
  navigation.rightMenuIn.classList.toggle("nav-right-menu-active");
  navigation.rightMenuOut.classList.toggle("nav-right-menu-active");
  navigation.userIn.classList.toggle("nav-user-active");
  navigation.userMobileOut.classList.toggle("nav-user-active");
  navigation.userDesktopOut.classList.toggle("nav-user-active");

  if (navigation.leftMenu.classList.contains("nav-left-menu-active")) {
    navigation.leftMenu.classList.remove("nav-left-menu-active");
    navigation.ham.classList.remove("is-active");
  } else {
    navigation.darken.classList.toggle("nav-darken-overlay-active");
  }
}

// @func  navigation.exitModal
// @desc  
navigation.exitModal = () => {
  if (navigation.leftMenu.classList.contains("nav-left-menu-active")) {
    navigation.leftMenu.classList.remove("nav-left-menu-active");
    navigation.ham.classList.remove("is-active");
  } else if (navigation.rightMenuIn.classList.contains("nav-right-menu-active")) {
    navigation.rightMenuIn.classList.remove("nav-right-menu-active");
    navigation.rightMenuOut.classList.remove("nav-right-menu-active");
    navigation.userIn.classList.remove("nav-user-active");
    navigation.userDesktopOut.classList.remove("nav-user-active");
    navigation.userMobileOut.classList.remove("nav-user-active");
  }
  navigation.darken.classList.remove("nav-darken-overlay-active");
}

// @func  navigation.configuration
// @desc  
navigation.configuration = (login = false) => {
  if (navigation.mediaQuery.matches) {
    /* Desktop */
    navigation.menuContentDesktop(login);
  } else {
    /* Mobile */
    navigation.menuContentMobile(login);
  }
  navigation.rightMenuGreeting.innerHTML = "HI " + userName;
}

// @func  navigation.menuContentDesktop
// @desc  
navigation.menuContentDesktop = (login = false) => {
  if (login) {
    /* Logged in on desktop */
    navigation.userIn.style.display = "block";
    navigation.userDesktopOut.style.display = "none";
    navigation.userMobileOut.style.display = "none";
    navigation.rightMenuIn.style.display = "block";
    navigation.rightMenuOut.style.display = "none";
  } else {
    /* Logged out on desktop */
    navigation.userDesktopOut.style.display = "block";
    navigation.userMobileOut.style.display = "none";
    navigation.userIn.style.display = "none";
    navigation.rightMenuOut.style.display = "none";
    navigation.rightMenuIn.style.display = "none";
  }
}

// @func  navigation.menuContentMobile
// @desc  
navigation.menuContentMobile = (login = false) => {
  if (login) {
    /* Logged in on mobile */
    navigation.userIn.style.display = "block";
    navigation.userDesktopOut.style.display = "none";
    navigation.userMobileOut.style.display = "none";
    navigation.rightMenuOut.style.display = "none";
    navigation.rightMenuIn.style.display = "block";
  } else {
    /* Logged out on mobile */
    navigation.userMobileOut.style.display = "block";
    navigation.userDesktopOut.style.display = "none";
    navigation.userIn.style.display = "none";
    navigation.rightMenuOut.style.display = "block";
    navigation.rightMenuIn.style.display = "none";
  }
}

// @func  navigation.addImages
// @desc  
navigation.addImages = (login = false, userMenu = true) => {
  return new Promise(async (resolve, reject) => {
    // IMAGES
    const image1 = {
      src: "/public/images/logo-icon.png", id: "",
      alt: "CreateBase", classes: ["nav-logo"], parentId: "nav-home-btn"
    };
    const image2 = {
      src: "/profile/customer/fetch/picture", id: "nav-dp",
      alt: "customer profile image", classes: [], parentId: "nav-right-menu"
    };
    const image3 = {
      src: "/profile/customer/fetch/picture", id: "nav-user-in",
      alt: "User", classes: [], parentId: "nav-in"
    };
    const image4 = {
      src: "/public/images/user-x.png", id: "",
      alt: "User", classes: ["nav-user-x"], parentId: "nav-in"
    };
    const image5 = {
      src: "/public/images/user-out.png", id: "nav-user-out",
      alt: "User", classes: [], parentId: "nav-mobile-out"
    };
    const image6 = {
      src: "/public/images/user-x.png", id: "",
      alt: "User", classes: ["nav-user-x"], parentId: "nav-mobile-out"
    };
    // LOAD IMAGES
    let objects;
    if (userMenu) {
      if (login) {
        objects = [image1, image2, image3, image4, image5, image6];
      } else {
        objects = [image1, image4, image5, image6];
      }
    } else {
      objects = [image1];
    }

    try {
      await imageLoader(objects);
    } catch (error) {
      reject(error);
    }
    // SUCCESS RESPONSE
    resolve();
  });
}

/* ========================================================================================
END
======================================================================================== */