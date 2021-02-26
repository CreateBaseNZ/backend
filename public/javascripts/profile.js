/* ========================================================================================
VARIABLES
======================================================================================== */

let profile = {
  // VARIABLES
  pages: ["/profile", "/profile/projects", "/profile/orders", "/profile/settings"],
  allProjects: undefined,
  allMakes: undefined,
  // FUNCTIONS
  initialise: undefined,
  declareVariables: undefined,
  loadUserData: undefined,
  setPage: undefined,
  setPageCollect: undefined,
  setPageValidate: undefined,
  setPageUpdate: undefined,
  preSetTab: undefined,
  addImages: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  profile.initialise
// @desc  
profile.initialise = async () => {
  // LOAD SYSTEM
  try {
    await global.initialise(true, false);
  } catch (error) {
    return console.log(error);
  }
  // RENDER THE CORRECT PROFILE PAGE
  profile.setPage(undefined, true);
  try {
    await profile.addImages();
  } catch (error) {
    console.log(error);
    return;
  }
  // DECLARE VARIABLES
  profile.declareVariables();
  const [allProjects, allMakes] = (await projects.loadUserData());
  profile.allProjects = allProjects
  profile.allMakes = allMakes
  // INITIALISATIONS
  await dashboard.initialise(); // Dashboard
  await projects.initialise(); // Projects
  await orders.initialise(); // Settings
  await settings.initialise(); // Settings

  // REMOVE STARTUP LOADER
  removeLoader(false);
  // TO BE CLASSIFIED
  // Get elements
  projScroll = document.getElementById('proj-scroll-container');
}

// @func  profile.declareVariables
// @desc  
profile.declareVariables = () => {
  window.addEventListener('resize', () => {
    if (window.matchMedia("(min-width: 1250px)").matches) {
      document.querySelector('.nav-in').style.display = 'none'
      document.querySelector('.nav-right-menu-in').style.display = 'none'
      if (document.querySelector('.nav-right-menu-in').classList.contains('nav-right-menu-active')) {
        navigation.toggleRightMenu()
      }
    } else {
      document.querySelector('.nav-in').style.display = 'block'
      document.querySelector('.nav-right-menu-in').style.display = 'flex'
      if (document.querySelector('.nav-right-menu-in').classList.contains('nav-right-menu-active')) {
        document.querySelector('.nav-darken-overlay').classList.add('nav-darken-overlay-active')
      }
    }
  })

}

// @func  profile.setPage
// @desc  
profile.setPage = (page = undefined, initialise = false) => {
  // COLLECT NEW PAGE
  const [newPage, baseURL] = profile.setPageCollect(page);
  // VALIDATE NEW PAGE
  const [valid, message] = profile.setPageValidate(newPage, initialise)
  if (!valid) return console.log(message);
  // UPDATE PROFILE PAGE
  profile.setPageUpdate(newPage, baseURL);
  if (page === '') {
    const projItems = document.getElementsByClassName('db-proj-item')
    let threeRecentProjects = Array.from(document.getElementById('proj-fav-container').children).slice(0, 3)
    for (var i = 0; i < 3; i++) {
      let proj
      if (threeRecentProjects[i]) {
        proj = new Object()
        proj.id = threeRecentProjects[i].id.split('-')[0]
        proj.name = threeRecentProjects[i].querySelector('.proj-fav-name').innerHTML
        proj.allMakesString = threeRecentProjects[i].querySelector('.proj-fav-makes').innerHTML
      }
      dashboard.renderProjects(proj, projItems[i], false)
    }
    if (threeRecentProjects.length) {
      document.getElementById('db-proj-none').style.display = 'none'
    } else {
      document.getElementById('db-proj-none').style.display = 'block'
    }
  }
  return;
}

// @func  profile.setPageCollect
// @desc  
profile.setPageCollect = (page = undefined) => {
  // DECLARE VARIABLES
  const url = window.location.href.toString();
  const urlArray = url.split("/"); // split url
  const index = urlArray.indexOf("profile");
  const baseURL = urlArray.slice(0, index).join("/");
  let newPage;
  if (page === undefined) { // UNDEFINED
    const profilePage = urlArray[index + 1];
    newPage = (profilePage === undefined) ? "/profile" : `/profile/${profilePage}`;
  } else { // DEFINED
    newPage = (page === "") ? "/profile" : `/profile/${page}`;
  }
  // RETURN
  return [newPage, baseURL];
}

// @func  profile.setPageValidate
// @desc  
profile.setPageValidate = (newPage = undefined, initialise = false) => {
  let valid = true;
  let message = "";
  if (!newPage) {
    valid = false;
    message = "New Page Required";
  } else if (profile.pages.indexOf(newPage) === -1) {
    valid = false;
    message = "New Page Doesn't Exist";
  } else if (newPage === window.sessionStorage.page && !initialise) {
    valid = false;
    message = "Page Didn't Change";
  }
  return [valid, message];
}

// @func  profile.setPageUpdate
// @desc  
profile.setPageUpdate = (newPage = undefined, baseURL = undefined) => {
  const currentPage = window.sessionStorage.page;
  // HIDE CURRENT PAGE
  let currentPageId;
  switch (currentPage) {
    case "/profile/projects":
      currentPageId = "projects-area";
      currentNavigationId = "nav-item-projects";
      break;
    case "/profile/orders":
      currentPageId = "orders-area";
      currentNavigationId = "nav-item-orders";
      break;
    case "/profile/settings":
      currentPageId = "settings-area";
      currentNavigationId = "nav-item-settings";
      break;
    default:
      currentPageId = "db-area";
      currentNavigationId = "nav-item-profile";
      break;
  }
  document.querySelector(`#${currentPageId}`).style.display = "none";
  document.querySelector(`#${currentNavigationId}`).classList.remove("active-menu-item");
  // SHOW NEW PAGE
  let newPageId;
  switch (newPage) {
    case "/profile/projects":
      newPageId = "projects-area";
      newNavigationId = "nav-item-projects";
      break;
    case "/profile/orders":
      newPageId = "orders-area";
      newNavigationId = "nav-item-orders";
      break;
    case "/profile/settings":
      newPageId = "settings-area";
      newNavigationId = "nav-item-settings";
      break;
    default:
      newPageId = "db-area";
      newNavigationId = "nav-item-profile";
      break;
  }
  document.querySelector(`#${newPageId}`).style.display = 'flex';
  document.querySelector(`#${newNavigationId}`).classList.add("active-menu-item");
  // UPDATE CURRENT PAGE
  window.sessionStorage.page = newPage;
  let title;
  switch (newPage) {
    case "/profile/projects": title = "Projects • CreateBase"; break;
    case "/profile/orders": title = "Orders • CreateBase"; break;
    case "/profile/settings": title = "Settings • CreateBase"; break;
    default: title = "Profile • CreateBase"; break;
  }
  document.querySelector("#profile-title").innerHTML = title; // Update Page Title
  // ADD HISTORY
  const state = { page: newPage };
  const newURL = baseURL + newPage;
  history.pushState(state, title, newURL);
  return;
}

// @func  profile.preSetTab
// @desc  
profile.preSetTab = () => {
  // DECLARE VARIABLES
  const url = window.location.href.toString();
  const urlArray = url.split("/"); // split url
  const index = urlArray.indexOf("profile");
  const baseURL = urlArray.slice(0, index).join("/");
  const page = urlArray[index + 1];
}

// @func  profile.addImages
// @desc  
profile.addImages = () => {
  return new Promise(async (resolve, reject) => {
    // IMAGES
    const image1 = {
      src: "/profile/customer/fetch/picture", id: "nav-profile-img",
      alt: "User", classes: [], parentId: "profile-nav-in"
    };
    // LOAD IMAGES
    const objects = [image1];
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