/* ========================================================================================
VARIABLES
======================================================================================== */

let projects = {
  // VARIABLES
  swiper: undefined,
  // FUNCTIONS
  initialise: undefined,
  declareVariables: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  projects.initialise
// @desc  
projects.initialise = async () => {
  // DECLARE VARIABLES
  projects.declareVariables();
}

// @func  projects.declareVariables
// @desc  
projects.declareVariables = () => {
  projects.swiper = new Swiper('.swiper-container');
}

/* ========================================================================================
END
======================================================================================== */