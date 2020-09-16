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
  toggleShown: undefined,
  scrollListener: undefined,
  fullPage: undefined,

  elements: [],
  elementPositions: [],
  sections: [],
  navBars: [],
  oldScroll: window.scrollY,
  isScrolling: false,
  timeOut: undefined,

  idlePeriod: 100,
  animationDuration: 500,
  lastAnimation: 0,
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
  story.sections = Array.prototype.slice.call(document.querySelectorAll(".story-section"))

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
    story.toggleShown(0, 'shown');
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
  story.toggleShown(story.currIndex, 'hide');
  story.currIndex = i

  story.toggleShown(story.currIndex, 'shown')
  console.log(story.sections[story.currIndex])
  // clearTimeout(story.timeOut)
  // story.isScrolling = true
  // story.timeOut = setTimeout(() => {
  //   story.isScrolling = false
  // }, story.animationDuration)
  // story.sections[story.currIndex].scrollIntoView({behavior: "smooth"})

  window.scrollTo({top: story.sections[story.currIndex].getBoundingClientRect().top - 60 + window.pageYOffset, behavior: "smooth"})
}

story.toggleShown = (index, state) => {
  if (state === 'shown') {
    story.sections[index].classList.add('shown')
  } else {
    story.sections[index].classList.remove('shown')
  } 
}

story.scrollListener = () => {
  if (window.matchMedia("(min-width: 850px)").matches) {
    // window.addEventListener('scroll', (e) => {
    //   var timeNow = new Date().getTime()
    //   // Cancel scroll if currently animating or within quiet period
    //   if ((story.isScrolling) || (timeNow - story.lastAnimation < story.idlePeriod + story.animationDuration)) {
    //     e.preventDefault()
    //     console.log('should not be scrolling')
    //     story.oldScroll = window.scrollY
    //     return
    //   }
    //   if (story.oldScroll < window.scrollY) {
    //     story.navFunction(story.currIndex + 1)
    //   } else {
    //     story.navFunction(story.currIndex - 1)
    //   }
    //   story.oldScroll = window.scrollY
    //   story.lastAnimation = timeNow
    // }, false) 


    document.addEventListener('wheel', event => {
      var delta = event.wheelDelta;
      var timeNow = new Date().getTime();
      // Cancel scroll if currently animating or within quiet period
      if(timeNow - story.lastAnimation < story.idlePeriod + story.animationDuration) {
        event.preventDefault();
        return;
      }
      
      if (delta < 0) {
        var event = new Event('click');
        story.navBars[story.currIndex + 1].dispatchEvent(event);
        // story.navFunction(story.currIndex + 1)
      } else {
        var event = new Event('click');
        story.navBars[story.currIndex - 1].dispatchEvent(event);
        // story.navFunction(story.currIndex - 1)
      }
      
      story.lastAnimation = timeNow;
    }) 
    // window.addEventListener('scroll', story.fullPage, false)
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

story.fullPage = (e) => {
  window.removeEventListener('scroll', story.fullPage) 
  
  // var timeNow = new Date().getTime()
  // // Cancel scroll if currently animating or within quiet period
  // if (timeNow - story.lastAnimation < story.idlePeriod + story.animationDuration) {
  //   e.preventDefault()
  //   story.oldScroll = window.scrollY
  //   return
  // }

  console.log(story.oldScroll)
  console.log(window.scrollY)
  if (story.oldScroll < window.scrollY) {
    // console.log(story.currIndex)
    story.navFunction(story.currIndex + 1)
    // console.log(story.currIndex)
  } else {
    // console.log(story.currIndex)
    story.navFunction(story.currIndex - 1)
    // console.log(story.currIndex)
  }
  story.oldScroll = window.scrollY
  story.lastAnimation = timeNow

  setTimeout(() => {
    window.addEventListener('scroll', story.fullPage, false) 
  }, 1000)
}



/* ========================================================================================
END
======================================================================================== */