/* ========================================================================================
VARIABLES
======================================================================================== */

let story = {
  initialise: undefined,
  declare: undefined,
  initWindow: undefined,
  scrollListener: undefined,

  elements: [],
  positions: []
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  story.initialise
// @desc  
story.initialise = async () => {
  //updateSessionPage();
  // LOAD SYSTEM
  try {
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader()
  story.declare()
  story.initWindow()
  story.scrollListener()
}

story.declare = () => {
  story.elements = [
    document.getElementById('story-section-1').querySelector('h2'),
    document.getElementById('story-collab'),
    document.getElementById('story-section-1').querySelector('.story-text'),
    document.getElementById('story-section-2').querySelector('h2'),
    document.getElementById('story-team'),
    document.getElementById('story-carl'),
    document.getElementById('story-section-2').querySelector('.story-text'),
    document.getElementById('story-section-2').querySelector('.story-go-link'),
    document.getElementById('our-vision'),
    document.getElementById('story-carlos-craig'),
    document.getElementById('story-whiteboard'),
    document.getElementById('our-mission'),
    document.getElementById('story-web-team'),
    document.getElementById('story-section-5').querySelector('h2'),
    document.getElementById('strategy-a'),
    document.getElementById('story-brydon'),
    document.getElementById('strategy-b'),
    document.getElementById('story-section-5').querySelector('.story-go-link'),
    document.getElementById('story-section-7').querySelector('h2'),
    document.getElementById('story-kit-team'),
    document.getElementById('story-velocity'),
    document.getElementById('story-laptop'),
    document.getElementById('story-robotic-arm'),
    document.getElementById('story-section-8').querySelector('.story-go-link'),
    document.getElementById('story-section-9').querySelector('h2'),
    document.getElementById('story-social-container'),

  ]
  story.elements.forEach(function(el, i) {
    story.positions.push(el.getBoundingClientRect().top)
  })
}

story.initWindow = () => {
  if (!window.matchMedia("(min-width: 850px)").matches) {
    setTimeout(() => {
      story.recursive(window.innerHeight - 60, 0)
    }, 100)
  }
}

story.recursive = (max) => {
  if (story.elements[0].getBoundingClientRect().top < max) {
    story.elements[0].classList.toggle('shown')
    story.elements.shift()
    story.positions.shift()
    story.recursive(max)
  }
  return
}

story.scrollListener = () => {
  // if (!window.matchMedia("(min-width: 850px)").matches) {
    window.addEventListener('scroll', () => {
      var currentPos = (document.documentElement.scrollTop || window.pageYOffset) + window.innerHeight - 40
      if (currentPos > story.positions[0]) {
        story.elements[0].classList.toggle('shown')
        story.elements.shift()
        story.positions.shift()
      }
    })
  // }
}

/* ========================================================================================
END
======================================================================================== */