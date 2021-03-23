let terms = {

  init: {
    init: undefined,
    attachListeners: undefined,
  },

  event: {
    menuClick: undefined,
  },

  sectionPos: [],
  menuItems: Array.prototype.slice.call(document.querySelector(".terms-menu-list").querySelectorAll('li')),
}

// ==================================================================
// FUNCTIONS
// ==================================================================

terms.init.init = () => {
  terms.init.attachListeners()
  terms.init.getPos()
  window.scrollTo(0, 0)
}

terms.init.attachListeners = () => {
  terms.menuItems.forEach((el, i) => {
    el.addEventListener('click', terms.event.menuClick)
  })
  document.addEventListener('scroll', terms.event.detectPos)
}

terms.init.getPos = () => {
  document.querySelectorAll('.content-section').forEach((el, i) => {
    terms.sectionPos.push(el.offsetTop)
  })
}

terms.event.menuClick = function() {
  document.removeEventListener('scroll', terms.event.detectPos)
  document.querySelector('.terms-selected').classList.remove('terms-selected')
  this.classList.add('terms-selected')
  document.addEventListener('scroll', terms.event.detectPos)
}

terms.event.detectPos = () => {
  if (window.scrollY + window.innerHeight > document.querySelector('footer').offsetTop) {
    document.querySelector('.terms-menu-list').classList.add('sticky')
  } else {
    document.querySelector('.terms-menu-list').classList.remove('sticky')
  }
  for (var i = terms.sectionPos.length-1; i >= 0; i--) {
    if (window.scrollY + 10 > terms.sectionPos[i]) {
      document.querySelector('.terms-selected').classList.remove('terms-selected')
      terms.menuItems[i].classList.add('terms-selected')
      return
    }
  }
}