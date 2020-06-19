/* ========================================================================================
VARIABLES
======================================================================================== */

let story = {
  initialise: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  story.initialise
// @desc  
story.initialise = async () => {
  // LOAD GLOBAL
  try {
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  // LOAD NAVIGATION
  try {
    await navigation.initialise(false);
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
}


/* ========================================================================================
END
======================================================================================== */