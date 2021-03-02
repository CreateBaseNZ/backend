let priv = {

  init: {
    init: undefined,
    attachListeners: undefined,
  },

  event: {
    menuClick: undefined,
  },

  sectionPos: [],
  menuItems: Array.prototype.slice.call(document.querySelector(".priv-menu-list").querySelectorAll('li')),
}

// ==================================================================
// FUNCTIONS
// ==================================================================

priv.init.init = () => {
  priv.init.attachListeners()
  priv.init.getPos()
  window.scrollTo(0, 0)
}

priv.init.attachListeners = () => {
  priv.menuItems.forEach((el, i) => {
    el.addEventListener('click', priv.event.menuClick)
  })
  document.addEventListener('scroll', priv.event.detectPos)
}

priv.init.getPos = () => {
  document.querySelectorAll('.content-section').forEach((el, i) => {
    priv.sectionPos.push(el.offsetTop)
  })
}

priv.event.menuClick = function() {
  document.removeEventListener('scroll', priv.event.detectPos)
  document.querySelector('.priv-selected').classList.remove('priv-selected')
  this.classList.add('priv-selected')
  document.addEventListener('scroll', priv.event.detectPos)
}

priv.event.detectPos = () => {
  for (var i = priv.sectionPos.length-1; i >= 0; i--) {
    if (window.scrollY + 10 > priv.sectionPos[i]) {
      document.querySelector('.priv-selected').classList.remove('priv-selected')
      priv.menuItems[i].classList.add('priv-selected')
      return
    }
  }
}

// priv.eventListeners = () => {

//   let ary2 = Array.prototype.slice.call(document.querySelectorAll(".content-container"));
  
//   var body = document.querySelector('.priv-body-container').getBoundingClientRect().top
//   var viewHeight = document.querySelector('.priv-body-container').clientHeight / 3
//   ary2.forEach(function(el, i) {
//     priv.subPos.push(el.getBoundingClientRect().top - body - viewHeight)
//   })
//   priv.subPos[0] = 0

//   document.querySelector('.priv-body-container').addEventListener('scroll', priv.detectPos)
// }

// }