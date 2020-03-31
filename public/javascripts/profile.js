

const profileInit = async() => {

  let name, location, bio
  name = 'Louii'
  location = 'auckland, new zealand'
  bio = 'This is a temporary bio that may be up to 250 characters long, but the final numbers can be longer or shorter. Lorem ipsum dolor sit amet consectetur adipisicing elit. Est veritatis magnam ipsa unde illo cumque quod quas magni nobis, voluptatem nece.'

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
  })
  cancelBtn.addEventListener('click', () => {
    section.classList.toggle('my-profile-section-edit')
  })
}

var loadFile = function(event) {
  var output = document.getElementById('profile-preview')
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function() {
    URL.revokeObjectURL(output.src) // free memory
  }
  console.log('yes')
};