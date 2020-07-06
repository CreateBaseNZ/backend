/* ========================================================================================
VARIABLES
======================================================================================== */

let error = {
  // VARIABLES

  // FUNCTIONS
  initialise: undefined,
  fullHeight: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

error.initialise = async () => {
  // LOAD NAVIGATION
  try {
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
  error.fullHeight();
}

error.fullHeight = () => {
  document.querySelector('.main-page').style.height = document.querySelector('.main-page').offsetHeight - document.querySelector('.footer-section').offsetHeight + 'px'
}

/* ========================================================================================
END
======================================================================================== */