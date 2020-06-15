/* ========================================================================================
VARIABLES
======================================================================================== */

let login = {
  words: ['Creator', 'Maverick', 'Trailblazer', 'Innovator'],
  initialise: undefined,
  textSequence: undefined,
  toggleContainer: undefined,
  collect: undefined,
  submit: undefined,
  validate: undefined,
  enter: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  login.initialise
// @desc  
login.initialise = async () => {
  // LOAD NAVIGATION
  try {
    await navInit()
  } catch (error) {
    return console.log(error)
  }
  // TO DO .....
  // REMOVE STARTUP LOADER
  // TO DO .....

  // ADD THE DYNAMIC WORDS EFFECT
  login.textSequence(0)

  login.enter()
}

// @func  login.textSequence
// @desc  
login.textSequence = (i) => {
  document.getElementById("change-text").innerHTML = login.words[i]
  document.getElementById("change-text").setAttribute('data-text', login.words[i])
  setTimeout(function () {
    document.getElementById("change-text").classList.remove("glitch")
    setTimeout(function () {
      document.getElementById("change-text").classList.add("glitch")
      setTimeout(function () {
        i = (Math.floor(Math.random() * login.words.length))
        login.textSequence(i)
      }, (100 + Math.random() * 100))
    }, (500 + Math.random() * 1500))
  }, (50 + Math.random() * 50))
}

// Enter button to login
login.enter = () => {
  const checkEnter = (e) => {
    if (e.which === 13) {
      login.submit()
    }
  }
  document.getElementById('log-in-eml').addEventListener('keypress', (e) => {
    checkEnter(e)
  })
  document.getElementById('log-in-pwd').addEventListener('keypress', (e) => {
    checkEnter(e)
  })
}

// @func  login.toggleContainer
// @desc  
login.toggleContainer = () => {
  container.classList.toggle("right-panel-active")
}

// @func  login.collect
// @desc  
login.collect = () => {
  const email = document.querySelector("#log-in-eml").value
  const password = document.querySelector("#log-in-pwd").value
  return [email, password]
}

// @func  login.submit
// @desc  
login.submit = async () => {
  // TO DO .....
  // LOADER
  // TO DO .....
  // COLLECT
  const [email, password] = login.collect();
  // VALIDATION
  // Client
  if (!login.validate(email, password)) return;
  // Server
  let data
  try {
    data = (await axios.post("/login/validate", { email, password }))["data"];
  } catch (error) {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    return console.log(error)
  }
  // ERROR HANDLER
  if (data.status === "failed") {
    document.querySelector("#login-email-error").innerHTML = data.content.email
    return document.querySelector("#login-password-error").innerHTML = data.content.password
  }
  // SUCCESS HANDLER
  document.querySelector("#login-email-error").innerHTML = ""
  document.querySelector("#login-password-error").innerHTML = ""
  return document.querySelector("#log-in-form").submit()
}

// @func  login.validate
// @desc  
login.validate = (email, password) => {
  // DECLARE VARIABLES
  let valid = true
  let errorEmail = ""
  let errorPassword = ""
  // TO DO .....
  // REGEX VARIABLES
  // TO DO .....

  // VALIDATION
  // Password
  if (!password) {
    valid = false;
    errorPassword = "Please enter a password."
  }
  // Email
  if (!email) {
    valid = false;
    errorEmail = "Please enter an email."
  }
  // TO DO .....
  // REGEX VALIDATION
  // TO DO .....
  // SUCCESS HANDLER
  document.querySelector("#login-email-error").innerHTML = errorEmail
  document.querySelector("#login-password-error").innerHTML = errorPassword
  return valid
}

/* ========================================================================================
END
======================================================================================== */