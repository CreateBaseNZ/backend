/* ========================================================================================
VARIABLES
======================================================================================== */

let changePassword = {
  // VARIABLES

  // FUNCTIONS
  initialise: undefined,
  scorePassword: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

changePassword.initialise = async () => {
  // LOAD NAVIGATION
  try {
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
}

// @func  signup.confirmPassword
// @desc  
changePassword.scorePassword = (pass) => {

  el = document.getElementById("change-password-new-password-feedback");

  if (!pass) {
    el.innerHTML = "";
    el.style.color = "red";
    return false
  }

  var score = 0;

  // Award every unique letter until 5 repetitions
  var letters = new Object();
  for (var i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1;
    score += 5.0 / letters[pass[i]];
  }

  // Bonus points for mixing it up
  var variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass),
  }

  variationCount = 0;
  for (var check in variations) {
    variationCount += (variations[check] == true) ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  if (score > 80) {
    el.innerHTML = "Strong";
    el.style.color = "LimeGreen";
    return true
  } else if (score > 60) {
    el.innerHTML = "Moderate";
    el.style.color = "Gold";
    return true
  } else if (score > 40) {
    el.innerHTML = "Weak";
    el.style.color = "orange";
    return true
  } else {
    el.innerHTML = "Very weak";
    el.style.color = "red";
    return false
  }

}

/* ========================================================================================
END
======================================================================================== */