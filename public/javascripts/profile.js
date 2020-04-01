// Previews uploaded profile picture
var loadFile = function(event) {
  var output = document.getElementById('profile-preview')
  output.src = URL.createObjectURL(event.target.files[0])
  output.onload = function() {
    URL.revokeObjectURL(output.src) // free memory
  }
  console.log('yes')
}


const profileInit = async() => {

  let customerInfo

  try {
    customerInfo = (await axios.get("/profile/customer-info"))
  } catch (error) {
    console.log(error)
    return
  }


  // [TO DO] Get values from server
  var name = customerInfo["data"]["data"]["displayName"]
  var bio = customerInfo["data"]["data"]["bio"]
  let location

  location = 'auckland, new zealand'

  // Update all markup (display + edit)
  document.querySelector('.profile-name').innerHTML = name
  document.querySelector('.profile-location').innerHTML = location
  document.querySelector('.profile-bio').innerHTML = bio
  // Force everything to load before rendering the section
  document.querySelector('.my-profile-section').style.opacity = 1
  
  const editBtn = document.querySelector('.profile-edit-btn')
  const saveBtn = document.querySelector('.profile-save-btn')
  const cancelBtn = document.querySelector('.profile-cancel-btn')
  const section = document.querySelector('.my-profile-section')

  editBtn.addEventListener('click', () => {
    section.classList.toggle('my-profile-section-edit')
  })
  saveBtn.addEventListener('click', () => {
    section.classList.toggle('my-profile-section-edit')

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
  cancelBtn.addEventListener('click', () => {
    section.classList.toggle('my-profile-section-edit')

    // Revert all changes back to variables
    document.querySelector('.profile-name').innerHTML = name
    document.querySelector('.profile-location').innerHTML = location
    document.querySelector('.profile-bio').innerHTML = bio
  })
}