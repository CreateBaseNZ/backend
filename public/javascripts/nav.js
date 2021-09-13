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
    navItem: document.querySelectorAll('.nav-item')
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
  let navItems = nav.elem.navItem;
  let currentPage =  document.URL;
  if (window.pageYOffset >= 24) {
    nav.elem.nav.classList.add('sticky')

    // if (currentPage === 'https://createbase.co.nz/' || 'https://createbase.co.nz/about' || 'http://127.0.0.1:5501/views/home.html' || 'http://127.0.0.1:5501/views/about.html') {
    //   for (let i = 0; i < navItems.length; i++) {
    //     navItems[i].style.color = '#1A1039';
    //   }
    // }

  } else {
    nav.elem.nav.classList.remove('sticky')

    // if (currentPage === 'https://createbase.co.nz/' || 'https://createbase.co.nz/about' || 'http://127.0.0.1:5501/views/home.html' || 'http://127.0.0.1:5501/views/about.html') {
    //   for (let i = 0; i < navItems.length; i++) {
    //     navItems[i].style.color = '#fff';
    //   }
    // }

  }
}

