/* ========================================================================================
VARIABLES
======================================================================================== */

let verificationFailed = {
  initialise: undefined,
  sendVerification: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  verification.initialise
// @desc  
verificationFailed.initialise = async () => {
  // LOAD SYSTEM
  try {
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
  // inputListener();
}