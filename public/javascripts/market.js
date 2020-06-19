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
  // LOAD SYSTEM
  try {
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
  // LOAD SESSION
  session.initialise();
  // ADD THE DYNAMIC WORDS EFFECT
  textSequence(0, market.words, "change-text");
}

/* ========================================================================================
END
======================================================================================== */