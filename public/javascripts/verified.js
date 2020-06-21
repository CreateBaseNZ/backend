/* ========================================================================================
VARIABLES
======================================================================================== */

let verified = {
  initialise: undefined,
  redirect: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  verified.initialise
// @desc  
verified.initialise = async () => {
  // GET LOGIN STATUS
  let data;
  try {
    data = (await axios.get("/login-status"))["data"];
  } catch (error) {
    return console.log(error);
  }
  const login = data.status;
  // LOAD SYSTEM
  try {
    await global.initialise(true, true, login);
  } catch (error) {
    return console.log(error);
  }
  // SET REDIRECT
  verified.redirect();
  // REMOVE STARTUP LOADER
  removeLoader();
}

// @func  verified.redirect
// @desc  
verified.redirect = () => {
  if (window.sessionStorage.loginRedirect === "/verification") {
    window.sessionStorage.loginRedirect = "/";
  }
  const link = window.sessionStorage.loginRedirect ? window.sessionStorage.loginRedirect : "/";
  document.querySelector("#continue-button").setAttribute("onclick", `window.location.assign("${link}")`);
  return;
}

/* ========================================================================================
END
======================================================================================== */