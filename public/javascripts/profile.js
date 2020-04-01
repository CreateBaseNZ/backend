// Previews uploaded profile picture
var loadFile = function(event) {
  var output = document.getElementById('profile-preview')
  output.src = URL.createObjectURL(event.target.files[0])
  output.onload = function() {
    URL.revokeObjectURL(output.src) // free memory
  }
  console.log('yes')
}

// -- Render selected tab --
function changeMainSection(el) {
  console.log(document.querySelector('.main-section'))
  document.querySelector('.main-section').id = 'main-section-' + el.getAttribute('data-tab')
}

const profileInit = async() => {

  // -- Prerender selected tab --
  document.querySelector('#' + localStorage.getItem('tab') + '-tab').checked = true
  document.querySelector('.main-section').id = 'main-section-' + localStorage.getItem('tab')

  // -- Get customer info --
  let customerInfo

  try {
    customerInfo = (await axios.get("/profile/customer-info"))
  } catch (error) {
    console.log(error)
    return
  }

  var name = customerInfo["data"]["data"]["displayName"]
  var bio = customerInfo["data"]["data"]["bio"]
  var profilePic = customerInfo["data"]["data"]["profilePic"]
  let location

  location = 'auckland, new zealand'

  // -- Update all markup (display + edit) --
  document.querySelector('.profile-name').innerHTML = name
  document.querySelector('.profile-location').innerHTML = location
  document.querySelector('.profile-bio').innerHTML = bio
  // Force everything to load before rendering the section
  document.querySelector('.my-profile-section').style.opacity = 1
  
  const profileSection = document.querySelector('.my-profile-section')

  // -- If edit --
  document.querySelector('.profile-edit-btn').addEventListener('click', () => {
    profileSection.classList.toggle('my-profile-section-edit')
  })

  //  -- If save --
  document.querySelector('.profile-save-btn').addEventListener('click', () => {
    profileSection.classList.toggle('my-profile-section-edit')

    // Save new variables
    name = document.querySelector('.profile-name').innerHTML
    customerInfo["data"]["data"]["displayName"] = name
    location = document.querySelector('.profile-location').innerHTML
    bio = document.querySelector('.profile-bio').innerHTML
    customerInfo["data"]["data"]["bio"] = bio

    console.log(customerInfo)

    // [TO DO] Post to server
    // await axios.post("/profile/update-customer", customerInfo)

  })

  // -- If cancel --
  document.querySelector('.profile-cancel-btn').addEventListener('click', () => {
    
    // Revert all changes back to variables
    document.querySelector('.profile-name').innerHTML = name
    document.querySelector('.profile-location').innerHTML = location
    document.querySelector('.profile-bio').innerHTML = bio
    profileSection.classList.toggle('my-profile-section-edit')
  })

}