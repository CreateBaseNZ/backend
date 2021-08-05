let about = {
    // FUNCTIONS
    init: {
    //   attachListeners: undefined,
      init: undefined,
      fullpage: undefined
    },

    
  
    // event: {
    //   toggleNavMenu: undefined,
    // },
  
    // checkTop: undefined,
  
    // elem: {
    //   ham: document.querySelector('.hamburger'),
    //   nav: document.querySelector('nav'),
    //   navLogo: document.querySelector('.nav-logo'),
    //   navMenu: document.querySelector('.nav-menu'),
    // }
  }
  
  // ==================================================================
  // FUNCTIONS
  // ==================================================================
  
  about.init.init = () => {
    // about.init.attachListeners()
    // nav.checkTop()
    about.fullpage()
  }

  about.fullpage = () => {
    new fullpage('#fullpage', {
        licenseKey: '1A848552-FFD34058-A6D0F08A-F33DC2F0',
        autoScrolling: false,
        bigSectionsDestination: 'top',
        anchors: ['first-section', 'second-section', 'third-section', 'fourth-section', 'fifth-section', 'sixth-section', 'seventh-section', 'eigth-section'],
        // menu: '#myMenu',
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['About CreateBase', 'The Problem', 'Our Goals', 'What we offer', 'Who is this for', 'The Team', 'Our achievements', 'Contact info'],
      });
  };
  
//   nav.init.attachListeners = () => {
//     nav.elem.ham.addEventListener('click', nav.event.toggleNavMenu)
//     window.addEventListener('scroll', nav.checkTop)
//   }
  
//   nav.event.toggleNavMenu = (e) => {
//     nav.elem.navMenu.classList.toggle('active');
//     nav.elem.ham.classList.toggle('is-active');
//   }
  
//   nav.checkTop = function() {
//     if (window.pageYOffset >= 24) {
//       nav.elem.nav.classList.add('sticky')
//     } else {
//       nav.elem.nav.classList.remove('sticky')
//     }
//   }
  
  