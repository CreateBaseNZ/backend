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
  var currentPage =  document.URL;
  return currentPage
}

nav.lightNavItem = function(){
  let currentPage = nav.checkPage()
  let navItems = nav.elem.navItem;
  console.log(currentPage)
  if (currentPage === 'https://createbase.co.nz/' || currentPage === 'https://createbase.co.nz/about' || currentPage === 'https://createbase.co.nz/about#first-section' || currentPage === 'http://127.0.0.1:5501/views/home.html' || currentPage === 'http://127.0.0.1:5501/views/about.html' || currentPage === 'http://localhost/' || currentPage === 'http://localhost/about'|| currentPage === 'http://localhost/about#first-section') {
    for (let i = 0; i < navItems.length; i++) {
      // navItems[i].style.color = '#1A1039';
      // console.log(navItems[i].classList);
      navItems[i].classList.add('light-menu-text');
    }
    // console.log('yep');
  }
  else{
    
    for (let i = 0; i < navItems.length; i++) {
      // navItems[i].style.color = '#1A1039';
      // console.log(navItems[i].classList);
      navItems[i].classList.remove('light-menu-text');
      navItems[i].classList.add('dark-menu-text');
    }
  }
}

nav.checkTop = function() {
  let navItems = nav.elem.navItem;
  let currentPage =  nav.checkPage();
  if (window.pageYOffset >= 24) {
    nav.elem.nav.classList.add('sticky')
      for (let i = 0; i < navItems.length; i++) {
        // navItems[i].style.color = '#1A1039';
        console.log(navItems[i].classList);

        navItems[i].classList.remove('light-menu-text');
        navItems[i].classList.add('dark-menu-text');
      }
  } else {
    nav.elem.nav.classList.remove('sticky')

    // if (currentPage === 'https://createbase.co.nz/' || 'https://createbase.co.nz/about' || 'http://127.0.0.1:5501/views/home.html' || 'http://127.0.0.1:5501/views/about.html') {
    //   for (let i = 0; i < navItems.length; i++) {
    //     navItems[i].style.color = '#fff';
    //   }
    // }


    // for (let i = 0; i < navItems.length; i++) {
    //   // navItems[i].style.color = '#1A1039';
    //   // console.log(navItems[i].classList);
    //   navItems[i].classList.remove('light-menu-text');
    //   navItems[i].classList.add('dark-menu-text');
    // }
    // console.log('remove sticky add dark');
    for (let i = 0; i < navItems.length; i++) {
      // navItems[i].style.color = '#1A1039';
      console.log(navItems[i].classList);

      navItems[i].classList.add('light-menu-text');
      navItems[i].classList.remove('dark-menu-text');
    }

  }
}

