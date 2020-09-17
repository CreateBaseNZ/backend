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
  rightMenu: undefined,
  userIn: undefined,
  userDesktopOut: undefined,
  userMobileOut: undefined,
  leftMenuIn: undefined,
  leftMenuOut: undefined,
  // FUNCTIONS
  initialise: undefined,
  declareVariables: undefined,
  toggleLeftMenu: undefined,
  toggleRightMenu: undefined,
  exitModal: undefined,
  configuration: undefined,
  menuContentDesktop: undefined,
  menuContentMobile: undefined,
  addImages: undefined,
  fetchUser: undefined
}

navigation.exitModal = () => {
  
}



/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  navigation.initialise
// @desc  
navigation.initialise = (login = false, userMenu = true) => {
  navigation.declareVariables();
// navigation.initialise = () => {
//   return new Promise(async (resolve, reject) => {
//     // DECLARE VARIABLES
//     // CONFIGURATION AND CONTENTS
//     // ADD IMAGES
//     //const promises = [navigation.fetchUser(login), navigation.addImages(login, userMenu)];
//     try {
//       //[user] = await Promise.all(promises);
//       await navigation.addImages();
//     } catch (error) {
//       reject(error);
//     }
//     //navigation.configuration(login, user);
//     //navigation.mediaQuery.addListener(() => navigation.configuration(login, user));
//     navigation.configuration();
//     navigation.mediaQuery.addListener(() => navigation.configuration());
//     if (footer) document.querySelector(".footer-section").classList.remove("hide");
//     setTimeout(function () {
//       document.querySelector(".nav-home-btn").querySelector(".nav-logo").style.marginTop = "0px"
//     }, 200);
//     // SUCCESS RESOLVE
//     resolve();
//   });
}

// @func  navigation.declareVariables
// @desc  
navigation.declareVariables = () => {
  navigation.mediaQuery = window.matchMedia("(min-width: 850px)")
  navigation.darken = document.querySelector('.nav-darken-overlay')
  navigation.ham = document.querySelector('.hamburger')
  navigation.rightMenu = document.querySelector('.nav-right-menu-wrapper')
  navigation.leftMenu = document.querySelector('.nav-left-menu-wrapper')
  // navigation.userIn = document.querySelector(".nav-in")
  // navigation.userDesktopOut = document.querySelector(".nav-desktop-out")
  // navigation.userMobileOut = document.querySelector(".nav-mobile-out")
  // navigation.leftMenuGreeting = document.getElementById("nav-left-greeting")
}

// @func  navigation.toggleRightMenu
// @desc  
navigation.toggleRightMenu = () => {
  // Toggle all on left
  navigation.rightMenu.classList.toggle('active');
  navigation.ham.classList.toggle('is-active');

  if (navigation.rightMenu.classList.contains('active')) {
    // If right menu displayed, hide it
    navigation.leftMenu.classList.remove('active');
    // navigation.userIn.classList.remove("nav-user-active");
    // navigation.userDesktopOut.classList.remove("nav-user-active");
    // navigation.userMobileOut.classList.remove("nav-user-active");
  } else {
    // If right menu not displayed, darken
    navigation.darken.classList.toggle('active');
  }
}

// @func  navigation.toggleLeftMenu
// @desc  
navigation.toggleLeftMenu = () => {
  // Toggle all on right
  navigation.leftMenu.classList.toggle('active');
  // navigation.userIn.classList.toggle("nav-user-active");
  // navigation.userMobileOut.classList.toggle("nav-user-active");
  // navigation.userDesktopOut.classList.toggle("nav-user-active");

  if (navigation.rightMenu.classList.contains('active')) {
    navigation.rightMenu.classList.remove('active');
    navigation.ham.classList.remove('is-active');
  } else {
    navigation.darken.classList.toggle('active');
  }
}

// // @func  navigation.exitModal
// // @desc  
// navigation.exitModal = () => {
//   if (navigation.rightMenu.classList.contains("nav-right-menu-active")) {
//     navigation.rightMenu.classList.remove("nav-right-menu-active");
//     navigation.ham.classList.remove("is-active");
//   } else if (navigation.leftMenuIn.classList.contains("nav-left-menu-active")) {
//     navigation.leftMenuIn.classList.remove("nav-left-menu-active");
//     navigation.leftMenuOut.classList.remove("nav-left-menu-active");
//     navigation.userIn.classList.remove("nav-user-active");
//     navigation.userDesktopOut.classList.remove("nav-user-active");
//     navigation.userMobileOut.classList.remove("nav-user-active");
//   }
//   navigation.darken.classList.remove("nav-darken-overlay-active");
// }

// // @func  navigation.configuration
// // @desc  
// //navigation.configuration = (login = false, user = {}) => {
// navigation.configuration = () => {
//   if (navigation.mediaQuery.matches) {
//     /* Desktop */
//     //navigation.menuContentDesktop(login);
//     navigation.menuContentDesktop();
//   } else {
//     /* Mobile */
//     //navigation.menuContentMobile(login);
//     navigation.menuContentMobile();
//   }
//   // DELETE FIRST IF STATEMENT AFTER FULL IMPLEMENTATION
//   //if (navigation.rightMenuGreeting) if (user) navigation.rightMenuGreeting.innerHTML = ("hi " + user.displayName).toUpperCase()
// }

// // @func  navigation.menuContentDesktop
// // @desc  
// navigation.menuContentDesktop = (login = false) => {
//   if (login) {
//     /* Logged in on desktop */
//     navigation.userIn.style.display = "block";
//     navigation.userDesktopOut.style.display = "none";
//     navigation.userMobileOut.style.display = "none";
//     navigation.leftMenuIn.style.display = "block";
//     navigation.leftMenuOut.style.display = "none";
//   } else {
//     /* Logged out on desktop */
//     navigation.userDesktopOut.style.display = "block";
//     navigation.userMobileOut.style.display = "none";
//     navigation.userIn.style.display = "none";
//     navigation.leftMenuOut.style.display = "none";
//     navigation.leftMenuIn.style.display = "none";
//   }
// }

// // @func  navigation.menuContentMobile
// // @desc  
// navigation.menuContentMobile = (login = false) => {
//   if (login) {
//     /* Logged in on mobile */
//     navigation.userIn.style.display = "block";
//     navigation.userDesktopOut.style.display = "none";
//     navigation.userMobileOut.style.display = "none";
//     navigation.leftMenuOut.style.display = "none";
//     navigation.leftMenuIn.style.display = "block";
//   } else {
//     /* Logged out on mobile */
//     navigation.userMobileOut.style.display = "block";
//     navigation.userDesktopOut.style.display = "none";
//     navigation.userIn.style.display = "none";
//     navigation.leftMenuOut.style.display = "block";
//     navigation.leftMenuIn.style.display = "none";
//   }
// }

// // @func  navigation.addImages
// // @desc  
// //navigation.addImages = (login = false, userMenu = true) => {
// navigation.addImages = () => {
//   return new Promise(async (resolve, reject) => {
//     // IMAGES
//     const image1 = {
//       src: "/public/images/logo-icon.png", id: "",
//       alt: "CreateBase", classes: ["nav-logo"], parentId: "nav-home-btn"
//     };
//     /*const image2 = {
//       src: "/profile/customer/fetch/picture", id: "nav-dp",
//       alt: "customer profile image", classes: [], parentId: "nav-right-menu"
//     };
//     const image3 = {
//       src: "/profile/customer/fetch/picture", id: "nav-user-in",
//       alt: "User", classes: [], parentId: "nav-in"
//     };
//     const image4 = {
//       src: "/public/images/user-x.png", id: "",
//       alt: "User", classes: ["nav-user-x"], parentId: "nav-in"
//     };
//     const image5 = {
//       src: "/public/images/user-out.png", id: "nav-user-out",
//       alt: "User", classes: [], parentId: "nav-mobile-out"
//     };
//     const image6 = {
//       src: "/public/images/user-x.png", id: "",
//       alt: "User", classes: ["nav-user-x"], parentId: "nav-mobile-out"
//     };*/
//     // LOAD IMAGES
//     /*let objects;
//     if (userMenu) {
//       if (login) {
//         objects = [image1, image2, image3, image4, image5, image6];
//       } else {
//         objects = [image1, image4, image5, image6];
//       }
//     } else {
//     objects = [image1];
//     }*/

//     const objects = [image1];

//     try {
//       await imageLoader(objects);
//     } catch (error) {
//       reject(error);
//     }
//     // SUCCESS RESPONSE
//     resolve();
//   });
// }

// /*// @func  navigation.fetchUser
// // @desc
// navigation.fetchUser = (login = false) => {
//   return new Promise(async (resolve, reject) => {
//     if (!login) return resolve({});
//     let data;
//     try {
//       data = (await axios.get("/navigation/fetch-user"))["data"];
//     } catch (error) {
//       data = { status: "error", content: error };
//     }
//     if (data.status === "error") {
//       // TO DO .....
//       // Error Handler
//       // TO DO .....
//       console.log(data.content); // TEMPORARY
//       return reject("error");
//     } else if (data.status === "failed") {
//       // TO DO .....
//       // Failed Handler
//       // TO DO .....
//       console.log(data.content); // TEMPORARY
//       return reject("failed");
//     }
//     return resolve(data.content);
//   });
// }*/

/* ========================================================================================
END
======================================================================================== */