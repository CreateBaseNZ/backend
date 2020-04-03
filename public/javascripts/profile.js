// Previews uploaded profile picture
var loadFile = function(event) {
  document.getElementById('profile-preview').src = URL.createObjectURL(event.target.files[0])
}

const profileInit = async() => {

  // Get elements
  const profileSection = document.querySelector('.my-profile-section')
  const navDP = [document.getElementById('nav-dp'), document.getElementById('nav-user-reg')]
  const dpEl = document.getElementById('profile-preview')
  const nameEl = document.getElementById('profile-name')
  const locationEl = document.getElementById('profile-location')
  const bioEl = document.getElementById('profile-bio')

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
  profileSection.style.opacity = 1

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
    
    let data
    // Post to server
    try {
      data = (await axios.post("/profile/customer/update", customerInfo))
    } catch (error) {
      console.log(error)
    }

    // Update profile pictures in nav bar
    for (var i = 0; i < navDP.length; i++) {
      navDP[i].src = dpTemp
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
}