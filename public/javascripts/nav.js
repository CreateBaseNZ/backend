let nav = {
  // FUNCTIONS
  init: {
    attachListeners: undefined,
    init: undefined,
  },

  event: {
    toggleNavMenu: undefined,
  },

  checkTop: undefined,

  elem: {
    ham: document.querySelector('.hamburger'),
    nav: document.querySelector('nav'),
    navLogo: document.querySelector('.nav-logo'),
    navMenu: document.querySelector('.nav-menu'),
  }
}

// ==================================================================
// FUNCTIONS
// ==================================================================

nav.init.init = () => {
  nav.init.attachListeners()
  nav.checkTop()
}

nav.init.attachListeners = () => {
  nav.elem.ham.addEventListener('click', nav.event.toggleNavMenu)
  window.addEventListener('scroll', nav.checkTop)
}

nav.event.toggleNavMenu = (e) => {
  nav.elem.navMenu.classList.toggle('active');
  nav.elem.ham.classList.toggle('is-active');
}

nav.checkTop = function() {
  if (window.pageYOffset >= 24) {
    nav.elem.nav.classList.add('sticky')
  } else {
    nav.elem.nav.classList.remove('sticky')
  }
}

