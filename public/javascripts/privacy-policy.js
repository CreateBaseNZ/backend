/* ========================================================================================
VARIABLES
======================================================================================== */

let priv = {
  initialise: undefined,
  eventListeners: undefined,
  scrollTo: undefined,
  easeInOutQuad: undefined,
  detectPos: undefined,

  menuItems: undefined,
  subPos: [],
  isScrolling: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  verification.initialise
// @desc  
priv.initialise = async () => {
  // LOAD SYSTEM
  try {
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
  priv.eventListeners()
  // inputListener();
}

priv.eventListeners = () => {
  priv.menuItems = Array.prototype.slice.call(document.querySelectorAll(".priv-menu-item"));

  priv.menuItems.forEach(function(el, i) {
    el.addEventListener('click', function(e) {
      document.querySelector('.priv-body-container').removeEventListener('scroll', priv.detectPos)
      document.querySelector('.priv-selected').classList.toggle('priv-selected')
      this.classList.toggle('priv-selected')
      let target = this.getAttribute("data")
      let targetElement = document.getElementById(target);
      var topPos = targetElement.offsetTop
      priv.scrollTo(document.querySelector('.priv-body-container'), topPos, 600);
      setTimeout(function() {   
        document.querySelector('.priv-body-container').addEventListener('scroll', priv.detectPos)
      }, 620);
    })
  })

  let ary2 = Array.prototype.slice.call(document.querySelectorAll(".content-container"));
  
  var body = document.querySelector('.priv-body-container').getBoundingClientRect().top
  var viewHeight = document.querySelector('.priv-body-container').clientHeight / 3
  ary2.forEach(function(el, i) {
    priv.subPos.push(el.getBoundingClientRect().top - body - viewHeight)
  })
  priv.subPos[0] = 0

  document.querySelector('.priv-body-container').addEventListener('scroll', priv.detectPos)
}

priv.scrollTo = (element, to, duration) => {
  var start = element.scrollTop,
  change = to - start,
  currentTime = 0,
  increment = 20

  var animateScroll = function() {        
    currentTime += increment
    var val = priv.easeInOutQuad(currentTime, start, change, duration)
    element.scrollTop = val
    if(currentTime < duration) {
      setTimeout(animateScroll, increment)
    }
  }
  animateScroll()
}

priv.easeInOutQuad = (t, b, c, d) => {
  t /= d/2
  if (t < 1) return c/2*t*t + b
  t--
  return -c/2 * (t*(t-2) - 1) + b
};

priv.detectPos = () => {

  var scrollTop = document.querySelector('.priv-body-container').scrollTop
  var scrollHeight = document.querySelector('.priv-body-container').scrollHeight
  var clientHeight = document.querySelector('.priv-body-container').clientHeight
  // Clear our timeout throughout the scroll
  window.clearTimeout( priv.isScrolling );
  // Set a timeout to run after scrolling ends
  priv.isScrolling = setTimeout(function() {
    // Run the callback
    if (scrollTop == 0) {
      document.querySelector('.priv-selected').classList.toggle('priv-selected')
      priv.menuItems[0].classList.toggle('priv-selected')
    } else if (scrollHeight - scrollTop === clientHeight) {
      document.querySelector('.priv-selected').classList.toggle('priv-selected')
      priv.menuItems[priv.menuItems.length-1].classList.toggle('priv-selected')
    } else {
      var m = 0;
      var n = priv.subPos.length - 1;
      while (m <= n) {
        var k = (n + m) >> 1;
        var cmp = scrollTop - priv.subPos[k];
        if (scrollTop == 0) {
          document.querySelector('.priv-selected').classList.toggle('priv-selected')
          priv.menuItems[0].classList.toggle('priv-selected')
          break
        } else if (scrollHeight - scrollTop === clientHeight) {
          document.querySelector('.priv-selected').classList.toggle('priv-selected')
          priv.menuItems[priv.menuItems.length-1].classList.toggle('priv-selected')
          break
        } else if (cmp > 0) {
          m = k + 1;
        } else if (cmp < 0) {
          n = k - 1;
        } else {
          document.querySelector('.priv-selected').classList.toggle('priv-selected')
          priv.menuItems[k].classList.toggle('priv-selected')
          break
        }
      }
      document.querySelector('.priv-selected').classList.toggle('priv-selected')
      priv.menuItems[n].classList.toggle('priv-selected')
    }
  }, 66);


}