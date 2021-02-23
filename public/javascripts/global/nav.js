/* ========================================================================================
VARIABLES
======================================================================================== */

let nav = {
  // FUNCTIONS
  init: {
    attachListeners: undefined,
    init: undefined,
  },

  event: {
    footerInput: undefined,
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

/* =============================================================
FUNCTIONS
============================================================= */


nav.init.init = () => {
  nav.init.attachListeners()
}

nav.init.attachListeners = () => {
  nav.elem.ham.addEventListener('click', nav.event.toggleNavMenu)
  window.addEventListener('scroll', nav.event.navTop)
  document.querySelector('#footer-input').addEventListener('input', nav.event.footerInput)
}

nav.event.footerInput = function() {
  if (this.value) {
    document.querySelector('.footer-btn').classList.add('active')
  } else {
    document.querySelector('.footer-btn').classList.remove('active')
  }
}

nav.event.toggleNavMenu = () => {
  // Toggle all on left
  nav.elem.navMenu.classList.toggle('active');
  nav.elem.ham.classList.toggle('is-active');
}

nav.event.navTop = function() {
  if (this.scrollY > 150) {
    nav.elem.navLogo.classList.add('shrink')
  } else {
    nav.elem.navLogo.classList.remove('shrink')
  }
}