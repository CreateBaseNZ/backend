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
  checkPage: undefined,
  lightNavItem: undefined,

  elem: {
    ham: document.querySelector('.hamburger'),
    nav: document.querySelector('nav'),
    navLogo: document.querySelector('.nav-logo'),
    navLogoDark: document.querySelector('.cb-logo-dark'),
    navLogoLight: document.querySelector('.cb-logo-light'),
    navMenu: document.querySelector('.nav-menu'),
    navItem: document.querySelectorAll('.nav-item'),
    navHamburger: document.querySelector('.hamburger-inner')
  }
}

// ==================================================================
// FUNCTIONS
// ==================================================================

nav.init.init = () => {
  nav.init.attachListeners()
  nav.checkTop()
  nav.lightNavItem()
}

nav.init.attachListeners = () => {
  nav.elem.ham.addEventListener('click', nav.event.toggleNavMenu)
  window.addEventListener('scroll', nav.checkTop)
}

nav.event.toggleNavMenu = (e) => {
  nav.elem.navMenu.classList.toggle('active');
  nav.elem.ham.classList.toggle('is-active');
}

nav.checkPage = function(){
  let currentPage =  document.URL;
  return currentPage;
}

nav.lightNavItem = function(){
  let currentPage = nav.checkPage()
  let navItems = nav.elem.navItem;
  if (currentPage === 'https://createbase.co.nz/' || currentPage === 'https://createbase.co.nz/about' || currentPage === 'https://createbase.co.nz/about#first-section' || currentPage === 'http://127.0.0.1:5501/views/home.html' || currentPage === 'http://127.0.0.1:5501/views/about.html' || currentPage === 'http://localhost/' || currentPage === 'http://localhost/about'|| currentPage === 'http://localhost/about#first-section') {
    nav.elem.navLogoDark.classList.add('hide');
    nav.elem.navLogoLight.classList.remove('hide');
    for (let i = 0; i < navItems.length; i++) {
      navItems[i].classList.add('light-menu-text');
    }
  }
  else{
    for (let i = 0; i < navItems.length; i++) {
      navItems[i].classList.remove('light-menu-text');
      navItems[i].classList.add('dark-menu-text');
    }
  }
}

nav.checkTop = function() {
  console.log(nav.elem.navHamburger.style);
  let navItems = nav.elem.navItem;
  if (window.pageYOffset >= 24) {
    nav.elem.nav.classList.add('sticky')
    nav.elem.navLogoDark.classList.remove('hide');
    nav.elem.navLogoLight.classList.add('hide');
    for (let i = 0; i < navItems.length; i++) {
      navItems[i].classList.remove('light-menu-text');
      navItems[i].classList.add('dark-menu-text');
    };
  } else {
    nav.elem.nav.classList.remove('sticky')
    nav.elem.navLogoLight.classList.remove('hide');
    nav.elem.navLogoDark.classList.add('hide');
    for (let i = 0; i < navItems.length; i++) {
      navItems[i].classList.add('light-menu-text');
      navItems[i].classList.remove('dark-menu-text');
    }
  }
}

