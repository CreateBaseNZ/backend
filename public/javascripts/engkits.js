/* ========================================================================================
VARIABLES
======================================================================================== */

let engkits = {
  // VARIABLES
  words: ["COMING SOON", "ENGINEERING KITS"],
  // FUNCTIONS
  initialise: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

engkits.initialise = async () => {
  // LOAD NAVIGATION
  try {
    await navigation.initialise();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  document.querySelector(".full-page-loading").classList.add("hide");
  // LOAD SESSION
  session.initialise();
  // ADD THE DYNAMIC WORDS EFFECT
  textSequence(0, engkits.words, "change-text");
}

/* ========================================================================================
END
======================================================================================== */