var mq = window.matchMedia("(min-width: 850px)");

// Previews uploaded profile picture
var loadFile = function(event) {
  document.getElementById('profile-preview').src = URL.createObjectURL(event.target.files[0])
}

var hoverNotes = false
function onNotes(e) {
  hoverNotes = e;
}

let Project = class {
  constructor(id, bookmark, created, makes, modified, name, notes, thumbnail) {
    this.id = id
    this.bookmark = bookmark
    this.created = created
    this.makes = makes
    this.modified = modified
    this.name = name
    this.notes = notes
    this.thumbnail = thumbnail
  }
}

let Make = class {
  constructor(id, colour, material, quality, strength) {
    this.id = id
    this.colour = colour
    this.material = material
    this.quality = quality
    this.strength = strength
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
  let location

  location = 'auckland, new zealand'

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
      if (!hoverNotes) {
        if (e.deltaY > 0) projScroll.scrollLeft += 100
        else projScroll.scrollLeft -= 100
        e.preventDefault()
      }
    })
  }

  for (var i=0; i < billingCards.length; i++) {
    console.log(billingCards)
    billingCards[i].onclick = function(event) {
      this.classList.toggle('billing-card-active')
    }
  }

  let project = new Project('123', true, "01/01/2020", ['123'], "01/01/2020", "My First Project", "Some notes", "Photo.png")

  let makeA = new Make('123', 'black', 'petg', 'normal', 'normal')
  let makeB = new Make('456', 'b', 'b', 'b', 'b')
  allMakes = [makeA, makeB]

  console.log(project)

  let cardEl = document.createElement('div')
  let date = document.createElement('p')
  date.innerHTML = project.created
  let name = document.createElement('p')
  name.innerHTML = project.name
  let makesEl = document.createElement('p')
  let detailsEl = document.createElement('div')
  let notesEl = document.createElement('div')
  let note = document.createElement('p')
  note.innerHTML = project.notes
  let editEl = document.createElement('button')
  editEl.innerHTML = 'Edit'
  let modifiedEl = document.createElement('p')
  modifiedEl.innerHTML = 'Last modified ' + project.modified

  projScroll.appendChild(cardEl).className = 'proj-card'
  if (project.bookmark) {
    cardEl.appendChild(document.createElement('i')).className = 'fas fa-bookmark'
  } else {
    cardEl.appendChild(document.createElement('i')).className = 'far fa-bookmark'
  }
  cardEl.appendChild(date).className = 'proj-date'
  cardEl.appendChild(name).className = 'proj-name'
  cardEl.appendChild(makesEl).className = 'proj-makes'
  makesEl.appendChild(document.createElement('i')).className = 'fas fa-save'
  cardEl.appendChild(detailsEl).className = 'proj-make-details'
  for(projectMake of project.makes) {
    for(make of allMakes) {
      console.log(make.id)
      if (projectMake === make.id) {
        let el = document.createElement('p')
        el.innerHTML = make.colour
        detailsEl.appendChild(el).className = 'proj-colour'
        
        el = document.createElement('p')
        el.innerHTML = make.material
        detailsEl.appendChild(el).className = 'proj-material'
        
        el = document.createElement('p')
        el.innerHTML = make.quality
        detailsEl.appendChild(el).className = 'proj-quality'
        
        el = document.createElement('p')
        el.innerHTML = make.strength
        detailsEl.appendChild(el).className = 'proj-strength'

        break
      }
    }
  }

  cardEl.appendChild(notesEl).className = 'proj-notes'
  notesEl.appendChild(note).setAttribute('onmouseover', 'onNotes(true)')
  notesEl.appendChild(note).setAttribute('onmouseout', 'onNotes(false)')
  cardEl.appendChild(document.createElement('div')).className = 'proj-sep'
  cardEl.appendChild(editEl).className = 'proj-edit action-btn'
  cardEl.appendChild(modifiedEl).className = 'proj-modified'
}