/* ========================================================================================
VARIABLES - PROJECTS
======================================================================================== */

let projects = {
  // VARIABLES
  // FUNCTIONS
  initialise: undefined,
  declareVariables: undefined,
  eventListeners: undefined,
  loadUserData: undefined,
  capFirstLetter: undefined,
  renderFavCard: undefined,
  updateFavCard: undefined,
  renderSmallCard: undefined,
  updateSmallCard: undefined,
  renderMakeBars: undefined,
  toggleMakeBars: undefined,
  renderMakeBlobs: undefined,
  removeMakeBlobs: undefined,
  renderProjPop: undefined,
  showProjPop: undefined,
  hideProjPop: undefined,
  cancel: undefined,
  saveNew: undefined,
  saveExisting: undefined,
  trash: undefined,
  updateBookmark: undefined,
  previewImage: undefined,
  collectNewProject: undefined,
  collectExistingProject: undefined
}

/* ========================================================================================
FUNCTIONS - PROJECTS
======================================================================================== */

// @func  projects.initialise
// @desc  
projects.initialise = async () => {
  // DECLARE VARIABLES
  projects.declareVariables()
  var favs = 0
  // render all project cards
  if (profile.allProjects.length) {
    profile.allProjects.forEach(function (project, i) {
      projects.renderSmallCard(project)
      projects.renderProjPop(project, profile.allMakes)
    })
    console.log(profile.allProjects)
    profile.allProjects.sort(function(a, b) {
      return new Date(a.date.modified) - new Date(b.date.modified)
    })
    profile.allProjects.forEach(function (project, i) {
      if (project.bookmark) {
        projects.renderFavCard(project)
        favs += 1
      }
    })
  }
  document.getElementById('proj-fav-header').innerHTML = 'Favourites (' + favs + ')'
  document.getElementById('proj-new-header').innerHTML = 'All (' + profile.allProjects.length + ')'
  projects.eventListeners()
  projects.renderProjPop(null, profile.allMakes)
}

// @func  projects.declareVariables
// @desc  
projects.declareVariables = () => {
  swiper = new Swiper('.swiper-container');
}

projects.eventListeners = () => {
  const mq = window.matchMedia("(min-width: 850px)")

  let fav = document.getElementById('proj-fav-container')
  fav.addEventListener('wheel', function (e) {
    if (e.deltaY > 0) {
      fav.scrollLeft += 100
    } else {
      fav.scrollLeft -= 100
    }
    e.preventDefault()
  })
  let all = document.getElementById('proj-all-container')
  all.addEventListener('wheel', function (e) {
    if (mq.matches) {
      if (e.deltaY > 0) {
        all.scrollLeft += 100
      } else {
        all.scrollLeft -= 100
      }
      e.preventDefault()
    }
  })

  document.getElementById('proj-add').addEventListener('click', () => {
    projects.showProjPop()
  })
}

projects.loadUserData = async () => {
  // FETCH MAKES
  let dataOne;
  try {
    dataOne = (await axios.get("/profile/customer/fetch/makes"))["data"];
  } catch (error) {
    dataOne = { status: "error", content: error };
  }
  if (dataOne.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(dataOne.content); // TEMPORARY
    return;
  } else if (dataOne.status === "failed") {
    // TO DO .....
    // FAILED HANDLER
    // TO DO .....
    console.log(dataOne.content); // TEMPORARY
    return;
  }
  const allMakes = dataOne.content;
  // FETCH PROJECTS
  let dataTwo;
  try {
    dataTwo = (await axios.get("/profile/customer/fetch/all_proj"))["data"];
  } catch (error) {
    dataTwo = { status: "error", content: error };
  }
  if (dataTwo.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(dataTwo.content); // TEMPORARY
    return;
  } else if (dataTwo.status === "failed") {
    // TO DO .....
    // FAILED HANDLER
    // TO DO .....
    console.log(dataTwo.content); // TEMPORARY
    return;
  }
  const allProjects = dataTwo.content;
  // SUCCESS HANDLER
  return [allProjects, allMakes];
}

projects.capFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

projects.renderFavCard = (proj) => {
  // main card
  let cardEl = document.createElement('div')
  cardEl.id = proj.id + '-proj-fav'
  cardEl.className = 'proj-fav'
  cardEl.addEventListener('click', () => {
    projects.showProjPop(proj.id)
  })
  // thumbnail
  let imgEl = document.createElement('img')
  cardEl.appendChild(imgEl).className = 'proj-fav-img'
  // TO DO: project thumbnail
  imgEl.src = '/profile/projects/retrieve-thumbnail/' + proj.id + '?' + new Date().getTime() 
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
    makesEl.innerHTML += make.file.name
  })
  // notes
  let notesEl = document.createElement('div')
  contentEl.appendChild(notesEl).className = 'proj-fav-notes'
  notesEl.innerHTML = proj.notes
  // render
  document.getElementById('proj-fav-container').prepend(cardEl)
}

projects.updateFavCard = (proj) => {
  // main card
  let cardEl = document.getElementById('proj-fav-' + proj.id)
  // name
  cardEl.querySelector('.proj-fav-name').innerHTML = proj.name

  // TO DO: thumbnail
  cardEl.querySelector('.proj-fav-img').src = '/profile/projects/retrieve-thumbnail/' + proj.thumbnail

  // makes
  let makesEl = cardEl.querySelector('.proj-fav-makes')
  makesEl.innerHTML = ''
  proj.makes.forEach(function (make, j) {
    if (makesEl.innerHTML !== '') {
      makesEl.innerHTML += ', '
    }
    makesEl.innerHTML += make.file.name
  })
  // notes
  cardEl.querySelector('.proj-fav-notes').innerHTML = proj.notes
}

projects.renderSmallCard = (proj) => {
  // main card
  let cardEl = document.createElement('div')
  cardEl.id = proj.id + '-proj-small'
  cardEl.addEventListener('click', () => {
    projects.showProjPop(proj.id)
  })
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
  // TO DO: thumbnail
  imgEl.src = '/profile/projects/retrieve-thumbnail/' + proj.id
  // name
  let nameEl = document.createElement('div')
  cardEl.appendChild(nameEl).className = 'proj-small-name'
  let pEl = document.createElement('p')
  pEl.innerHTML = proj.name
  nameEl.appendChild(pEl)
  // render
  document.getElementById('proj-all-container').appendChild(cardEl).className = 'proj-small'
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
  cardEl.querySelector('.proj-small-img').src = '/profile/projects/retrieve-thumbnail/' + proj.id
}

projects.renderMakeBars = (allMakes, proj, container) => {

  if (!proj) {
    proj = new Object()
    proj.id = 'new'
    proj.makes = []
  }

  // Render all make bars
  allMakes.forEach(function (make) {
    // main bar
    let el = document.createElement('div')
    el.className = 'proj-pop-bar'
    el.id = proj.id + '-' + make.id + '-proj-pop-bar'
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
    tooltipEl.appendChild(document.createElement('p')).innerHTML = 'Q: ' + projects.capFirstLetter(make.quality)
    tooltipEl.appendChild(document.createElement('p')).innerHTML = 'S: ' +
      projects.capFirstLetter(make.strength)
    tooltipEl.appendChild(document.createElement('p')).innerHTML = 'C: ' +
      projects.capFirstLetter(make.colour)
    tooltipWrapper.appendChild(tooltipEl)
    el.appendChild(tooltipWrapper)

    // Event listener for toggling label
    el.addEventListener('click', () => {
      projects.toggleMakeBars(el, make, proj.id)
    })

    el.addEventListener('mouseover', () => {
      tooltipWrapper.style.top = el.offsetTop - container.scrollTop - tooltipWrapper.offsetHeight / 2 + el.offsetHeight / 2 + 'px'
    })

    // render
    container.appendChild(el)
  })

  if (proj.makes.length) {
    proj.makes.forEach(function (make) {
      let bar = document.getElementById(proj.id + '-' + make.id + '-proj-pop-bar')
      bar.classList.toggle('proj-pop-bar-active')
      bar.querySelector('i').className = 'fa-check-circle fas'
      projects.renderMakeBlobs(make, proj.id)
    })
  }
}

// 
projects.toggleMakeBars = (bar, make, projID) => {
  // toggle blob
  if (bar.classList.contains('proj-pop-bar-active')) {
    projects.removeMakeBlobs(document.getElementById(projID + '-' + make.id + '-proj-pop-blob'))
  } else {
    projects.renderMakeBlobs(make, projID)
  }
  // toggle bar
  bar.querySelector('i').classList.toggle('fas')
  bar.querySelector('i').classList.toggle('far')
  bar.classList.toggle('proj-pop-bar-active')
}

projects.renderMakeBlobs = (make, projID) => {

  let el = document.createElement('div')
  el.className = 'proj-pop-blob'
  el.id = projID + '-' + make.id + '-proj-pop-blob'
  el.appendChild(document.createElement('p')).innerHTML = make.file.name
  el.appendChild(document.createElement('div')).className = 'proj-pop-blob-x'

  el.addEventListener('click', () => {
    projects.toggleMakeBars(document.getElementById(projID + '-' + make.id + '-proj-pop-bar'), make, projID)
  })

  // render
  document.getElementById(projID + '-proj-pop-wrapper').querySelector('.proj-pop-blob-container').appendChild(el)
}

projects.removeMakeBlobs = (blob) => {
  blob.remove()
}

projects.renderProjPop = (proj, allMakes) => {

  // main wrapper
  let wrapper = document.createElement('div')
  wrapper.className = 'proj-pop-wrapper'
  document.getElementById('proj-area-wrapper').appendChild(wrapper)
  // back button
  let back = document.createElement('div')
  back.className = 'proj-pop-back'
  back.addEventListener('click', () => {
    projects.cancel(back)
  })
  wrapper.appendChild(back)
  let temp = document.createElement('p')
  temp.innerHTML = 'Cancel'
  back.appendChild(temp)
  // pop-up screen
  let container = document.createElement('div')
  container.className = 'proj-pop-container'
  wrapper.appendChild(container)
  // left container
  let left = document.createElement('div')
  left.className = 'proj-pop-left'
  container.appendChild(left)
  let label = document.createElement('label')
  left.appendChild(label)
  let form = document.createElement('form')
  left.appendChild(form)
  let input = document.createElement('input')
  input.type = 'file'
  input.name = 'picture'
  input.accept = 'image/*'
  input.setAttribute('onchange', 'projects.previewImage(this, event);')
  form.appendChild(input)
  // image
  let image = document.createElement('img')
  image.className = 'proj-pop-img'
  image.alt = 'Project Thumbnail'
  left.appendChild(image)
  let imgOverlay = document.createElement('div')
  imgOverlay.className = 'proj-pop-img-overlay'
  left.appendChild(imgOverlay)
  let edit = document.createElement('div')
  edit.className = 'proj-pop-img-edit'
  edit.innerHTML = 'Click anywhere on the image to edit'
  left.appendChild(edit)
  // mid container
  let mid = document.createElement('div')
  mid.className = 'proj-pop-mid'
  container.appendChild(mid)
  // bookmark
  let bookmark = document.createElement('i')
  bookmark.className = 'far fa-bookmark proj-pop-bookmark'
  bookmark.addEventListener('click', () => {
    bookmark.classList.toggle('fas')
    bookmark.classList.toggle('far')
  })
  mid.appendChild(bookmark)
  // name
  let name = document.createElement('h3')
  name.innerHTML = 'Name'
  mid.appendChild(name)
  let nameInput = document.createElement('input')
  nameInput.type = 'text'
  nameInput.className = 'proj-pop-name'
  nameInput.placeholder = 'Give your project a name'
  mid.appendChild(nameInput)
  let makes = document.createElement('h3')
  makes.className = 'proj-pop-makes-header'
  makes.innerHTML = 'Makes'
  mid.appendChild(makes)
  let makesContainer = document.createElement('div')
  makesContainer.className = 'proj-pop-blob-container'
  mid.appendChild(makesContainer)
  let notes = document.createElement('h3')
  notes.innerHTML = 'Notes'
  mid.appendChild(notes)
  let notesInput = document.createElement('textarea')
  notesInput.className = 'proj-pop-notes'
  notesInput.placeholder = 'Add notes to your project'
  notesInput.style.resize = 'none'
  mid.appendChild(notesInput)
  // buttons
  let btnContainer = document.createElement('div')
  btnContainer.className = 'proj-pop-btn-container'
  mid.appendChild(btnContainer)
  let del = document.createElement('i')
  del.className = 'far fa-trash-alt proj-pop-delete'
  del.addEventListener('click', () => {
    projects.trash(proj.id)
  })
  btnContainer.appendChild(del)
  let saveWeb = document.createElement('button')
  saveWeb.className = 'grad-btn proj-pop-save'
  saveWeb.innerHTML = 'Save'
  saveWeb.addEventListener('click', (e) => {
    if (e.target.classList.contains('new-proj-save-btn')) {
      projects.saveNew(allMakes)
    } else {
      projects.saveExisting(proj.id, allMakes)
    }
  })
  btnContainer.appendChild(saveWeb)
  // right container
  let right = document.createElement('div')
  right.className = 'proj-pop-right'
  container.appendChild(right)
  let addMakes = document.createElement('h3')
  addMakes.innerHTML = 'Add to your project'
  right.appendChild(addMakes)
  let barWrapper = document.createElement('div')
  barWrapper.className = 'proj-pop-bar-wrapper'
  right.appendChild(barWrapper)
  let barContainer = document.createElement('div')
  barContainer.className = 'proj-pop-bar-container'
  barWrapper.appendChild(barContainer)
  let temp2 = document.createElement('p')
  temp2.innerHTML = 'You can add Makes to this project later'
  right.appendChild(temp2)
  // mobile save and delete buttons
  let btnContainerMob = document.createElement('div')
  btnContainerMob.className = 'proj-pop-btn-container'
  container.appendChild(btnContainerMob)
  let delMob = document.createElement('i')
  delMob.className = 'far fa-trash-alt proj-pop-delete'
  delMob.addEventListener('click', () => {
    projects.trash(proj.id)
  })
  btnContainerMob.appendChild(delMob)
  let saveMob = document.createElement('button')
  saveMob.className = 'grad-btn proj-pop-save'
  saveMob.innerHTML = 'Save'
  saveMob.addEventListener('click', (e) => {
    if (e.target.classList.contains('new-proj-pop-wrapper')) {
      projects.saveNew(allMakes)
    } else {
      projects.saveExisting(proj.id, allMakes)
    }
  })
  btnContainerMob.appendChild(saveMob)

  if (proj) {
    wrapper.id = proj.id + '-proj-pop-wrapper'
    form.id = proj.id + '-proj-img-form'
    label.htmlFor = proj.id + '-proj-pop-img-input'
    input.id = proj.id + '-proj-pop-img-input'
    image.src = '/profile/projects/retrieve-thumbnail/' + proj.id
    if (proj.bookmark) {
      bookmark.className = 'fas fa-bookmark proj-pop-bookmark'
    }
    nameInput.value = proj.name
    notesInput.value = proj.notes
    projects.renderMakeBars(allMakes, proj, barContainer)
  } else {
    wrapper.id = 'new-proj-pop-wrapper'
    form.id = 'new-proj-img-form'
    label.htmlFor = 'new-proj-pop-img-input'
    input.id = 'new-proj-pop-img-input'
    image.src = '/public/images/profile/project-thumbnail.jpeg'
    saveMob.classList.add('new-proj-save-btn')
    saveWeb.classList.add('new-proj-save-btn')
    projects.renderMakeBars(allMakes, null, barContainer)
  }
}

projects.hideProjPop = (status, condition, projID) => {
  // transition screens
  if (window.matchMedia("(min-width: 850px)").matches) {
    document.getElementById('proj-card-wrapper').style.top = '0'
  }
  // not deleting
  if (projID) {
    document.getElementById(projID + '-proj-pop-wrapper').style.top = '100%'
  }
  // notification
  if (status) {
    projectNotif(status, condition)
  }
}

projects.showProjPop = (projID) => {
  // transition screens
  if (window.matchMedia("(min-width: 850px)").matches) {
    document.getElementById('proj-card-wrapper').style.top = '-100%'
  }
  if (projID) {
    document.getElementById(projID + '-proj-pop-wrapper').style.top = '0'
  } else {
    document.getElementById('new-proj-pop-wrapper').style.top = '0'
  }
}

projects.cancel = (el) => {
  // transition screens
  document.getElementById('proj-card-wrapper').style.top = '0'
  el.parentElement.style.top = '100%'
}

projects.saveNew = async (allMakes) => {
  let wrapper = document.getElementById('new-proj-pop-wrapper');
  // COLLECT INPUT
  const proj = await projects.collectNewProject();
  // SEND REQUEST
  let data;
  try {
    data = (await axios.post("/profile/customer/new/proj", proj))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return;
  } else if (data.status === "failed") {
    return projects.hideProjPop(data["status"], 'new', data["content"]["id"]);
  }
  // UPDATE POPUP
  wrapper.id = data["content"]["id"] + '-proj-pop-wrapper'
  wrapper.querySelector('#new-proj-img-form').id = data["content"]["id"] + '-proj-img-form'
  wrapper.querySelector('label').htmlFor = data["content"]["id"] + '-proj-pop-img-input'
  wrapper.querySelector('#new-proj-pop-img-input').id = data["content"]["id"] + '-proj-pop-img-input'
  wrapper.querySelector('.proj-pop-img').src = '/profile/projects/retrieve-thumbnail/' + data["content"]["id"]
  let blobs = wrapper.querySelector('.proj-pop-blob-container').children
  for (var i = 0; i < blobs.length; i++) {
    var newBlobId = blobs[i].id.split('-')
    newBlobId.splice(0, 1, data["content"]["id"])
    blobs[i].id = newBlobId.join('-')
  }
  let bars = wrapper.querySelector('.proj-pop-blob-container').children
  for (var i = 0; i < bars.length; i++) {
    var newBlobId = bars[i].id.split('-')
    newBlobId.splice(0, 1, data["content"]["id"])
    bars[i].id = newBlobId.join('-')
  }
  wrapper.querySelectorAll('.new-proj-save-btn').forEach(function (btn, i) {
    btn.classList.remove('new-proj-save-btn')
  })
  // render project cards
  if (data["content"]["bookmark"]) {
    projects.renderFavCard(data["content"])
    document.getElementById('proj-fav-header').innerHTML = `Favourites (${document.getElementById('proj-fav-container').children.length})`
  }
  projects.renderSmallCard(data["content"])
  projects.renderProjPop(null, allMakes)
  document.getElementById('proj-new-header').innerHTML = `All (${document.getElementById('proj-all-container').children.length - 1})`
  // SUCCESS HANDLER
  return projects.hideProjPop(data["status"], 'new', data["content"]["id"]);
}

projects.saveExisting = async (projID, allMakes) => {
  // COLLECT INPUT
  const proj = await projects.collectExistingProject(projID);
  // SEND REQUEST
  let data;
  try {
    data = (await axios.post("/profile/customer/update/proj", proj))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return;
  } else if (data.status === "failed") {
    return projects.hideProjPop(data["status"], 'edit', projID);
  }
  // UPDATE FAV CARD
  favCard = document.getElementById(projID + '-proj-fav')
  if (data["content"]["bookmark"]) { // bookmarked
    if (favCard) { // fav card already exists, modify
      favCard.querySelector('.proj-fav-name').innerHTML = data["content"]["name"]
      let makesEl = favCard.querySelector('.proj-fav-makes')
      makesEl.innerHTML = ''
      data["content"]["makes"].forEach(function (make, j) {
        if (makesEl.innerHTML !== '') {
          makesEl.innerHTML += ', '
        }
        makesEl.innerHTML += make.file.name
      })
      favCard.querySelector('.proj-fav-notes').innerHTML = data["content"]["notes"]
      favCard.querySelector('.proj-fav-img').src = '/profile/projects/retrieve-thumbnail/' + projID + '?' + new Date().getTime()
    } else { // fav card does not exist, create new
      projects.renderFavCard(data["content"])
    }
  } else { // not bookmarked
    if (favCard) { // fav card exists, delete
      favCard.remove()
    }
  }
  document.getElementById('proj-fav-header').innerHTML = `Favourites (${document.getElementById('proj-fav-container').children.length})`
  // UPDATE SMALL CARD
  smallCard = document.getElementById(projID + '-proj-small')
  if (data["content"]["bookmark"]) {
    smallCard.querySelector('.fa-bookmark').className = 'fas fa-bookmark'
  } else {
    smallCard.querySelector('.fa-bookmark').className = 'far fa-bookmark'
  }
  smallCard.querySelector('.proj-small-name').children[0].innerHTML = data["content"]["name"]
  console.log(smallCard.querySelector('.proj-small-img').src)
  smallCard.querySelector('.proj-small-img').src = document.getElementById(projID + '-proj-pop-wrapper').querySelector('.proj-pop-img').src
  console.log(smallCard.querySelector('.proj-small-img').src)
  // SUCCESS HANDLER
  projects.renderProjPop(null, allMakes);
  return projects.hideProjPop(data["status"], 'edit', projID);
}

projects.trash = async (projID) => {
  // SEND REQUEST
  let data;
  try {
    data = (await axios.post("/profile/customer/delete/proj", { id: projID }))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return;
  } else if (data.status === "failed") {
    return projects.hideProjPop(data["status"], 'delete', null);
  }
  // UPDATE RENDER
  document.getElementById(projID + '-proj-pop-wrapper').remove()
  document.getElementById(projID + '-proj-small').remove()
  if (document.getElementById(projID + '-proj-fav')) {
    document.getElementById(projID + '-proj-fav').remove()
    document.getElementById('proj-fav-header').innerHTML = `Favourites (${document.getElementById('proj-fav-container').children.length})`
  }
  document.getElementById('proj-new-header').innerHTML = `All (${document.getElementById('proj-all-container').children.length - 1})`
  // SUCCESS HANDLER
  return projects.hideProjPop(data["status"], 'delete', null);
}

projects.updateBookmark = async (e, proj, bookmarkEl) => {
  e.stopPropagation()
  // COLLECT INPUT
  let modifiedProj = new Object()
  modifiedProj.updates = new Object()
  modifiedProj.id = proj.id
  modifiedProj.updates.bookmark = !proj.bookmark
  // CREATE INPUT OBJECT
  let input = new FormData();
  input.append("updates", JSON.stringify(modifiedProj.updates));
  input.append("id", modifiedProj.id);
  // UPDATE CSS
  bookmarkEl.classList.toggle('fas');
  bookmarkEl.classList.toggle('far');
  document.getElementById(proj.id + '-proj-pop-wrapper').querySelector('.proj-pop-bookmark').classList.toggle('fas');
  document.getElementById(proj.id + '-proj-pop-wrapper').querySelector('.proj-pop-bookmark').classList.toggle('far');
  // SEND REQUEST
  let data;
  try {
    data = (await axios.post("/profile/customer/update/proj", input))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return;
  } else if (data.status === "failed") {
    // TO DO .....
    // FAILED HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return;
  }
  // UPDATE CSS
  if (bookmarkEl.classList.contains('fas')) {
    projects.renderFavCard(data.content)
  } else {
    document.getElementById(proj.id + '-proj-fav').remove()
  }
  document.getElementById('proj-fav-header').innerHTML = `Favourites (${document.getElementById('proj-fav-container').children.length})`
  // SUCCESS HANDLER
  return;
}

projects.previewImage = (el, event) => {
  el.parentElement.parentElement.querySelector('.proj-pop-img').src = URL.createObjectURL(event.target.files[0])
}

projects.collectNewProject = async () => {
  const wrapper = document.getElementById('new-proj-pop-wrapper');
  // CONSTRUCT INPUT OBJECT
  let project = new Object();
  project.name = wrapper.querySelector('.proj-pop-name').value;
  project.bookmark = wrapper.querySelector('.proj-pop-bookmark').classList.contains('fas');
  project.notes = wrapper.querySelector('.proj-pop-notes').value;
  // Property: Makes
  project.makes = [];
  let children = wrapper.querySelector('.proj-pop-blob-container').children;
  for (var i = 0; i < children.length; i++) project.makes[i] = children[i].id.split('-')[1];
  // input object
  let input;
  const file = document.querySelector("#new-proj-pop-img-input");
  if (file.files.length !== 0) {
    // input = new FormData(document.querySelector("#new-proj-img-form"));
    input = await global.compressImage("new-proj-img-form", "picture", 400);
  } else {
    input = new FormData();
  }
  input.append("project", JSON.stringify(project));
  // SUCCESS HANDLER
  return input;
}

projects.collectExistingProject = async (projID) => {
  let wrapper = document.getElementById(projID + "-proj-pop-wrapper");
  // CONSTRUCT OBJECT
  let project = new Object();
  project.updates = new Object();
  // Project ID for identifier
  project.id = projID;
  // Project Updates
  project.updates.name = wrapper.querySelector('.proj-pop-name').value;
  project.updates.bookmark = wrapper.querySelector('.proj-pop-bookmark').classList.contains('fas');
  project.updates.notes = wrapper.querySelector('.proj-pop-notes').value;
  // Property: Makes
  project.updates.makes = [];
  let children = wrapper.querySelector('.proj-pop-blob-container').children;
  for (var i = 0; i < children.length; i++) project.updates.makes[i] = children[i].id.split('-')[1];
  // input object
  let input;
  const file = document.getElementById(projID + "-proj-pop-img-input");
  if (file.files.length !== 0) {
    // input = new FormData(document.getElementById(projID + "-proj-img-form"));
    input = await global.compressImage(projID + "-proj-img-form", "picture", 400);
  } else {
    input = new FormData();
  }
  input.append("updates", JSON.stringify(project.updates));
  input.append("id", project.id);
  // SUCCESS HANDLER
  return input;
}

/* ========================================================================================
END - PROJECTS
======================================================================================== */