/* ========================================================================================
VARIABLES
======================================================================================== */

let market = {
  // VARIABLES
  words: ["COMING SOON", "MARKETPLACE"],
  // FUNCTIONS
  initialise: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

market.initialise = async () => {
  // LOAD NAVIGATION
  try {
    await navigation.initialise(false);
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  document.querySelector(".full-page-loading").classList.add("hide");
  // LOAD SESSION
  session.initialise();
  // ADD THE DYNAMIC WORDS EFFECT
  textSequence(0, market.words, "change-text");
}

/* ========================================================================================
END
======================================================================================== */