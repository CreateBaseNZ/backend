/* ========================================================================================
VARIABLES
======================================================================================== */

let touchBase = {
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

// @func  touchBase.initialise
// @desc  
touchBase.initialise = async () => {
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
  textSequence(0, touchBase.words, "change-text");
  //touchBase.subscription(login);
  touchBase.survey();
  touchBase.subscription();
}

touchBase.survey = () => {
  document.getElementById('parent-btn').addEventListener('click', () => {
    document.querySelector('.survey-options').classList.add('hide')
    document.getElementById('parent-survey').classList.remove('hide')
  })
  document.getElementById('student-btn').addEventListener('click', () => {
    document.querySelector('.survey-options').classList.add('hide')
    document.getElementById('student-survey').classList.remove('hide')
  })
  document.getElementById('both-btn').addEventListener('click', () => {
    document.querySelector('.survey-options').classList.add('hide')
    document.getElementById('parent-survey').classList.remove('hide')
  })
}

// @func  touchBase.subscription
// @desc  
touchBase.subscription = (login = false) => {
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