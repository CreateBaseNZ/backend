/* ========================================================================================
VARIABLES
======================================================================================== */

let changePassword = {
  // VARIABLES

  // FUNCTIONS
  initialise: undefined,
  initEventListeners: undefined,
  collectURLInputs: undefined,
  processURLInputs: undefined,
  sendCode: undefined,
  process: undefined,
  scorePassword: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  changePassword.initialise
// @desc  
changePassword.initialise = async () => {
  // LOAD NAVIGATION
  try {
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  changePassword.initEventListeners();
  // REMOVE STARTUP LOADER
  removeLoader();
  // COLLECT URL INPUT
  const [email, code] = changePassword.collectURLInputs();
  changePassword.processURLInputs(email, code);
}

changePassword.initEventListeners = () => {
  // Send code on Enter 
  document.getElementById('change-password-email').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      changePassword.sendCode()
    }
  })
  // Save password on Enter
  document.getElementById('change-password-confirm-new-password').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      changePassword.process()
    }
  })

}

// @func  changePassword.collectURLInputs
// @desc  
changePassword.collectURLInputs = () => {
  // DECLARE VARIABLES
  const url = window.location.href.toString();
  const urlArray = url.split("/"); // split url
  const index = urlArray.indexOf("change-password");
  const email = urlArray[index + 1];
  const code = urlArray[index + 2];
  return [email, code];
}

// @func  changePassword.processURLInputs
// @desc  
changePassword.processURLInputs = async (email, code) => {
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // VALIDATE EMAIL
  if (!email) {
    document.querySelector("#change-password-email-error").innerHTML = "";
    return document.querySelector("#change-password-send-code").removeAttribute("disabled");
  }
  document.querySelector("#change-password-email").value = email;
  if (!emailRE.test(String(email).toLowerCase())) {
    document.querySelector("#change-password-email-error").innerHTML = "invalid email";
    return document.querySelector("#change-password-send-code").removeAttribute("disabled");
  }
  // SEND REQUEST
  let data;
  try {
    data = (await axios.post("/change-password/validate-email", { email }))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    return window.location.assign('/change-password'); // TEMPORARY
  } else if (data.status === "failed") {
    document.querySelector("#change-password-email-error").innerHTML = data.content;
    return document.querySelector("#change-password-send-code").removeAttribute("disabled");
  }
  // SUCCESS HANDLER
  document.querySelector("#change-password-page-one").classList.add("left");
  document.querySelector("#change-password-page-two").classList.remove("right");
  // ADD THE CODE INPUT
  if (code) document.querySelector("#change-password-code").value = code;
  document.querySelector("#change-password-change-password").removeAttribute("disabled");
  return document.querySelector("#change-password-resend-code").removeAttribute("disabled");
}

// @func  changePassword.sendCode
// @desc  
changePassword.sendCode = async () => {
  document.querySelector("#change-password-send-code").setAttribute("disabled", "");
  const email = document.querySelector("#change-password-email").value;
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // VALIDATE EMAIL
  if (!email) {
    document.querySelector("#change-password-email-error").innerHTML = "email required";
    return document.querySelector("#change-password-send-code").removeAttribute("disabled");
  } else if (!emailRE.test(String(email).toLowerCase())) {
    document.querySelector("#change-password-email-error").innerHTML = "invalid email";
    return document.querySelector("#change-password-send-code").removeAttribute("disabled");
  }
  // SEND REQUEST
  // loader
  document.querySelector(".full-page-message").innerHTML = "Emailing your code";
  showLoader();
  let data;
  try {
    data = (await axios.post("/change-password/send-code", { email }))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    return window.location.assign('/change-password'); // TEMPORARY
  } else if (data.status === "failed") {
    removeLoader();
    document.querySelector("#change-password-email-error").innerHTML = data.content;
    return document.querySelector("#change-password-send-code").removeAttribute("disabled");
  }
  // SUCCESS HANDLER
  removeLoader();
  document.querySelector("#change-password-page-one").classList.add("left");
  document.querySelector("#change-password-page-two").classList.remove("right");
  // ADD THE CODE INPUT
  document.querySelector("#change-password-change-password").removeAttribute("disabled");
  return document.querySelector("#change-password-resend-code").removeAttribute("disabled");
}

// @func  changePassword.process
// @desc  
changePassword.process = async () => {
  // DECLARE AND INITIALISE VARIABLES
  // collect input
  const email = document.querySelector("#change-password-email").value;
  const code = document.querySelector("#change-password-code").value;
  const password = document.querySelector("#change-password-new-password").value;
  const confirmPassword = document.querySelector("#change-password-confirm-new-password").value;
  // regex
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // errors
  let errorEmail = "";
  let errorCode = "";
  let errorPassword = "";
  let errorConfirmPassword = "";
  let valid = true;
  // VALIDATION
  // email
  if (!email) {
    valid = false;
    errorEmail = "Email required";
  } else if (!emailRE.test(String(email).toLowerCase())) {
    valid = false;
    errorEmail = "Invalid email";
  }
  // code
  if (!code) {
    valid = false;
    errorCode = "Code required";
  }
  // password
  if (!password) {
    valid = false;
    errorPassword = "New password required";
  } else if (!changePassword.scorePassword(password)) {
    valid = false;
    errorPassword = "Invalid password";
  } else if (password.includes(' ') || password.includes('\'') || password.includes('\"')) {
    valid = false;
    errorPassword = "Password cannot contain quotation marks or spaces"
  }

  // confirm password
  if (!confirmPassword) {
    valid = false;
    errorConfirmPassword = "Confirm new password";
  } else if (password !== confirmPassword) {
    valid = false;
    errorConfirmPassword = "Passwords do not match";
  }
  if (!valid) {
    document.querySelector("#change-password-email-error").innerHTML = errorEmail;
    document.querySelector("#change-password-code-error").innerHTML = errorCode;
    document.querySelector("#change-password-new-password-error").innerHTML = errorPassword;
    document.querySelector("#change-password-confirm-new-password-error").innerHTML = errorConfirmPassword;
    return;
  }
  // SEND REQUEST
  // loader
  document.querySelector(".full-page-message").innerHTML = "Changing your password";
  showLoader();
  let data;
  try {
    data = (await axios.post("/change-password/process", { email, code, password }))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    return window.location.assign('/change-password'); // TEMPORARY
  } else if (data.status === "failed") {
    if (data.content.errorEmail) {
      document.querySelector("#change-password-page-one").classList.remove("left");
      document.querySelector("#change-password-page-two").classList.add("right");
    }
    document.querySelector("#change-password-email-error").innerHTML = data.content.errorEmail;
    document.querySelector("#change-password-code-error").innerHTML = data.content.errorCode;
    document.querySelector("#change-password-new-password-error").innerHTML = data.content.errorPassword;
    document.querySelector("#change-password-send-code").removeAttribute("disabled");
    return removeLoader();
  }
  // SUCCESS HANDLER
  document.querySelector(".full-page-message").innerHTML = "Password changed successfully";
  setTimeout(() => document.querySelector(".full-page-message").innerHTML = "Redirecting to login page", 1000);
  setTimeout(() => window.location.assign('/login'), 2000);
}

// @func  changePassword.scorePassword
// @desc  
changePassword.scorePassword = (password = "") => {
  // FEEDBACK ELEMENT
  let element = document.querySelector("#change-password-new-password-feedback");
  // VALIDATION
  if (!password) {
    element.innerHTML = "";
    element.style.color = "red";
    return false;
  }
  // SCORE PASSWORD
  let score = 0;
  // Award every unique letter until 5 repetitions
  let letters = new Object();
  for (let i = 0; i < password.length; i++) {
    letters[password[i]] = (letters[password[i]] || 0) + 1;
    score += 5.0 / letters[password[i]];
  }
  // Bonus points for mixing it up
  let variations = {
    digits: /\d/.test(password),
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    nonWords: /\W/.test(password),
  }
  variationCount = 0;
  for (let check in variations) {
    variationCount += (variations[check] == true) ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  if (score > 80) {
    element.innerHTML = "Strong";
    element.style.color = "LimeGreen";
    return true
  } else if (score > 60) {
    element.innerHTML = "Moderate";
    element.style.color = "Gold";
    return true
  } else if (score > 40) {
    element.innerHTML = "Weak";
    element.style.color = "orange";
    return true
  } else {
    element.innerHTML = "Very weak";
    element.style.color = "red";
    return false
  }
}

/* ========================================================================================
END
======================================================================================== */