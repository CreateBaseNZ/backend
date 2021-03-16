/* ========================================================================================
VARIABLES
======================================================================================== */

let survey = {
  // VARIABLES
  words: ["COMING SOON", "ENGINEERING KITS"],
  // FUNCTIONS
  initialise: undefined,
  subscription: undefined,
  survey: undefined,
  subscribe: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  survey.initialise
// @desc  
survey.initialise = async () => {
  /*updateSessionPage();
  // GET LOGIN STATUS 
  let data;
  try {
    data = (await axios.get("/login-status"))["data"];
  } catch (error) {
    return console.log(error);
  }
  const login = data.status;*/
  // LOAD SYSTEMS
  try {
    //await global.initialise(true, true, login);
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
  // LOAD SESSION
  //session.initialise();
  // ADD THE DYNAMIC WORDS EFFECT
  textSequence(0, survey.words, "change-text");
  //survey.subscription(login);
  survey.survey();
  survey.subscription();
}

survey.survey = () => {
  document.getElementById('parent-btn').addEventListener('click', () => {
    document.querySelector('.survey-options').classList.add('hide')
    if (window.matchMedia("(min-width: 850px)").matches) {
      document.getElementById('parent-desktop').classList.remove('hide')
    } else {
      document.getElementById('parent-mobile').classList.remove('hide')
    }
  })
  document.getElementById('student-btn').addEventListener('click', () => {
    document.querySelector('.survey-options').classList.add('hide')
    if (window.matchMedia("(min-width: 850px)").matches) {
      document.getElementById('student-desktop').classList.remove('hide')
    } else {
      document.getElementById('student-mobile').classList.remove('hide')
    }
  })
  document.getElementById('both-btn').addEventListener('click', () => {
    document.querySelector('.survey-options').classList.add('hide')
    if (window.matchMedia("(min-width: 850px)").matches) {
      document.getElementById('parent-desktop').classList.remove('hide')
    } else {
      document.getElementById('parent-mobile').classList.remove('hide')
    }
  })
}

// @func  survey.subscription
// @desc  
survey.subscription = (login = false) => {
  // INPUT FIELD DISPLAY
  if (login) {
    document.querySelector("#subscribe-field").classList.add("hide");
  }
  // BUTTON ATTRIBUTE
  document.querySelector("#subscribe-main").setAttribute("onclick", `global.temporarySubscribeToMailingList();`);
  document.getElementById('subscribe-email-input').addEventListener('keypress', ({key}) => {
    if (key === 'Enter') {
      global.temporarySubscribeToMailingList()
    }
  })
}

/* ========================================================================================
END
======================================================================================== */