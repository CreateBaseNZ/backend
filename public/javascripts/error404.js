/* ========================================================================================
VARIABLES
======================================================================================== */

let error = {
  // VARIABLES

  // FUNCTIONS
  initialise: undefined,
  glitch: undefined,
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
  error.glitch();
}

error.fullHeight = () => {
  // document.querySelector('.main-page').style.height = document.querySelector('.main-page').offsetHeight - document.querySelector('.footer-section').offsetHeight + 'px'
}

error.glitch = () => {
  let el = document.getElementById("error-header")
  let i = Math.round(Math.random())
  let words = ['Oops', '4oh4']
  el.innerHTML = words[i]
  el.setAttribute('data-text', words[i])
  setTimeout(function () {
    el.classList.remove("glitch")
    setTimeout(function () {
      el.classList.add("glitch")
      setTimeout(function () {
        error.glitch(words);
      }, (100 + Math.random() * 100))
    }, (500 + Math.random() * 1500))
  }, (50 + Math.random() * 50))
}

/* ========================================================================================
END
======================================================================================== */