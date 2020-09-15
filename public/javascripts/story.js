/* ========================================================================================
VARIABLES
======================================================================================== */

let story = {
  initialise: undefined,
  declare: undefined,
  initWindow: undefined,
  recursive: undefined,
  scrollListener: undefined,
  scrollTo: undefined,
  easeInOutQuad: undefined,
  detectPos: undefined,

  elements: [],
  elementPositions: [],
  sections: [],
  sectionPositions: [],
  navBars: [],
  funString: undefined,
  clientMid: undefined,
  currentSection: {},
  isScrolling: undefined
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
  story.sections = Array.prototype.slice.call(document.querySelectorAll(".story-section"))
  story.sections.forEach(function(element, i) {
    let top = element.getBoundingClientRect().top
    let bot = element.getBoundingClientRect().bottom
    let temp = {
      index: i,
      el: element,
      top: top,
      bot: bot,
      mid: top + (bot - top)/2
    }
    story.sectionPositions.push(temp)
  })
  console.log(story.sectionPositions)

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

  story.funString = "story.scrollTo(this);"
  story.clientMid = (document.documentElement.clientHeight) / 2 + 30

  story.currentSection = story.sectionPositions[0]
  console.log(story.currentSection)
}

story.initWindow = () => {
  if (window.matchMedia("(min-width: 850px)").matches) {

  } else {
    setTimeout(() => {
      story.recursive(window.innerHeight - 60, 0)
    }, 100)
  }
}

story.recursive = (max) => {
  if (story.elements[0].getBoundingClientRect().top < max) {
    story.elements[0].classList.toggle('shown')
    story.elements.shift()
    story.elementPositions.shift()
    story.recursive(max)
  }
  return
}

story.scrollListener = () => {
  if (window.matchMedia("(min-width: 850px)").matches) {
    // window.addEventListener('scroll', () => {
    //   var currentPos = (document.documentElement.scrollTop || window.pageYOffset) + window.innerHeight - 40
    //   if (currentPos > story.sectionPositions[0].top) {
    //     story.sections[0].classList.toggle('shown')
    //     story.sections.shift()
    //     story.sectionPositions.shift()
    //   }
    // })
    window.addEventListener('scroll', story.detectPos)
  } else {
    window.addEventListener('scroll', () => {
      var currentPos = (document.documentElement.scrollTop || window.pageYOffset) + window.innerHeight - 40
      if (currentPos > story.elementPositions[0]) {
        story.elements[0].classList.toggle('shown')
        story.elements.shift()
        story.elementPositions.shift()
      }
    })
  }
}

story.scrollTo = (el) => {
  console.log(el)

  // TO DO
  // document.querySelector('.tac-body-container').removeEventListener('scroll', story.detectPos)
  el.removeAttribute("onclick")
  
  document.querySelector('.story-selected').classList.toggle('story-selected')
  el.classList.toggle('story-selected')
  let target = el.getAttribute("data")
  let targetElement = document.getElementById(target);
  let duration = 600
  var start = document.documentElement.scrollTop,
  change = targetElement.offsetTop - 60 - start,
  currentTime = 0,
  increment = 20
  
  setTimeout(function() {   
    // document.querySelector('.tac-body-container').addEventListener('scroll', tac.detectPos)
    el.setAttribute("onclick", story.funString)
  }, 610);

  var animateScroll = function() {        
    currentTime += increment
    var val = story.easeInOutQuad(currentTime, start, change, duration)
    document.documentElement.scrollTop = val
    if(currentTime < duration) {
      setTimeout(animateScroll, increment)
    }
  }
  animateScroll()
}

story.easeInOutQuad = (t, b, c, d) => {
  t /= d/2
  if (t < 1) return c/2*t*t + b
  t--
  return -c/2 * (t*(t-2) - 1) + b
};

story.detectPos = () => {
  // console.log(currentMid)
  
  window.clearTimeout( story.isScrolling );
  // Set a timeout to run after scrolling ends
  story.isScrolling = setTimeout(function() {
    var currentMid = document.documentElement.scrollTop + story.clientMid
    console.log(currentMid)
    console.log(story.currentSection.mid)
    if (currentMid < story.currentSection.mid) {
      if (!story.sections[story.currentSection.index - 1].classList.contains('shown')) {
        try {
          story.sections[story.currentSection.index - 1].classList.toggle('shown')
          console.log('showing next')
          console.log(story.sections[story.currentSection.index - 1])
        } catch {}
      } else if (currentMid < story.sectionPositions[story.currentSection.index - 1].bot) {
        try {
          story.currentSection = story.sectionPositions[story.currentSection.index - 1]
          story.sectionPositions[story.currentSection.index + 2].el.classList.toggle('shown')
          console.log('switched to')
          console.log(story.currentSection)
        } catch {}
      }
    } else {
      if (!story.sections[story.currentSection.index + 1].classList.contains('shown')) {
        try {
          story.sections[story.currentSection.index + 1].classList.toggle('shown')
          console.log('showing next')
          console.log(story.sections[story.currentSection.index + 1])
        } catch {}
      } else if (currentMid > story.sectionPositions[story.currentSection.index + 1].top) {
        try {
          story.currentSection = story.sectionPositions[story.currentSection.index + 1]
          story.sectionPositions[story.currentSection.index - 2].el.classList.toggle('shown')
          console.log('switched to')
          console.log(story.currentSection)
        } catch {}
      }
    }
    if (currentMid == story.currentSection.mid) {
      console.log('equal')
      try {
        story.sections[story.currentSection.index - 1].classList.remove('shown')
      } catch {}
      try {
        story.sections[story.currentSection.index + 1].classList.remove('shown')
      } catch {}
    }
  }, 66);
}

/* ========================================================================================
END
======================================================================================== */