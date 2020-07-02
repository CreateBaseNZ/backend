/* ========================================================================================
VARIABLES
======================================================================================== */

let login = {
  words: ['Creator', 'Maverick', 'Trailblazer', 'Innovator'],
  initialise: undefined,
  enter: undefined,
  toggleContainer: undefined,
  collect: undefined,
  submit: undefined,
  validate: undefined,
  enable: undefined,
  disable: undefined,
  redirect: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  login.initialise
// @desc  
login.initialise = async () => {
  login.redirect(); // ADD SUCCESS LINK
  // LOAD SYSTEM
  try {
    await global.initialise(false, false);
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader(false);
  // ADD THE DYNAMIC WORDS EFFECT
  textSequence(0, login.words, "change-text");
  login.enter()
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
  login.disable();
  // COLLECT
  const [email, password] = login.collect();
  // VALIDATION
  // Client
  if (!login.validate(email, password)) return login.enable();
  // Server
  let data
  try {
    data = (await axios.post("/login/validate", { email, password }))["data"];
  } catch (error) {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(error);
    return login.enable();
  }
  // ERROR HANDLER
  if (data.status === "failed") {
    document.querySelector("#login-email-error").innerHTML = data.content.email;
    document.querySelector("#login-password-error").innerHTML = data.content.password;
    return login.enable();
  }
  // SUCCESS HANDLER
  return document.querySelector("#log-in-form").submit();
}

// @func  login.validate
// @desc  
login.validate = (email, password) => {
  // DECLARE VARIABLES
  let valid = true
  let errorEmail = ""
  let errorPassword = ""
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // VALIDATION
  // Password
  if (!password) {
    valid = false;
    errorPassword = "Please enter a password."
  } /*else if (!global.passwordValidity(password)) {
    valid = false;
    errorPassword = "invalid password";
  }*/
  // Email
  if (!email) {
    valid = false;
    errorEmail = "Please enter an email."
  } else if (!emailRE.test(String(email).toLowerCase())) {
    valid = false;
    errorEmail = "Please enter a valid email";
  }

  // SUCCESS HANDLER
  document.querySelector("#login-email-error").innerHTML = errorEmail
  document.querySelector("#login-password-error").innerHTML = errorPassword
  return valid
}

// @func  login.enable
// @desc  
login.enable = () => {
  // LOADER
  // TO DO .....
  // TO DO .....
  // BUTTONS
  document.querySelector("#login-btn").removeAttribute("disabled");
  document.querySelector("#login-back").removeAttribute("disabled");
}

// @func  login.disable
// @desc  
login.disable = () => {
  // LOADER
  // TO DO .....
  // TO DO .....
  // BUTTONS
  document.querySelector("#login-btn").setAttribute("disabled", "");
  document.querySelector("#login-back").setAttribute("disabled", "");
}

// @func  login.redirect
// @desc  
login.redirect = () => {
  // CHECK IF ACCESS ATTEMPT ON PRIVATE PAGES HAS BEEN MADE
  const url = window.location.href.toString();
  const urlArray = url.split("/"); // split url
  if (urlArray[3] !== "login") {
    // REDIRECT
    const redirect = "/" + urlArray.slice(3).join("/");
    window.sessionStorage.loginRedirect = redirect;
    // UPDATE HISTORY, TITLE AND LINK
    const loginURL = urlArray.slice(0, 3).join("/") + "/login";
    const title = "Login • CreateBase";
    document.querySelector("title").innerHTML = title;
    history.pushState({ page: "/login" }, title, loginURL);
  } else {
    window.sessionStorage.loginRedirect = "/";
  }
  const link = window.sessionStorage.loginRedirect;
  document.querySelector("#login-success-link").value = link;
  return;
}

/* ========================================================================================
END
======================================================================================== */