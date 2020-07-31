/* ========================================================================================
VARIABLES
======================================================================================== */

let contactUs = {
    initialise: undefined,
    sendVerification: undefined
  }
  
  /* ========================================================================================
  FUNCTIONS
  ======================================================================================== */
  
  // @func  verification.initialise
  // @desc  
  contactUs.initialise = async () => {
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