var mq = window.matchMedia("(min-width: 850px)");

// Previews uploaded profile picture
var loadFile = function(event) {
  document.getElementById('profile-preview').src = URL.createObjectURL(event.target.files[0])
}

let Project = class {
  constructor(id, bookmark, created, makes, modified, name, notes, image) {
    this.id = id
    this.bookmark = bookmark
    this.created = created
    this.makes = makes
    this.modified = modified
    this.name = name
    this.notes = notes
    this.image = image
  }
}

let Make = class {
  constructor(id, colour, material, name, quality, strength) {
    this.id = id
    this.colour = colour
    this.material = material
    this.name = name
    this.quality = quality
    this.strength = strength
  }
}

function renderMakeBlobs(make) {
  let el = document.createElement('div')
  el.className = 'make-blob'
  el.id = 'make-blob-' + make.id
  el.appendChild(document.createElement('p')).innerHTML = make.name
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

function hideProjPopup() {
  newEditProjScreen.style.display = 'none'
  newEditProjScreenOverlay.style.display = 'none'
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
  newEditProjScreen.style.display = 'flex'
  newEditProjScreenOverlay.style.display = 'block'

  if (status === 'new') {
    document.getElementById('new-edit-proj-header').innerHTML = 'Create a New Project'
    document.getElementById('new-edit-proj-name').value = ''
    document.getElementById('new-edit-proj-notes').value = ''
  } else {
    document.getElementById('new-edit-proj-header').innerHTML = 'Edit an Existing Project'
    document.getElementById('new-edit-proj-name').value = project.name
    document.getElementById('new-edit-proj-notes').value = project.notes
  }
}

const profileInit = async() => {

  // Get elements
  const profileSection = document.querySelector('.my-profile-section')
  const navDP = [document.getElementById('nav-dp'), document.getElementById('nav-user-in')]
  const dpEl = document.getElementById('profile-preview')
  const nameEl = document.getElementById('profile-name')
  const locationEl = document.getElementById('profile-location')
  const bioEl = document.getElementById('profile-bio')
  const projScroll = document.getElementById('proj-scroll-container')
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
    
    let data
    // Post to server
    try {
      data = (await axios.post("/profile/customer/update", customerInfo))
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

  let makeA = new Make('123', 'black', 'petg', 'Make Part A', 'normal', 'normal')
  let makeB = new Make('456', 'b', 'b', 'Make Part B', 'b', 'b')
  let allMakes = [makeA, makeB]

  let proj1 = new Project('000000', true, "01/01/2020", ['123', '456'], "01/01/2020", "My First Project", "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam placeat fugiat atque sed qui magni, blanditiis molestiae neque non modi, hic quaerat nobis distinctio tenetur soluta sunt debitis molestias quam beatae esse consectetur. Dolorum qui placeat praesentium voluptates, culpa temporibus. Sint accusantium iure deleniti corrupti incidunt dolore pariatur possimus quia! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam placeat fugiat atque sed qui magni, blanditiis molestiae neque non modi, hic quaerat nobis distinctio tenetur soluta sunt debitis molestias quam beatae esse consectetur. Dolorum qui placeat praesentium voluptates, culpa temporibus. Sint accusantium iure deleniti corrupti incidunt dolore pariatur possimus quia! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam placeat fugiat atque sed qui magni, blanditiis molestiae neque non modi, hic quaerat nobis distinctio tenetur soluta sunt debitis molestias quam beatae esse consectetur. Dolorum qui placeat praesentium voluptates, culpa temporibus. Sint accusantium iure deleniti corrupti incidunt dolore pariatur possimus quia!", "./../../public/images/profile/project-thumbnail.jpeg")
  let proj2 = new Project('111111', false, "01/01/2020", ['456'], "01/01/2020", "Test Part", "", "./../../public/images/profile/stl.png")
  let proj3 = new Project('222222', false, "01/01/2020", [], "01/01/2020", "Trunk Modelling", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore perspiciatis molestias dignissimos! Voluptatibus delectus sapiente obcaecati. Delectus laborum quo dolor?", "./../../public/images/profile/trunk.png")
  let proj4 = new Project('333333', true, "01/01/2020", ['123'], "01/01/2020", "Mini Boat", "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel, numquam.", "./../../public/images/profile/jank.jpg")
  let allProjects = [proj1, proj2, proj3, proj4]

  var makeKeys = new Object()
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
    el.appendChild(document.createElement('p')).innerHTML = make.name
    let tick = document.createElement('i')
    tick.className = 'fas fa-check-circle'
    el.appendChild(document.createElement('i')).className = 'far fa-check-circle'

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
  })

  allProjects.forEach(function(project, i) {
    // IIFE
    let cardEl = document.createElement('div')
    cardEl.id = 'proj-' + project.id 

    // Edit a project
    cardEl.addEventListener('click', () => {

      // Show new/edit project screen
      showProjPopup('edit', project)

      project.makes.forEach(function(makeInProject, k) {
        // Add project blobs
        renderMakeBlobs(allMakes[makeKeys[makeInProject]])
        // Activate project labels
        document.getElementById('make-label-' + makeInProject).classList.toggle('make-label-active')
        document.getElementById('make-label-' + makeInProject).childNodes[1].className = 'fas fa-check-circle'
      })
    })

    projScroll.appendChild(cardEl).className = 'proj-card'
    let bookmarkEl = document.createElement('i')
    bookmarkEl.addEventListener('click', (e) => {
      allProjects[i].bookmark = !allProjects[i].bookmark
      bookmarkEl.classList.toggle('fas')
      bookmarkEl.classList.toggle('far')
      e.stopPropagation()
    })
    if (project.bookmark) {
      cardEl.appendChild(bookmarkEl).className = 'fas fa-bookmark'
    } else {
      cardEl.appendChild(bookmarkEl).className = 'far fa-bookmark'
    }
    let imgEl = document.createElement('img')
    cardEl.appendChild(imgEl).className = 'proj-img'
    imgEl.src = project.image
    imgEl.alt = 'Project Image'
    let date = document.createElement('p')
    date.innerHTML = project.created
    cardEl.appendChild(date).className = 'proj-date'
    let name = document.createElement('p')
    name.innerHTML = project.name
    cardEl.appendChild(name).className = 'proj-name'
    let makesEl = document.createElement('p')
    cardEl.appendChild(makesEl).className = 'proj-makes'

    // Add makes to project cards
    project.makes.forEach(function(make, j) {
      if (makesEl.innerHTML !== '') {
        makesEl.innerHTML += ', '
      }
      makesEl.innerHTML += allMakes[makeKeys[make]].name
    })

    let notesEl = document.createElement('div')
    cardEl.appendChild(notesEl).className = 'proj-notes'
    if (project.notes === '') {
      notesEl.appendChild(document.createElement('p')).innerHTML = 'No notes added'.italics()
    } else {
      notesEl.appendChild(document.createElement('p')).innerHTML = project.notes
    }
    cardEl.addEventListener('mouseover', () => {
      notesEl.style.height = notesEl.scrollHeight + 'px'
    })
    cardEl.addEventListener('mouseout', () => {
      notesEl.style.height = '0'
    })
    let modifiedEl = document.createElement('p')
    modifiedEl.innerHTML = 'Last modified ' + project.modified
    cardEl.appendChild(modifiedEl).className = 'proj-modified'
    let editEl = document.createElement('p')
    editEl.innerHTML = 'Click anywhere on this card to edit'
    cardEl.appendChild(editEl).className = 'proj-edit'
  })

  newEditProjScreenOverlay.addEventListener('click', () => {
    hideProjPopup()
  })
  document.getElementById('new-edit-proj-x').addEventListener('click', () => {
    hideProjPopup()
  })

  document.getElementById('new-edit-proj-btn').addEventListener('click', () => {
    showProjPopup('new')
  })

}