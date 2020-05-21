var mq = window.matchMedia("(min-width: 850px)")
var activeProjID = undefined

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Previews uploaded profile picture
var loadFile = function(event) {
  document.getElementById('profile-preview').src = URL.createObjectURL(event.target.files[0])
}

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
    bookmarkEl.addEventListener('click', async(e) => {
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

    let imgEl = document.createElement('img')
    cardEl.appendChild(imgEl).className = 'proj-img'
    imgEl.src = project.image
    imgEl.alt = 'Project Image'

    dateCreation = new Date(project.date.creation)
    let dateEl = document.createElement('p')
    dateEl.innerHTML =  dateCreation.toLocaleString('default', { month: 'short' }).toUpperCase() + ' ' + dateCreation.getDate() + ' ' + dateCreation.getFullYear()
    cardEl.appendChild(dateEl).className = 'proj-date'

    let nameEl = document.createElement('p')
    nameEl.innerHTML = project.name
    cardEl.appendChild(nameEl).className = 'proj-name'

    // Add makes to project cards
    let makesEl = document.createElement('p')
    cardEl.appendChild(makesEl).className = 'proj-makes'
    project.makes.forEach(function(make, j) {
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

    dateModified = new Date(project.date.modified)
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
        let projMakesList
        makesEl.id.split(' ')
        projMakesList.forEach(function(makeInProject, k) {
          // Add project blobs
          renderMakeBlobs(allMakes[makeKeys[makeInProject]])
          // Activate project labels
          document.getElementById('make-label-' + makeInProject).classList.toggle('make-label-active')
          document.getElementById('make-label-' + makeInProject).childNodes[1].className = 'fas fa-check-circle'
        })
      }

    })

  } else {

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
    project.makes.forEach(function(make, j) {
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

const profileInit = async() => {

  // Get elements
  const profileSection = document.querySelector('.my-profile-section')
  const navDP = [document.getElementById('nav-dp'), document.getElementById('nav-user-in')]
  const dpEl = document.getElementById('profile-preview')
  const nameEl = document.getElementById('profile-name')
  const locationEl = document.getElementById('profile-location')
  const bioEl = document.getElementById('profile-bio')
  projScroll = document.getElementById('proj-scroll-container')
  const billingCards = document.getElementsByClassName('billing-card')

  // -- Prerender selected tab -- 
  document.getElementById(localStorage.getItem('tab') + '-tab').checked = true

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
  // Force everything to load before rendering the section
  profileSection.style.visibility = 'visible'

  // -- If edit --
  document.getElementById('profile-edit-btn').addEventListener('click', () => {
    profileSection.classList.toggle('my-profile-section-edit')
  })

  //  -- If save --
  document.getElementById('profile-save-btn').addEventListener('click', async() => {
    profileSection.classList.toggle('my-profile-section-edit')

    // Save new variables
    dpTemp = dpEl.src
    nameTemp = nameEl.innerHTML
    bioTemp = bioEl.innerHTML
    customerInfo["displayName"] = nameTemp
    customerInfo["bio"] = bioTemp

    // Update profile pictures in nav bar
    for (var i = 0; i < navDP.length; i++) {
      navDP[i].src = dpTemp
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
    profileSection.classList.toggle('my-profile-section-edit')
    dpEl.src = dpTemp
  })

  if (mq.matches) {
    // -- Horizontal scrolling --
    projScroll.addEventListener('wheel', function(e) {
      if (e.deltaY > 0) {
        projScroll.scrollLeft += 100
      } else {
        projScroll.scrollLeft -= 100
      }
      e.preventDefault()
    })
  }

  for (var i=0; i < billingCards.length; i++) {
    console.log(billingCards)
    billingCards[i].onclick = function(event) {
      this.classList.toggle('billing-card-active')
    }
  }

  try {
    allMakes = (await axios.get("/profile/customer/fetch/makes"))["data"]["content"]
  } catch (error) {
    console.log(error)
    return
  }

  try {
    allProjects = (await axios.get("/profile/customer/fetch/all_proj"))["data"]["content"]
  } catch (error) {
    console.log(error)
    return
  }

  makeKeys = new Object()
  allMakes.forEach(function(make, i) {
    makeKeys[make.id] = i
  })

  newEditProjScreen = document.getElementById('new-edit-proj-screen')
  newEditProjScreenOverlay = document.getElementById('new-edit-proj-screen-overlay')

  makeLabelContainer = document.getElementById('make-labels-container')
  makeBlobContainer = document.getElementById('make-blobs-container')

  // Render all make labels
  allMakes.forEach(function(make, i) {

    // Create make label markup
    let el = document.createElement('div')
    el.className = 'make-label'
    el.id = 'make-label-' + make.id
    makeLabelContainer.appendChild(el)
    el.appendChild(document.createElement('p')).innerHTML = make.file.name
    let tick = document.createElement('i')
    tick.className = 'fas fa-check-circle'
    el.appendChild(document.createElement('i')).className = 'far fa-check-circle'
    let tooltipWrapper = document.createElement('div')
    tooltipWrapper.className = 'tooltip-wrapper'
    let tooltipEl = document.createElement('div')
    tooltipEl.className = 'make-label-tooltip'
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
      if (el.classList.contains('make-label-active')) {
        document.getElementById('make-blob-' + make.id).remove()
      } else {
        renderMakeBlobs(make)
      }
      el.childNodes[1].classList.toggle('fas')
      el.childNodes[1].classList.toggle('far')
      el.classList.toggle('make-label-active')
    })

    el.addEventListener('mouseover', () => {
      tooltipWrapper.style.top = el.offsetTop - makeLabelContainer.scrollTop - tooltipWrapper.offsetHeight/2 + el.offsetHeight/2 + 'px'
    })
  })

  // Render all project cards
  allProjects.forEach(function(project, i) {
    // IIFE
    renderProjCard(true, project)
  })

  newEditProjScreenOverlay.addEventListener('click', () => {
    hideProjPopup()
  })
  document.getElementById('new-edit-proj-x').addEventListener('click', () => {
    hideProjPopup()
  })
  document.getElementById('new-edit-proj-bookmark').addEventListener('click', (e) => {
    e.stopPropagation()
    e.target.classList.toggle('fas')
    e.target.classList.toggle('far')
  })

  document.getElementById('new-edit-proj-btn').addEventListener('click', () => {
    showProjPopup('new')
  })

  document.getElementById('delete-proj').addEventListener('click', async() => {
    let callback
    try {
      callback = (await axios.post("/profile/customer/delete/proj", {id: activeProjID}))
    } catch (error) {
      return console.log(error)
    }

    document.getElementById('proj-' + activeProjID).remove()
    hideProjPopup(callback["data"]["status"], 'delete')
  })

  document.getElementById('save-proj').addEventListener('click', async() => {

    if (activeProjID) {
      let proj = new Object()
      proj.updates = new Object()

      // Update existing project
      proj.id = activeProjID

      proj.updates.bookmark = document.getElementById('new-edit-proj-bookmark').classList.contains('fas')

      proj.updates.makes = []
      let children = makeBlobContainer.children
      for (var i = 0; i < children.length; i++) {
        proj.updates.makes[i] = children[i].id.split('-')[2]
      }

      proj.updates.name = document.getElementById('new-edit-proj-name').value
      proj.updates.notes = document.getElementById('new-edit-proj-notes').value

      // TO DO: future
      proj.updates.image = undefined

      let callback
      try {
        callback = (await axios.post("/profile/customer/update/proj", proj))
      } catch (error) {
        console.log(error)
      }

      console.log(callback)

      // Re-render project card
      renderProjCard(false, proj.updates)
      hideProjPopup(callback["data"]["status"], 'edit')

    } else {
      // New project
      let proj = new Project()

      proj.bookmark = document.getElementById('new-edit-proj-bookmark').classList.contains('fas')

      let children = makeBlobContainer.children
      for (var i = 0; i < children.length; i++) {
        proj.makes[i] = children[i].id.split('-')[2]
      }

      proj.name = document.getElementById('new-edit-proj-name').value
      proj.notes = document.getElementById('new-edit-proj-notes').value

      // TO DO: future
      proj.image = undefined

      let callback
      try {
        callback = (await axios.post("/profile/customer/new/proj", proj))
      } catch (error) {
        console.log(error)
      }
      
      // Render project card
      renderProjCard(true, callback["data"]["content"])
      hideProjPopup(callback["data"]["status"], 'new')
    }
  })

}