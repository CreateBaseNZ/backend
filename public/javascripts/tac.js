/* ========================================================================================
VARIABLES
======================================================================================== */

let tac = {
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
tac.initialise = async () => {
  // LOAD SYSTEM
  try {
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  tac.eventListeners()
  // REMOVE STARTUP LOADER
  removeLoader();
  // inputListener();
}

tac.eventListeners = () => {
  tac.menuItems = Array.prototype.slice.call(document.querySelectorAll(".tac-menu-item"));

  tac.menuItems.forEach(function(el, i) {
    el.addEventListener('click', function(e) {
      document.querySelector('.tac-body-container').removeEventListener('scroll', tac.detectPos)
      document.querySelector('.tac-selected').classList.toggle('tac-selected')
      this.classList.toggle('tac-selected')
      let target = this.getAttribute("data")
      let targetElement = document.getElementById(target);
      var topPos = targetElement.offsetTop
      tac.scrollTo(document.querySelector('.tac-body-container'), topPos, 600);
      setTimeout(function() {   
        document.querySelector('.tac-body-container').addEventListener('scroll', tac.detectPos)
      }, 620);
    })
  })

  let ary2 = Array.prototype.slice.call(document.querySelectorAll(".content-container"));
  
  setTimeout(function() {   
    var body = document.querySelector('.tac-body-container').getBoundingClientRect().top
    var viewHeight = document.querySelector('.tac-body-container').clientHeight / 3
    ary2.forEach(function(el, i) {
      tac.subPos.push(el.getBoundingClientRect().top - body - viewHeight)
    })
    tac.subPos[0] = 0
  }, 1);

  document.querySelector('.tac-body-container').addEventListener('scroll', tac.detectPos)
}

tac.scrollTo = (element, to, duration) => {
  var start = element.scrollTop,
  change = to - start,
  currentTime = 0,
  increment = 20

  var animateScroll = function() {        
    currentTime += increment
    var val = tac.easeInOutQuad(currentTime, start, change, duration)
    element.scrollTop = val
    if(currentTime < duration) {
      setTimeout(animateScroll, increment)
    }
  }
  animateScroll()
}

tac.easeInOutQuad = (t, b, c, d) => {
  t /= d/2
  if (t < 1) return c/2*t*t + b
  t--
  return -c/2 * (t*(t-2) - 1) + b
};

tac.detectPos = () => {

  var scrollTop = document.querySelector('.tac-body-container').scrollTop
  var scrollHeight = document.querySelector('.tac-body-container').scrollHeight
  var clientHeight = document.querySelector('.tac-body-container').clientHeight
  // Clear our timeout throughout the scroll
  window.clearTimeout( tac.isScrolling );
  // Set a timeout to run after scrolling ends
  tac.isScrolling = setTimeout(function() {
    // Run the callback
    if (scrollTop == 0) {
      document.querySelector('.tac-selected').classList.toggle('tac-selected')
      tac.menuItems[0].classList.toggle('tac-selected')
    } else if (scrollHeight - scrollTop === clientHeight) {
      document.querySelector('.tac-selected').classList.toggle('tac-selected')
      tac.menuItems[tac.menuItems.length-1].classList.toggle('tac-selected')
    } else {
      var m = 0;
      var n = tac.subPos.length - 1;
      while (m <= n) {
        var k = (n + m) >> 1;
        var cmp = scrollTop - tac.subPos[k];
        if (scrollTop == 0) {
          document.querySelector('.tac-selected').classList.toggle('tac-selected')
          tac.menuItems[0].classList.toggle('tac-selected')
          break
        } else if (scrollHeight - scrollTop === clientHeight) {
          document.querySelector('.tac-selected').classList.toggle('tac-selected')
          tac.menuItems[tac.menuItems.length-1].classList.toggle('tac-selected')
          break
        } else if (cmp > 0) {
          m = k + 1;
        } else if (cmp < 0) {
          n = k - 1;
        } else {
          document.querySelector('.tac-selected').classList.toggle('tac-selected')
          tac.menuItems[k].classList.toggle('tac-selected')
          break
        }
      }
      document.querySelector('.tac-selected').classList.toggle('tac-selected')
      tac.menuItems[n].classList.toggle('tac-selected')
    }
  }, 66);


}