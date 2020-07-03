/* ========================================================================================
VARIABLES - PROFILE
======================================================================================== */

let profile = {
  // VARIABLES
  pages: ["/profile", "/profile/projects", "/profile/orders", "/profile/settings"],
  // FUNCTIONS
  setPage: undefined,
  setPageCollect: undefined,
  setPageValidate: undefined,
  setPageUpdate: undefined,
  preSetTab: undefined,
  addImages: undefined
}

/* ========================================================================================
FUNCTIONS - PROFILE
======================================================================================== */

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
  // if (initialise) profile.preSetTab();
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
      currentPageId = "billing-area";
      currentNavigationId = "nav-item-orders";
      break;
    case "/profile/settings":
      currentPageId = "settings-area";
      currentNavigationId = "nav-item-settings";
      break;
    default:
      currentPageId = "profile-area";
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
      newPageId = "billing-area";
      newNavigationId = "nav-item-orders";
      break;
    case "/profile/settings":
      newPageId = "settings-area";
      newNavigationId = "nav-item-settings";
      break;
    default:
      newPageId = "profile-area";
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
  const tabId = (page === undefined) ? "profile-tab" : `${page}-tab`;
  document.querySelector(`#${tabId}`).checked = true;
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
VARIABLES - PROJECTS
======================================================================================== */

let projects = {
  // VARIABLES
  // FUNCTIONS
  initialise: undefined,
  declareVariables: undefined
}

/* ========================================================================================
FUNCTIONS - PROJECTS
======================================================================================== */

// @func  projects.initialise
// @desc  
projects.initialise = async () => {
  // DECLARE VARIABLES
  projects.declareVariables();
}

// @func  projects.declareVariables
// @desc  
projects.declareVariables = () => {
  swiper = new Swiper('.swiper-container');
}

/* ========================================================================================
END - PROJECTS
======================================================================================== */

let swiper;
var mq = window.matchMedia("(min-width: 850px)")
var activeProjID = undefined
var tabs = ['profile', 'projects', 'billing', 'settings']

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Previews uploaded profile picture
var loadFile = function (event) {
  document.getElementById('profile-preview').src = URL.createObjectURL(event.target.files[0])
}

/*
function changeTabArea(el) {
  passTab(el)

  for (const tab of tabs) {
    if (document.getElementById(tab + '-tab').checked === true) {
      document.getElementById(tab + '-area').style.display = 'flex'
    } else {
      document.getElementById(tab + '-area').style.display = 'none'
    }
  }
}
*/
let Project = class {
  constructor(bookmark, makes = [], name, notes, image) {
    this.bookmark = bookmark
    if (makes.constructor === Array) {
      this.makes = makes
    } else {
      this.makes = [makes]
    }
    this.name = name
    this.notes = notes
    this.image = image
  }
}

function renderProjCard(newProj, project) {
  if (newProj) {

    let cardEl = document.createElement('div')
    cardEl.id = 'proj-' + project.id

    projScroll.appendChild(cardEl).className = 'proj-card'

    let bookmarkEl = document.createElement('i')
    bookmarkEl.addEventListener('click', async (e) => {
      e.stopPropagation()

      let proj = new Object()
      proj.updates = new Object()

      proj.id = project.id
      proj.updates.bookmark = !project.bookmark

      bookmarkEl.classList.toggle('fas')
      bookmarkEl.classList.toggle('far')

      try {
        proj = (await axios.post("/profile/customer/update/proj", proj))
      } catch (error) {
        console.log(error)
      }
    })
    if (project.bookmark) {
      cardEl.appendChild(bookmarkEl).className = 'fas fa-bookmark'
      cardEl.classList.add('proj-bookmark-prior')
    } else {
      cardEl.appendChild(bookmarkEl).className = 'far fa-bookmark'
    }

    // let imgEl = document.createElement('img')
    let imgEl = document.createElement('div')
    cardEl.appendChild(imgEl).className = 'proj-img'
    // imgEl.src = project.image
    imgEl.alt = 'Project Image'
    const randDeg = Math.floor(Math.random() * 360)
    imgEl.style.background = 'linear-gradient(' + randDeg + 'deg, #8258dc, #4e4ed6)'

    dateCreation = new Date(project.date.creation)
    let dateEl = document.createElement('p')
    dateEl.innerHTML = dateCreation.toLocaleString('default', { month: 'short' }).toUpperCase() + ' ' + dateCreation.getDate() + ' ' + dateCreation.getFullYear()
    cardEl.appendChild(dateEl).className = 'proj-date'

    let nameEl = document.createElement('p')
    nameEl.innerHTML = project.name
    cardEl.appendChild(nameEl).className = 'proj-name'

    // Add makes to project cards
    let makesEl = document.createElement('p')
    cardEl.appendChild(makesEl).className = 'proj-makes'
    project.makes.forEach(function (make, j) {
      if (makesEl.innerHTML !== '') {
        makesEl.innerHTML += ', '
        makesEl.id += ' ' + make
      } else {
        makesEl.id += make
      }
      makesEl.innerHTML += allMakes[makeKeys[make]].file.name
    })

    let notesEl = document.createElement('div')
    cardEl.appendChild(notesEl).className = 'proj-notes'
    let notesText = document.createElement('p')
    notesEl.appendChild(notesText).className = 'proj-notes-content'
    notesText.innerHTML = project.notes

    cardEl.addEventListener('mouseover', () => {
      notesEl.style.height = notesEl.scrollHeight + 'px'
    })
    cardEl.addEventListener('mouseout', () => {
      notesEl.style.height = '0'
    })

    let dateModified = new Date(project.date.modified)
    let modifiedEl = document.createElement('p')
    modifiedEl.innerHTML = 'Last modified ' + dateModified.toLocaleString('default', { month: 'long' }) + ' ' + dateModified.getDate() + ' ' + dateModified.getFullYear()
    cardEl.appendChild(modifiedEl).className = 'proj-modified'

    let editEl = document.createElement('p')
    editEl.innerHTML = 'Click anywhere on this card to edit'
    cardEl.appendChild(editEl).className = 'proj-edit'

    // Edit a project
    cardEl.addEventListener('click', () => {

      // Show new/edit project screen
      showProjPopup('edit', project.id)

      if (makesEl.id !== "") {
        makesEl.id.split(' ').forEach(function (makeInProject, k) {
          // Add project blobs
          renderMakeBlobs(allMakes[makeKeys[makeInProject]])
          // Activate project labels
          document.getElementById('make-label-' + makeInProject).classList.toggle('make-label-active')
          document.getElementById('make-label-' + makeInProject).childNodes[1].className = 'fas fa-check-circle'
        })
      }

    })

  } else {

    console.log(project)

    let cardEl = document.getElementById('proj-' + activeProjID)

    let bookmarkEl = cardEl.querySelector('.fa-bookmark')
    if (project.bookmark) {
      cardEl.appendChild(bookmarkEl).className = 'fas fa-bookmark'
    } else {
      cardEl.appendChild(bookmarkEl).className = 'far fa-bookmark'
    }

    let makesEl = cardEl.querySelector('.proj-makes')
    makesEl.innerHTML = ''
    makesEl.id = ''
    project.makes.forEach(function (make, j) {
      if (makesEl.innerHTML !== '') {
        makesEl.innerHTML += ', '
        makesEl.id += ' ' + make
      } else {
        makesEl.id += make
      }
      makesEl.innerHTML += allMakes[makeKeys[make]].file.name
    })

    let nameEl = cardEl.querySelector('.proj-name')
    nameEl.innerHTML = project.name

    let notesContent = cardEl.querySelector('.proj-notes-content')
    notesContent.innerHTML = project.notes

    let modifiedEl = cardEl.querySelector('.proj-modified')
    let dateModified = new Date()
    modifiedEl.innerHTML = 'Last modified ' + dateModified.toLocaleString('default', { month: 'long' }) + ' ' + dateModified.getDate() + ' ' + dateModified.getFullYear()
  }
}

function renderMakeBlobs(make) {
  let el = document.createElement('div')
  el.className = 'make-blob'
  el.id = 'make-blob-' + make.id
  el.appendChild(document.createElement('p')).innerHTML = make.file.name
  el.appendChild(document.createElement('div')).className = 'make-blob-x'
  el.addEventListener('click', () => {
    let label = document.getElementById('make-label-' + make.id)
    label.classList.toggle('make-label-active')
    label.childNodes[1].classList.toggle('fas')
    label.childNodes[1].classList.toggle('far')
    el.remove()
  })
  makeBlobContainer.appendChild(el)
}

function hideProjPopup(callback, status) {

  // Hide screen and overlay
  newEditProjScreen.style.display = 'none'
  newEditProjScreenOverlay.style.display = 'none'
  newEditProjScreen.className = ''

  if (callback) {
    projectNotif(callback, status)
  }

  // Reset blobs
  makeBlobContainer.innerHTML = ''

  // Reset labels
  let children = makeLabelContainer.children
  for (var i = 0; i < children.length; i++) {
    children[i].className = 'make-label'
    children[i].childNodes[1].className = 'far fa-check-circle'
  }
}

function showProjPopup(status, project = undefined) {

  if (status === 'new') {
    // Create new project
    document.getElementById('new-edit-proj-header').innerHTML = 'Create a New Project'
    document.getElementById('new-edit-proj-name').value = ''
    document.getElementById('new-edit-proj-notes').value = ''
    document.getElementById('new-edit-proj-bookmark').className = 'far fa-bookmark'
    document.getElementById('delete-proj').style.visibility = 'hidden'
    activeProjID = undefined
  } else {
    // Edit existing project
    document.getElementById('new-edit-proj-header').innerHTML = 'Edit an Existing Project'
    document.getElementById('new-edit-proj-name').value = document.getElementById('proj-' + project).querySelector('.proj-name').innerHTML
    document.getElementById('new-edit-proj-notes').value = document.getElementById('proj-' + project).querySelector('.proj-notes-content').innerHTML
    document.getElementById('new-edit-proj-bookmark').className = document.getElementById('proj-' + project).querySelector('.fa-bookmark').className
    document.getElementById('delete-proj').style.visibility = 'visible'
    activeProjID = project
  }

  newEditProjScreen.style.display = 'flex'
  newEditProjScreenOverlay.style.display = 'block'
}

const profileUploadPicture = async () => {
  const file = new FormData(document.querySelector("#profile-pic"));
  let data;
  try {
    data = (await axios.post("/profile/customer/update/picture", file))["data"];
  } catch (error) {
    console.log(error);
    return;
  }
}

const profileInit = async () => {
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
  // REMOVE STARTUP LOADER
  removeLoader(false);
  // INITIALISATIONS
  projects.initialise(); // Projects
  orders.initialise(); // Settings
  settings.initialise(); // Settings
  // Get elements
  const profileWrapper = document.querySelector('.profile-wrapper')
  const allDP = [document.getElementById('nav-dp'), document.getElementById('nav-user-in'), document.getElementById('profile-backdrop')]
  const dpEl = document.getElementById('profile-preview')
  const nameEl = document.getElementById('profile-name')
  const locationEl = document.getElementById('profile-location')
  const bioEl = document.getElementById('profile-bio')
  projScroll = document.getElementById('proj-scroll-container')
  const billingCards = document.getElementsByClassName('billing-card')

  // -- Get customer info --
  let customerInfo

  try {
    customerInfo = (await axios.get("/profile/customer/fetch"))["data"]["data"]
  } catch (error) {
    console.log(error)
    return
  }

  var nameTemp = customerInfo["displayName"]
  var bioTemp = customerInfo["bio"]
  var dpTemp = dpEl.src
  let location = 'auckland, new zealand'

  // -- Update all markup (display + edit) --
  nameEl.innerHTML = nameTemp
  locationEl.innerHTML = location
  bioEl.innerHTML = bioTemp

  // -- If edit --
  document.getElementById('profile-edit-btn').addEventListener('click', () => {
    profileWrapper.classList.toggle('profile-wrapper-edit')
  })

  //  -- If save --
  document.getElementById('profile-save-btn').addEventListener('click', async () => {
    profileWrapper.classList.toggle('profile-wrapper-edit')

    // Save new variables
    dpTemp = dpEl.src

    nameTemp = nameEl.innerHTML
    bioTemp = bioEl.innerHTML
    customerInfo["displayName"] = nameTemp
    customerInfo["bio"] = bioTemp

    // Update profile pictures in nav bar
    for (var i = 0; i < allDP.length; i++) {
      allDP[i].src = dpTemp
    }

    // Post to server
    try {
      let data = (await axios.post("/profile/customer/update", customerInfo))
    } catch (error) {
      console.log(error)
    }
  })

  // -- If cancel --
  document.getElementById('profile-cancel-btn').addEventListener('click', () => {
    // Revert all changes back to variables
    nameEl.innerHTML = nameTemp
    locationEl.innerHTML = location
    bioEl.innerHTML = bioTemp
    profileWrapper.classList.toggle('profile-wrapper-edit')
    dpEl.src = dpTemp
  })


  // if (mq.matches) {
  //   // -- Horizontal scrolling --
  //   projScroll.addEventListener('wheel', function(e) {
  //     if (e.deltaY > 0) {
  //       projScroll.scrollLeft += 100
  //     } else {
  //       projScroll.scrollLeft -= 100
  //     }
  //     e.preventDefault()
  //   })
  // }

  // for (var i=0; i < billingCards.length; i++) {
  //   console.log(billingCards)
  //   billingCards[i].onclick = function(event) {
  //     this.classList.toggle('billing-card-active')
  //   }
  // }

  // try {
  //   allMakes = (await axios.get("/profile/customer/fetch/makes"))["data"]["content"]
  // } catch (error) {
  //   console.log(error)
  //   return
  // }

  // try {
  //   allProjects = (await axios.get("/profile/customer/fetch/all_proj"))["data"]["content"]
  // } catch (error) {
  //   console.log(error)
  //   return
  // }

  // makeKeys = new Object()
  // allMakes.forEach(function(make, i) {
  //   makeKeys[make.id] = i
  // })

  // newEditProjScreen = document.getElementById('new-edit-proj-screen')
  // newEditProjScreenOverlay = document.getElementById('new-edit-proj-screen-overlay')

  // makeLabelContainer = document.getElementById('make-labels-container')
  // makeBlobContainer = document.getElementById('make-blobs-container')

  // // Render all make labels
  // allMakes.forEach(function(make, i) {

  //   // Create make label markup
  //   let el = document.createElement('div')
  //   el.className = 'make-label'
  //   el.id = 'make-label-' + make.id
  //   makeLabelContainer.appendChild(el)
  //   el.appendChild(document.createElement('p')).innerHTML = make.file.name
  //   let tick = document.createElement('i')
  //   tick.className = 'fas fa-check-circle'
  //   el.appendChild(document.createElement('i')).className = 'far fa-check-circle'
  //   let tooltipWrapper = document.createElement('div')
  //   tooltipWrapper.className = 'tooltip-wrapper'
  //   let tooltipEl = document.createElement('div')
  //   tooltipEl.className = 'make-label-tooltip'
  //   tooltipEl.appendChild(document.createElement('p')).innerHTML = 'M: ' + make.material.toUpperCase()
  //   tooltipEl.appendChild(document.createElement('p')).innerHTML = 'Q: ' + capitaliseFirstLetter(make.quality)
  //   tooltipEl.appendChild(document.createElement('p')).innerHTML = 'S: ' + 
  //   capitaliseFirstLetter(make.strength)
  //   tooltipEl.appendChild(document.createElement('p')).innerHTML = 'C: ' + 
  //   capitaliseFirstLetter(make.colour)
  //   tooltipWrapper.appendChild(tooltipEl)
  //   el.appendChild(tooltipWrapper)

  //   // Event listener for toggling label
  //   el.addEventListener('click', () => {
  //     if (el.classList.contains('make-label-active')) {
  //       document.getElementById('make-blob-' + make.id).remove()
  //     } else {
  //       renderMakeBlobs(make)
  //     }
  //     el.childNodes[1].classList.toggle('fas')
  //     el.childNodes[1].classList.toggle('far')
  //     el.classList.toggle('make-label-active')
  //   })

  //   el.addEventListener('mouseover', () => {
  //     tooltipWrapper.style.top = el.offsetTop - makeLabelContainer.scrollTop - tooltipWrapper.offsetHeight/2 + el.offsetHeight/2 + 'px'
  //   })
  // })

  // // Render all project cards
  // allProjects.forEach(function(project, i) {
  //   // IIFE
  //   renderProjCard(true, project)
  // })

  // newEditProjScreenOverlay.addEventListener('click', () => {
  //   hideProjPopup()
  // })
  // document.getElementById('new-edit-proj-x').addEventListener('click', () => {
  //   hideProjPopup()
  // })
  // document.getElementById('new-edit-proj-bookmark').addEventListener('click', (e) => {
  //   e.stopPropagation()
  //   e.target.classList.toggle('fas')
  //   e.target.classList.toggle('far')
  // })

  // document.getElementById('new-edit-proj-btn').addEventListener('click', () => {
  //   showProjPopup('new')
  // })

  // document.getElementById('delete-proj').addEventListener('click', async() => {
  //   let callback
  //   try {
  //     callback = (await axios.post("/profile/customer/delete/proj", {id: activeProjID}))
  //   } catch (error) {
  //     return console.log(error)
  //   }

  //   document.getElementById('proj-' + activeProjID).remove()
  //   hideProjPopup(callback["data"]["status"], 'delete')
  // })

  // document.getElementById('save-proj').addEventListener('click', async() => {

  //   if (activeProjID) {
  //     let proj = new Object()
  //     proj.updates = new Object()

  //     // Update existing project
  //     proj.id = activeProjID

  //     proj.updates.bookmark = document.getElementById('new-edit-proj-bookmark').classList.contains('fas')

  //     proj.updates.makes = []
  //     let children = makeBlobContainer.children
  //     for (var i = 0; i < children.length; i++) {
  //       proj.updates.makes[i] = children[i].id.split('-')[2]
  //     }

  //     proj.updates.name = document.getElementById('new-edit-proj-name').value
  //     proj.updates.notes = document.getElementById('new-edit-proj-notes').value

  //     // TO DO: future
  //     proj.updates.image = undefined

  //     let callback
  //     try {
  //       callback = (await axios.post("/profile/customer/update/proj", proj))
  //     } catch (error) {
  //       console.log(error)
  //     }

  //     console.log(callback)

  //     // Re-render project card
  //     renderProjCard(false, proj.updates)
  //     hideProjPopup(callback["data"]["status"], 'edit')

  //   } else {
  //     // New project
  //     let proj = new Project()

  //     proj.bookmark = document.getElementById('new-edit-proj-bookmark').classList.contains('fas')

  //     let children = makeBlobContainer.children
  //     for (var i = 0; i < children.length; i++) {
  //       proj.makes[i] = children[i].id.split('-')[2]
  //     }

  //     proj.name = document.getElementById('new-edit-proj-name').value
  //     proj.notes = document.getElementById('new-edit-proj-notes').value

  //     // TO DO: future
  //     proj.image = undefined

  //     let callback
  //     try {
  //       callback = (await axios.post("/profile/customer/new/proj", proj))
  //     } catch (error) {
  //       console.log(error)
  //     }

  //     console.log(callback)
  //     // Render project card
  //     renderProjCard(true, callback["data"]["content"])
  //     hideProjPopup(callback["data"]["status"], 'new')
  //   }
  // })

  // -- Prerender selected tab -- 
  //document.getElementById(localStorage.getItem('tab') + '-tab').checked = true
  //document.getElementById(localStorage.getItem('tab') + '-area').style.display = "flex"

}