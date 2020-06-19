/* ========================================================================================
VARIABLES
======================================================================================== */

let error = {
  // VARIABLES

  // FUNCTIONS
  initialise: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

error.initialise = async () => {
  // LOAD GLOBAL
  try {
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  // LOAD NAVIGATION
  try {
    await navigation.initialise();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
}

/* ========================================================================================
END
======================================================================================== */