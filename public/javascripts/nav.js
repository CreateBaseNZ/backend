let nav = {
  // FUNCTIONS
  init: {
    attachListeners: undefined,
    init: undefined,
  },

  event: {
    navTop: undefined,
    toggleNavMenu: undefined,
  },

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
}

nav.init.attachListeners = () => {
  nav.elem.ham.addEventListener('click', nav.event.toggleNavMenu)
  window.addEventListener('scroll', nav.event.navTop)
}

nav.event.toggleNavMenu = (e) => {
  nav.elem.navMenu.classList.toggle('active');
  nav.elem.ham.classList.toggle('is-active');
}

nav.event.navTop = function() {
  if (this.scrollY > 40) {
    nav.elem.nav.classList.add('shrink')
  } else {
    nav.elem.nav.classList.remove('shrink')
  }
}

