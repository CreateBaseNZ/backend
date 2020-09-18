/* ========================================================================================
VARIABLES
======================================================================================== */

let story = {
  initialise: undefined,
  declare: undefined,
  initWindow: undefined,
  recursive: undefined,
  initNav: undefined,
  navFunction: undefined,
  toggleActive: undefined,
  scrollListener: undefined,
  fullPage: undefined,

  elements: [],
  elementPositions: [],
  sections: [],
  navBars: [],
  offset: 200,
  currIndex: 0
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
  story.initNav()
  story.scrollListener()
}

story.declare = () => {
  let temp = Array.prototype.slice.call(document.querySelectorAll(".story-section"))

  temp.forEach(function(section, i) {
    let sect = {
      section: section,
      top: section.getBoundingClientRect().top + story.offset,
      bot: section.getBoundingClientRect().bottom - story.offset
    }
    story.sections.push(sect)
  })

  story.navBars = Array.prototype.slice.call(document.querySelectorAll(".story-bar-container"))

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
    document.getElementById('story-section-4').querySelector('h2'),
    document.getElementById('strategy-a'),
    document.getElementById('story-brydon'),
    document.getElementById('strategy-b'),
    document.getElementById('story-section-4').querySelector('.story-go-link'),
    document.getElementById('story-section-5').querySelector('h2'),
    document.getElementById('story-laptop'),
    document.getElementById('story-velocity'),
    document.getElementById('story-kit-team'),
    document.getElementById('story-robotic-arm'),
    document.getElementById('story-section-5').querySelector('.story-go-link'),
    document.getElementById('story-web-team'),
    document.getElementById('story-section-6').querySelector('h2'),
    document.getElementById('story-social-container')
  ]

  story.elements.forEach(function(el, i) {
    story.elementPositions.push(el.getBoundingClientRect().top)
  })
}

story.initWindow = () => {
  if (window.matchMedia("(min-width: 850px)").matches) {
    new fullpage('#fullpage', {
      //options here
      licenseKey: '1A848552-FFD34058-A6D0F08A-F33DC2F0',
      autoScrolling: true,
      scrollHorizontally: false,
      navigation: true,
      navigationPosition: 'right',
      navigationTooltips: ['Problem', 'Team', 'Purpose', 'Strats', 'Next', 'Connect']
    });
    // fullpage_api.setAllowScrolling(false);
    story.toggleActive(0, 'active');
    story.size = true
  } else {
    setTimeout(() => {
      story.recursive(window.innerHeight - global.topBarHeight, 0)
    }, 100)
    story.size = false
  }
  window.addEventListener('resize', () => {
    if (window.matchMedia("(min-width: 850px)").matches !== story.size) {
      location.reload()
    }
  })
}

story.recursive = (max) => {
  if (story.elements[0].getBoundingClientRect().top < max) {
    story.elements[0].classList.toggle('active')
    story.elements.shift()
    story.elementPositions.shift()
    story.recursive(max)
  }
  return
}

story.initNav = () => {
  story.navBars.forEach((el, i) => {
    el.addEventListener('click', () => {
      story.navFunction(i, el)
    })
  })
}

story.navFunction = (i) => {
  if (i === story.currIndex) {
    return
  }
  story.toggleActive(story.currIndex, 'hide');
  story.currIndex = i
  story.toggleActive(story.currIndex, 'active')

  window.scrollTo({top: story.sections[story.currIndex].top - story.offset - global.topBarHeight + window.pageYOffset, behavior: "smooth"})
}

story.toggleActive = (index, state) => {
  if (state === 'active') {
    story.sections[index].section.classList.add('active')
  } else {
    story.sections[index].section.classList.remove('active')
  } 
}

story.scrollListener = () => {
  if (!window.matchMedia("(min-width: 850px)").matches) {
    window.addEventListener('scroll', () => {
      var currentPos = (document.documentElement.scrollTop || window.pageYOffset) + window.innerHeight - 40
      if (currentPos > story.elementPositions[0]) {
        story.elements[0].classList.toggle('active')
        story.elements.shift()
        story.elementPositions.shift()
      }
    })
  }
}



/* ========================================================================================
END
======================================================================================== */