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
    subscribeInput: undefined,
    subscribeEnter: undefined,
    navTop: undefined,
    toggleNavMenu: undefined,
  },

  elem: {
    ham: document.querySelector('.hamburger'),
    nav: document.querySelector('nav'),
    navLogo: document.querySelector('.nav-logo'),
    navMenu: document.querySelector('.nav-menu'),
    subscribeBtn: document.querySelector('.footer-btn'),
    subscribeInput: document.querySelector('#footer-input'),
    subscribeError: document.querySelector('.footer-error')
  },

  subscribeSubmit: undefined
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
  nav.elem.subscribeInput.addEventListener('input', nav.event.subscribeInput)
  nav.elem.subscribeInput.addEventListener('keypress', nav.event.subscribeEnter)
  nav.elem.subscribeBtn.addEventListener('click', nav.subscribeSubmit)
}

nav.event.subscribeInput = function() {
  if (this.value) {
    nav.elem.subscribeBtn.classList.add('active')
  } else {
    nav.elem.subscribeBtn.classList.remove('active')
  }
}

nav.event.subscribeEnter = (e) => {
  nav.elem.subscribeError.innerHTML = ''
  if (e.key === 'Enter') {
    nav.subscribeSubmit()
  }
}

nav.event.toggleNavMenu = () => {
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

nav.subscribeSubmit = async () => {
  // Disable
  nav.elem.subscribeBtn.classList.remove('active')
  nav.elem.subscribeInput.style.animationName = ''
  void nav.elem.subscribeInput.offsetWidth
  // COLLECT
  const email = nav.elem.subscribeInput.value
  // VALIDATE
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email === "") {
    // notification.popup("Email is required", "failed");
    nav.elem.subscribeError.innerHTML = "An email is required"
    nav.elem.subscribeInput.style.animationName = 'shake'
    return
  } else if (!emailRE.test(String(email).toLowerCase())) {
    // notification.popup("Invalid email", "failed");
    nav.elem.subscribeError.innerHTML = "Please enter a valid email"
    nav.elem.subscribeBtn.classList.add('active')
    nav.elem.subscribeInput.style.animationName = 'shake'
    return
  }
  // SUBMIT
  try {
    await global.subscribeToMailingList(email);
  } catch (error) {
    // TODO: Error message

    nav.elem.subscribeBtn.classList.add('active')
    return
  }
  // SUCCESS HANDLER
  nav.elem.subscribeInput.value = "";
  nav.elem.subscribeError.innerHTML = ""
  
  return;
}