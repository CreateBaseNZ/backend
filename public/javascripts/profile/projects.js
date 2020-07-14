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
  const [allProjects, allMakes] = (await projects.loadUserData())
  // render all project cards
  if (allProjects) {
    allProjects.forEach(function (project, i) {
      if (project.bookmark) {
        projects.renderFavCard(project)
      }
      projects.renderSmallCard(project)
      projects.renderProjPop(project)
    })
  }
  projects.eventListeners()
  projects.renderProjPop(null)
}

// @func  projects.declareVariables
// @desc  
projects.declareVariables = () => {
  swiper = new Swiper('.swiper-container');
}

projects.eventListeners = () => {
  const mq = window.matchMedia("(min-width: 850px)")
  if (mq.matches) {
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
      if (e.deltaY > 0) {
        all.scrollLeft += 100
      } else {
        all.scrollLeft -= 100
      }
      e.preventDefault()
    })
  }

  document.getElementById('proj-add').addEventListener('click', () => {
    projects.showProjPop()
  })
}

projects.loadUserData = async () => {
  // fetch makes
  try {
    allMakes = (await axios.get("/profile/customer/fetch/makes"))["data"]["content"]
  } catch (error) {
    console.log(error)
  }
  // fetch projects
  try {
    allProjects = (await axios.get("/profile/customer/fetch/all_proj"))["data"]["content"]
  } catch (error) {
    console.log(error)
  }
  return [allProjects, allMakes]
}

projects.capFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

projects.renderFavCard = (proj) => {
  // main card
  let cardEl = document.createElement('div')
  cardEl.id = proj.id + '-proj-fav'
  cardEl.addEventListener('click', () => {
    projects.showProjPop(proj.id)
  })
  // thumbnail
  let imgEl = document.createElement('img')
  cardEl.appendChild(imgEl).className = 'proj-fav-img'
  // TO DO: project thumbnail
  imgEl.src = '/profile/projects/retrieve-thumbnail/' + proj.id
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
    makesEl.innerHTML += make
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

projects.renderMakeBars = (allMakes, projID) => {
  container = document.getElementById('proj-pop-bar-container')

  // Render all make labels
  allMakes.forEach(function (make, i) {
    // container
    // main bar
    let el = document.createElement('div')
    el.className = 'proj-pop-bar'
    el.id = projID + make.id + '-proj-pop-bar'
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
      tooltipWrapper.style.top = el.offsetTop - container.scrollTop - tooltipWrapper.offsetHeight / 2 + el.offsetHeight / 2 + 'px'
    })

    // render
    container.appendChild(el)
  })
}

// 
projects.toggleMakeBars = (bar, blob) => {
  // toggle blob
  if (el.classList.contains('proj-pop-bar-active')) {
    projects.removeMakeBlobs(blobs)
  } else {
    renderMakeBlobs(blob)
  }
  // toggle bar
  bar.childNodes[1].classList.toggle('fas')
  bar.childNodes[1].classList.toggle('far')
  bar.classList.toggle('proj-pop-bar-active')
}

projects.renderMakeBlobs = (make, projID) => {
  let el = document.createElement('div')
  el.className = 'proj-pop-blob'
  el.id = projID + make.id + '-proj-pop-blob'
  el.appendChild(document.createElement('p')).innerHTML = make.file.name
  el.appendChild(document.createElement('div')).className = 'proj-pop-blob-x'

  el.addEventListener('click', () => {
    projects.removeMakeBlobs(el)
    projects.toggleMakeBars(document.getElementById(projID + make.id + '-proj-pop-bar'))
  })

  // render
  document.getElementById(projID + '-proj-pop-wrapper').querySelector('.proj-pop-bar-container').appendChild(el)
}

projects.removeMakeBlobs = (blob) => {
  blob.remove()
}

projects.renderProjPop = (proj) => {
  // main wrapper
  let wrapper = document.createElement('div')
  wrapper.className = 'proj-pop-wrapper'
  wrapper.id = 'new-proj-pop-wrapper'
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
  label.htmlFor = 'new-proj-pop-img-input'
  left.appendChild(label)
  let form = document.createElement('form')
  form.id = 'new-proj-img-form'
  left.appendChild(form)
  let input = document.createElement('input')
  input.type = 'file'
  input.name = 'picture'
  input.id = 'new-proj-pop-img-input'
  input.setAttribute('onchange', 'projects.previewImage(this, event);')
  form.appendChild(input)
  // image
  let image = document.createElement('img')
  image.className = 'proj-pop-img'
  image.src = '/public/images/profile/project-thumbnail.jpeg'
  image.alt = 'Project Thumbnail'
  left.appendChild(image)
  let imgOverlay = document.createElement('div')
  imgOverlay.className = 'proj-pop-img-overlay'
  left.appendChild(imgOverlay)
  let edit = document.createElement('div')
  edit.className = 'proj-pop-img-edit'
  edit.innerHTML = 'Click anywhere to edit'
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
  let save = document.createElement('button')
  save.className = 'grad-btn proj-pop-save'
  save.innerHTML = 'Save'
  save.addEventListener('click', (e) => {
    if (e.target.parentElement.parentElement.parentElement.parentElement.id === 'new-proj-pop-wrapper') {
      projects.saveNew()
    } else {
      projects.saveExisting(proj.id)
    }
  })
  btnContainer.appendChild(save)
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
    // render all makeblobs
    // TO DO
    notesInput.value = proj.notes
  }
}

projects.hideProjPop = (status, condition, projID) => {
  // transition screens
  document.getElementById('proj-card-wrapper').style.top = '0'
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
  document.getElementById('proj-card-wrapper').style.top = '-100%'
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

projects.saveNew = async () => {

  let wrapper = document.getElementById('new-proj-pop-wrapper')
  /*
  let proj = new Object()
  // TO DO: get thumbnail
  // proj.image = wrapper.querySelector('.proj-pop-img').src
  proj.bookmark = wrapper.querySelector('.proj-pop-bookmark').classList.contains('fas')
  proj.makes = []
  let children = wrapper.querySelector('.proj-pop-blob-container').children
  for (var i = 0; i < children.length; i++) {
    proj.updates.makes[i] = children[i].id.split('-')[1]
    console.log(children[i].id.split('-')[1])
  }
  proj.name = wrapper.querySelector('.proj-pop-name').value
  proj.notes = wrapper.querySelector('.proj-pop-notes').value
  */
  const proj = projects.collectNewProject();

  let callback;
  try {
    callback = (await axios.post("/profile/customer/new/proj", proj))
  } catch (error) {
    console.log(error)
  }
  // update popup
  wrapper.id = callback["data"]["content"]["id"] + '-proj-pop-wrapper'
  wrapper.querySelector('#new-proj-img-form').id = callback["data"]["content"]["id"] + '-proj-img-form'
  wrapper.querySelector('label').htmlFor = callback["data"]["content"]["id"] + '-proj-pop-img-input'
  wrapper.querySelector('#new-proj-pop-img-input').id = callback["data"]["content"]["id"] + '-proj-pop-img-input'
  wrapper.querySelector('.proj-pop-img').src = '/profile/projects/retrieve-thumbnail/' + callback["data"]["content"]["id"]
  // render project cards
  if (callback["data"]["content"]["bookmark"]) {
    projects.renderFavCard(callback["data"]["content"])
  }
  projects.renderSmallCard(callback["data"]["content"])
  projects.renderProjPop(null)
  // transition screens
  projects.hideProjPop(callback["data"]["status"], 'new', callback["data"]["content"]["id"])
}

projects.saveExisting = async (projID) => {
  /*
  let wrapper = document.getElementById(projID + '-proj-pop-wrapper')
  let proj = new Object()
  proj.updates = new Object()
  // post changes
  proj.id = projID
  // TO DO: post thumbnail
  proj.updates.image = wrapper.querySelector('.proj-pop-img').src
  proj.updates.bookmark = wrapper.querySelector('.proj-pop-bookmark').classList.contains('fas')
  proj.updates.makes = []
  let children = wrapper.querySelector('.proj-pop-blob-container').children
  for (var i = 0; i < children.length; i++) {
    proj.updates.makes[i] = children[i].id.split('-')[1]
    console.log(children[i].id.split('-')[1])
  }
  proj.updates.name = wrapper.querySelector('.proj-pop-name').value
  proj.updates.notes = wrapper.querySelector('.proj-pop-notes').value
  */
  const proj = projects.collectExistingProject(projID);
  let callback;
  try {
    callback = (await axios.post("/profile/customer/update/proj", proj))
  } catch (error) {
    console.log(error)
  }

  // update fav card
  favCard = document.getElementById(projID + '-proj-fav')
  if (callback["data"]["content"]["bookmark"]) { // bookmarked
    if (favCard) { // fav card already exists, modify
      favCard.querySelector('.proj-fav-name').innerHTML = callback["data"]["content"]["name"]
      let makesEl = favCard.querySelector('.proj-fav-makes')
      makesEl.innerHTML = ''
      callback["data"]["content"]["makes"].forEach(function (make, j) {
        if (makesEl.innerHTML !== '') {
          makesEl.innerHTML += ', '
        }
        makesEl.innerHTML += make
      })
      favCard.querySelector('.proj-fav-notes').innerHTML = callback["data"]["content"]["notes"]
      favCard.querySelector('.proj-fav-img').src = '/profile/projects/retrieve-thumbnail/' + projID + '?' + new Date().getTime()
    } else { // fav card does not exist, create new
      projects.renderFavCard(callback["data"]["content"])
    }
  } else { // not bookmarked
    if (favCard) { // fav card exists, delete
      favCard.remove()
    }
  }

  // update small card
  smallCard = document.getElementById(projID + '-proj-small')
  if (callback["data"]["content"]["bookmark"]) {
    smallCard.querySelector('.fa-bookmark').className = 'fas fa-bookmark'
  } else {
    smallCard.querySelector('.fa-bookmark').className = 'far fa-bookmark'
  }
  smallCard.querySelector('.proj-small-name').children[0].innerHTML = callback["data"]["content"]["name"]
  console.log(smallCard.querySelector('.proj-small-img').src)
  smallCard.querySelector('.proj-small-img').src = '/profile/projects/retrieve-thumbnail/' + projID + '?' + new Date().getTime()
  console.log(smallCard.querySelector('.proj-small-img').src)

  projects.renderProjPop(null)
  projects.hideProjPop(callback["data"]["status"], 'edit', projID)
}

projects.trash = async (projID) => {
  let callback
  try {
    callback = (await axios.post("/profile/customer/delete/proj", { id: projID }))
  } catch (error) {
    return console.log(error)
  }
  document.getElementById(projID + '-proj-pop-wrapper').remove()
  document.getElementById(projID + '-proj-small').remove()
  if (document.getElementById(projID + '-proj-fav')) {
    document.getElementById(projID + '-proj-fav').remove()
  }
  projects.hideProjPop(callback["data"]["status"], 'delete', null)
}

projects.updateBookmark = async (e, proj, bookmarkEl) => {
  e.stopPropagation()
  let modifiedProj = new Object()
  modifiedProj.updates = new Object()
  modifiedProj.id = proj.id
  modifiedProj.updates.bookmark = !proj.bookmark
  bookmarkEl.classList.toggle('fas')
  bookmarkEl.classList.toggle('far')
  document.getElementById(proj.id + '-proj-pop-wrapper').querySelector('.proj-pop-bookmark').classList.toggle('fas')
  document.getElementById(proj.id + '-proj-pop-wrapper').querySelector('.proj-pop-bookmark').classList.toggle('far')
  try {
    await axios.post("/profile/customer/update/proj", modifiedProj)
  } catch (error) {
    console.log(error)
  }
  if (bookmarkEl.classList.contains('fas')) {
    projects.renderFavCard(proj)
  } else {
    document.getElementById(proj.id + '-proj-fav').remove()
  }
}

projects.previewImage = (el, event) => {
  el.parentElement.parentElement.querySelector('.proj-pop-img').src = URL.createObjectURL(event.target.files[0])
}

/*projects.collectNewProject = () => {
  let wrapper = document.getElementById('new-proj-pop-wrapper');
  let proj = new Object();
  proj.bookmark = wrapper.querySelector('.proj-pop-bookmark').classList.contains('fas');
  proj.makes = [];
  let children = wrapper.querySelector('.proj-pop-blob-container').children;
  for (var i = 0; i < children.length; i++) {
    proj.makes[i] = children[i].id.split('-')[1];
    console.log(children[i].id.split('-')[1]);
  }
  proj.name = wrapper.querySelector('.proj-pop-name').value;
  proj.notes = wrapper.querySelector('.proj-pop-notes').value;
  let input;
  const file = document.querySelector("#new-proj-pop-img-input");
  if (file.files.length !== 0) {
    input = new FormData(document.querySelector("#new-proj-img-form"));
    input.append("bookmark", proj.bookmark);
    input.append("makes", proj.makes);
    input.append("name", proj.name);
    input.append("notes", proj.notes);
  } else {
    input = proj;
  }

  return input;
}*/

projects.collectNewProject = () => {
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
    input = new FormData(document.querySelector("#new-proj-img-form"));
  } else {
    input = new FormData();
  }
  input.append("project", JSON.stringify(project));
  // SUCCESS HANDLER
  return input;
}

projects.collectExistingProject = (projID) => {
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
    input = new FormData(document.getElementById(projID + "-proj-img-form"));
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