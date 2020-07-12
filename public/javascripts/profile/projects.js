/* ========================================================================================
VARIABLES - PROJECTS
======================================================================================== */

console.log('projects here')

let projects = {
  // VARIABLES
  // FUNCTIONS
  initialise: undefined,
  declareVariables: undefined,
  loadUserData: undefined,
  capFirstLetter: undefined,
  renderFavCard: undefined,
  updateFavCard: undefined,
  renderSmallCard: undefined,
  updateSmallCard: undefined,
  renderMakeBars: undefined,
  toggleMakeBars: undefined,
  renderMakeBlobs: undefined,
  toggleMakeBlobs: undefined,
  hideProjPop: undefined,
  showProjPop: undefined,
  updateBookmark: undefined
}

/* ========================================================================================
FUNCTIONS - PROJECTS
======================================================================================== */

// @func  projects.initialise
// @desc  
projects.initialise = async () => {
  // DECLARE VARIABLES
  projects.declareVariables();
  // allProjects, allMakes, makeKeys = projects.loadUserData();
  // // render all project cards
  // allProjects.forEach(function(project, i) {
  //   renderFavProj(true, project)
  // })
  let testProj = {
    id: 123456789,
    name: 'Test Project',
    image: '/public/images/profile/project-thumbnail.jpeg',
    makes: ['Test Make A', 'Test Make B'],
    notes: 'Lorem ipsum'
  }
  projects.renderFavCard(testProj)
  projects.renderSmallCard(testProj)
}

// @func  projects.declareVariables
// @desc  
projects.declareVariables = () => {
  swiper = new Swiper('.swiper-container');
}

// TEMPORARILY COMMENTED
// projects.loadUserData = () => {
//   try {
//     allMakes = (await axios.get("/profile/customer/fetch/makes"))["data"]["content"]
//   } catch (error) {
//     console.log(error)
//     return
//   }

//   try {
//     allProjects = (await axios.get("/profile/customer/fetch/all_proj"))["data"]["content"]
//   } catch (error) {
//     console.log(error)
//     return
//   }

//   makeKeys = new Object()
//   allMakes.forEach(function(make, i) {
//     makeKeys[make.id] = i
//   })

//   return allProjects, allMakes, makeKeys
// }

projects.capFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

projects.renderFavCard = (proj) => {
  // main card
  let cardEl = document.createElement('div')
  cardEl.id = 'proj-fav-' + proj.id
  cardEl.setAttribute('onclick', "projects.showProjPop(false," + proj.id + ");")
  // thumbnail
  let imgEl = document.createElement('img')
  cardEl.appendChild(imgEl).className = 'proj-fav-img'
  imgEl.src = proj.image
  // overlay
  let overlayEl = document.createElement('div')
  cardEl.appendChild(overlayEl).className = 'proj-fav-overlay'
  // content container
  let contentEl = document.createElement('div')
  cardEl.appendChild(contentEl).className = 'proj-fav-content'
  // name
  let nameEl = document.createElement('div')
  nameEl.innerHTML = proj.name
  contentEl.appendChild(nameEl).className = 'proj-fav-name'
  // makes
  let makesEl = document.createElement('div')
  contentEl.appendChild(makesEl).className = 'proj-fav-makes'
  proj.makes.forEach(function (make, j) {
    if (makesEl.innerHTML !== '') {
      makesEl.innerHTML += ', '
    }
    makesEl.innerHTML += make
  })
  // notes
  let notesEl = document.createElement('div')
  contentEl.appendChild(notesEl).className = 'proj-fav-notes'
  notesEl.innerHTML = proj.notes
  // render
  document.getElementById('proj-fav-container').appendChild(cardEl).className = 'proj-fav'

  // TO DO: on click, edit project
  // cardEl.addEventListener('click', () => {

  //   // Show new/edit project screen
  //   showProjPop('edit', project.id)

  //   if (makesEl.id !== "") {
  //     makesEl.id.split(' ').forEach(function (makeInProject, k) {
  //       // Add project blobs
  //       renderMakeBlobs(allMakes[makeKeys[makeInProject]])
  //       // Activate project labels
  //       document.getElementById('make-label-' + makeInProject).classList.toggle('make-label-active')
  //       document.getElementById('make-label-' + makeInProject).childNodes[1].className = 'fas fa-check-circle'
  //     })
  //   }

  // })
}

projects.updateFavCard = (proj) => {
  // main card
  let cardEl = document.getElementById('proj-fav-' + proj.id)
  // name
  cardEl.querySelector('.proj-fav-name').innerHTML = proj.name

  // TO DO
  cardEl.querySelector('.proj-fav-img').src = proj.image

  // makes
  let makesEl = cardEl.querySelector('.proj-fav-makes')
  makesEl.innerHTML = ''
  proj.makes.forEach(function (make, j) {
    if (makesEl.innerHTML !== '') {
      makesEl.innerHTML += ', '
    } 
    makesEl.innerHTML += make
  })
  // notes
  cardEl.querySelector('.proj-fav-notes').innerHTML = proj.notes
}

projects.renderSmallCard = (proj) => {
  // main card
  let cardEl = document.createElement('div')
  cardEl.id = 'proj-small-' + proj.id
  // bookmark
  let bookmarkEl = document.createElement('i')
  if (proj.bookmark) {
    cardEl.appendChild(bookmarkEl).className = 'fas fa-bookmark'
  } else {
    cardEl.appendChild(bookmarkEl).className = 'far fa-bookmark'
  }
  bookmarkEl.addEventListener('click', (e) => {
    projects.updateBookmark(e, proj, bookmarkEl)
  })
  // thumbnail
  let imgEl = document.createElement('img')
  cardEl.appendChild(imgEl).className = 'proj-small-img'
  imgEl.src = proj.image
  // name
  let nameEl = document.createElement('div')
  cardEl.appendChild(nameEl).className = 'proj-small-name'
  let pEl = document.createElement('p')
  pEl.innerHTML = proj.name
  nameEl.appendChild(pEl)
  // render
  document.getElementById('proj-all-container').appendChild(cardEl).className = 'proj-small'

  // TO DO: on click, edit project

}

projects.updateSmallCard = (proj) => {
  // main card
  let cardEl = document.getElementById('proj-small-' + proj.id)
  // bookmark
  let bookmarkEl = cardEl.querySelector('.fa-bookmark')
  if (proj.bookmark) {
    bookmarkEl.className = 'fas fa-bookmark'
  } else {
    bookmarkEl.className = 'far fa-bookmark'
  }
  // name
  cardEl.querySelector('.proj-small-name').innerHTML = proj.name

  // TO DO
  cardEl.querySelector('.proj-small-img').src = proj.image
}

projects.renderMakeBars = (allMakes) => {
  container = document.getElementById('proj-pop-bar-container')

  // Render all make labels
  allMakes.forEach(function(make, i) {
    // container
    // main bar
    let el = document.createElement('div')
    el.className = 'proj-pop-bar'
    el.id = 'proj-pop-bar-' + make.id
    // name
    el.appendChild(document.createElement('p')).innerHTML = make.file.name
    // tick
    el.appendChild(document.createElement('i')).className = 'far fa-check-circle'
    // tooltip
    let tooltipWrapper = document.createElement('div')
    tooltipWrapper.className = 'proj-pop-bar-tooltip-wrapper'
    let tooltipEl = document.createElement('div')
    tooltipEl.className = 'proj-pop-bar-tooltip'
    tooltipEl.appendChild(document.createElement('p')).innerHTML = 'M: ' + make.material.toUpperCase()
    tooltipEl.appendChild(document.createElement('p')).innerHTML = 'Q: ' + capitaliseFirstLetter(make.quality)
    tooltipEl.appendChild(document.createElement('p')).innerHTML = 'S: ' + 
    capitaliseFirstLetter(make.strength)
    tooltipEl.appendChild(document.createElement('p')).innerHTML = 'C: ' + 
    capitaliseFirstLetter(make.colour)
    tooltipWrapper.appendChild(tooltipEl)
    el.appendChild(tooltipWrapper)
    
    // Event listener for toggling label
    el.addEventListener('click', () => {
      projects.toggleMakeBars(el, make)
    })

    
    el.addEventListener('mouseover', () => {
      tooltipWrapper.style.top = el.offsetTop - container.scrollTop - tooltipWrapper.offsetHeight/2 + el.offsetHeight/2 + 'px'
    })
  
    // render
    container.appendChild(el)
  })
}

// 
projects.toggleMakeBars = (el, make) => {
  if (el.classList.contains('proj-pop-bar-active')) {
    document.getElementById('proj-pop-blob-' + make.id).remove()
  } else {
    renderMakeBlobs(make)
  }
  el.childNodes[1].classList.toggle('fas')
  el.childNodes[1].classList.toggle('far')
  el.classList.toggle('proj-pop-bar-active')
}

projects.renderMakeBlobs = (make, container) => {
  let el = document.createElement('div')
  el.className = 'proj-pop-blob'
  el.id = 'proj-pop-blob-' + make.id
  el.appendChild(document.createElement('p')).innerHTML = make.file.name
  el.appendChild(document.createElement('div')).className = 'proj-pop-blob-x'


  // el.addEventListener('click', () => {
  //   projects.toggleMakeBlobs(el, make.id)
  // })
  // verify this works
  el.setAttribute('onclick', "projects.toggleMakeBlobs(this," + make.id + ");")
  // render
  container.appendChild(el)
}

projects.toggleMakeBlobs = (el, id) => {
  // let label = document.getElementById('make-label-' + id)
  // label.classList.toggle('make-label-active')
  // label.childNodes[1].classList.toggle('fas')
  // label.childNodes[1].classList.toggle('far')
  // el.remove()
}

projects.hideProjPop = (callback, status) => {
  // transition screens
  document.getElementById('proj-card-wrapper').style.maxHeight = 'none'
  document.getElementById('proj-pop-wrapper').style.maxHeight = '0'
  // notification
  if (callback) {
    projectNotif(callback, status)
  }

  // reset blobs
  makeBlobContainer.innerHTML = ''
  // reset bars
  let children = document.getElementById('proj-pop-bar-container').children
  for (var i = 0; i < children.length; i++) {
    children[i].className = 'proj-pop-bar'
    children[i].childNodes[1].className = 'far fa-check-circle'
  }
}

projects.showProjPop = (status, project = undefined) => {

  console.log(status, project)
  if (status === 'new') {
    // create new project
    document.getElementById('proj-pop-name').value = ''
    document.getElementById('proj-pop-notes').value = ''
    document.getElementById('proj-pop-bookmark').className = 'far fa-bookmark'
    document.getElementById('proj-pop-delete').style.visibility = 'hidden'
    // activeProjID = undefined
  } else {
    // edit existing project
    document.getElementById('proj-pop-name').value = document.getElementById('proj-' + project).querySelector('.proj-name').innerHTML
    document.getElementById('new-edit-proj-notes').value = document.getElementById('proj-' + project).querySelector('.proj-notes-content').innerHTML
    document.getElementById('new-edit-proj-bookmark').className = document.getElementById('proj-' + project).querySelector('.fa-bookmark').className
    document.getElementById('delete-proj').style.visibility = 'visible'
    activeProjID = project
  }
  // transition screens
  document.getElementById('proj-card-wrapper').style.maxHeight = '0'
  document.getElementById('proj-pop-wrapper').style.maxHeight = 'none'
}

projects.updateBookmark = (e, proj, bookmarkEl) => {
  e.stopPropagation()
  let modifiedProj = new Object()
  modifiedProj.updates = new Object()
  modifiedProj.id = proj.id
  modifiedProj.updates.bookmark = !proj.bookmark
  bookmarkEl.classList.toggle('fas')
  bookmarkEl.classList.toggle('far')
  async function update() { // prevents unhandled promise rejection
    try {
      await axios.post("/profile/customer/update/proj", modifiedProj)
    } catch (error) {
      console.log(error)
    }
  }
  console.log('hi')
}

/* ========================================================================================
END - PROJECTS
======================================================================================== */

var mq = window.matchMedia("(min-width: 850px)")
var activeProjID = undefined

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



  // newEditProjScreen = document.getElementById('new-edit-proj-screen')
  // newEditProjScreenOverlay = document.getElementById('new-edit-proj-screen-overlay')

  // makeLabelContainer = document.getElementById('make-labels-container')
  // makeBlobContainer = document.getElementById('make-blobs-container')



  // newEditProjScreenOverlay.addEventListener('click', () => {
  //   hideProjPop()
  // })
  // document.getElementById('new-edit-proj-x').addEventListener('click', () => {
  //   hideProjPop()
  // })
  // document.getElementById('new-edit-proj-bookmark').addEventListener('click', (e) => {
  //   e.stopPropagation()
  //   e.target.classList.toggle('fas')
  //   e.target.classList.toggle('far')
  // })

  // document.getElementById('new-edit-proj-btn').addEventListener('click', () => {
  //   showProjPop('new')
  // })

  // document.getElementById('delete-proj').addEventListener('click', async() => {
  //   let callback
  //   try {
  //     callback = (await axios.post("/profile/customer/delete/proj", {id: activeProjID}))
  //   } catch (error) {
  //     return console.log(error)
  //   }

  //   document.getElementById('proj-' + activeProjID).remove()
  //   hideProjPop(callback["data"]["status"], 'delete')
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
  //     hideProjPop(callback["data"]["status"], 'edit')

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
  //     hideProjPop(callback["data"]["status"], 'new')
  //   }
  // })