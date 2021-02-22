/* ========================================================================================
VARIABLES
======================================================================================== */

let nav = {
  // FUNCTIONS
  init: undefined,

  event: {
    toggleNavMenu: undefined,
  },

  elem: {
    ham: document.querySelector('.hamburger'),
    nav: document.querySelector('nav'),
    navMenu: document.querySelector('.nav-menu'),
  }
}

/* =============================================================
FUNCTIONS
============================================================= */


nav.init = () => {

}

nav.init.attachListeners = () => {
  nav.elem.ham.addEventListener('click', nav.event.toggleNavMenu)
}

nav.event.toggleNavMenu = () => {
  // Toggle all on left
  nav.elem.navMenu.classList.toggle('active');
  nav.elem.ham.classList.toggle('is-active');
}

nav.loadAnimation = () => {

}