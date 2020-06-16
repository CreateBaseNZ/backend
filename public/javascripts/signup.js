/* ========================================================================================
VARIABLES
======================================================================================== */

let signup = {
  initialise: undefined,
  collect: undefined,
  submit: undefined,
  validate: undefined,
  confirmPassword: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  signup.initialise
// @desc  
signup.initialise = async () => {
  // LOAD NAVIGATION
  try {
    await navigation.initialise(false);
  } catch (error) {
    return console.log(error);
  }
  signup.confirmPassword();
  // REMOVE STARTUP LOADER
  document.querySelector(".full-page-loading").classList.add("hide");
  try {
    await session.initialise();
  } catch (error) {
    return console.log(error);
  }
}

// @func  signup.collect
// @desc  
signup.collect = () => {
  const displayName = document.querySelector("#sign-up-dspl-name").value;
  const email = document.querySelector("#sign-up-eml").value;
  const password = document.querySelector("#sign-up-pwd").value;
  const confirmPassword = document.querySelector("#sign-up-cfrm-pwd").value;

  return [displayName, email, password, confirmPassword];
}

// @func  signup.submit
// @desc  
signup.submit = async () => {
  // DISABLE BUTTON
  document.querySelector("#signup-btn").setAttribute("disabled", "");
  // TO DO .....
  // LOADER
  // TO DO .....
  // COLLECT
  const [displayName, email, password, confirmPassword] = signup.collect();
  // VALIDATION
  // Client
  if (!signup.validate(displayName, email, password, confirmPassword)) {
    return document.querySelector("#signup-btn").removeAttribute("disabled");
  }
  // Server
  let data;
  try {
    data = (await axios.post("/signup/validate", { email }))["data"];
  } catch (error) {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    document.querySelector("#signup-btn").removeAttribute("disabled");
    return console.log(error);
  }
  // ERROR HANDLER
  if (data.status === "failed") {
    document.querySelector("#signup-error-email").innerHTML = data.content;
    return document.querySelector("#signup-btn").removeAttribute("disabled");
  }
  // SUCCESS HANDLER
  document.querySelector("#signup-error-email").innerHTML = "";
  return document.querySelector("#sign-up-form").submit();
}

// @func  signup.validate
// @desc  
signup.validate = (displayName, email, password, confirmPassword) => {
  // DECLARE VARIABLES
  let valid = true;
  let errorDisplayName = "";
  let errorEmail = "";
  let errorPassword = "";
  let errorConfirmPassword = "";
  // TO DO .....
  // REGEX VARIABLES
  // TO DO .....

  // VALIDATION
  // Display Name
  if (!displayName) {
    valid = false;
    errorDisplayName = "display name required";
  }
  // Email
  if (!email) {
    valid = false;
    errorEmail = "email required";
  }
  // Password
  if (!password) {
    valid = false;
    errorPassword = "password required";
  }
  // Confirm Password
  if (confirmPassword !== password) {
    valid = false;
    errorConfirmPassword = "password does not match";
  }

  if (!confirmPassword) {
    valid = false;
    errorConfirmPassword = "confirm password required";
  }
  // TO DO .....
  // REGEX VALIDATION
  // TO DO .....
  // SUCCESS HANDLER
  document.querySelector("#signup-error-display-name").innerHTML = errorDisplayName;
  document.querySelector("#signup-error-email").innerHTML = errorEmail;
  document.querySelector("#signup-error-password").innerHTML = errorPassword;
  document.querySelector("#signup-error-confirm-password").innerHTML = errorConfirmPassword;
  return valid;
}

// @func  signup.confirmPassword
// @desc  
signup.confirmPassword = () => {
  // DECLARE ELEMENTS
  const inputPass = document.querySelector('#sign-up-pwd');
  const confirm = document.getElementById('confirm-pass');
  const confirmInput = document.getElementById('sign-up-cfrm-pwd');
  // ADD LISTENER
  inputPass.addEventListener("input", () => {
    if (inputPass.value.length) {
      confirm.classList.add("dip-down");
    } else {
      confirm.classList.remove("dip-down");
      confirmInput.value = "";
    }
  });
}

/* ========================================================================================
END
======================================================================================== */
