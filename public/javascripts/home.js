let home = {
  init: {
    attachListeners: undefined,
    init: undefined,
    swiper: undefined,
  },

  elem: {
    subscribeBtn: document.querySelector('.home-subscribe-btn'),
    subscribeError: document.querySelector('.home-subscribe-error'),
    subscribeInput: document.querySelector('#home-subscribe'),
    subscribeInputContainer: document.querySelector('.home-subscribe-container'),
  },

  event: {
    afterSwipe: undefined,
    onSwipe: undefined,
    subscribeEnter: undefined,
    subscribeInput: undefined,
  },

  subscribeSubmit: undefined,
  swiper: undefined,
  slides: Array.prototype.slice.call(document.querySelectorAll('.swiper-slide'))
}

// ==================================================================
// FUNCTIONS
// ==================================================================

// @func  home.initialise
// @desc  
home.init.init = () => {

  home.init.swiper()
  home.init.attachListeners()

  // promises = [global.initialise(), home.addImages()];
  // try {
  //   await Promise.all(promises);
  // } catch (error) {
  //   return console.log(error);
  // }

  // PAGE CONFIGURATIONS
  // textSequence(0, home.words, "change-text");
}

home.init.attachListeners = () => {
  home.elem.subscribeBtn.addEventListener('click', home.subscribeSubmit)
  home.elem.subscribeInput.addEventListener('input', home.event.subscribeInput)
  home.elem.subscribeInput.addEventListener('keypress', home.event.subscribeEnter)
}

home.init.swiper = () => {
  home.swiper = new Swiper('.swiper-container', {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    on: {
      slideChangeTransitionStart: home.event.onSwipe,
      slideChangeTransitionEnd: home.event.afterSwipe,
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    speed: 1500,
  });
  setTimeout(() => {
    home.slides[0].classList.add('active')
  }, 500)
}

home.event.afterSwipe = () => {
  home.slides[home.swiper.previousIndex].classList.remove('active')
}

home.event.onSwipe = () => {
  home.slides[home.swiper.realIndex].classList.add('active')
}

home.event.subscribeEnter = (e) => {
  if (e.key === 'Enter') {
    home.subscribeSubmit()
  }
}

home.event.subscribeInput = function() {
  home.elem.subscribeError.innerHTML = ''
  if (this.value) {
    home.elem.subscribeBtn.classList.add('active')
  } else {
    home.elem.subscribeBtn.classList.remove('active')
  }
}

home.subscribeSubmit = async () => {
  // Disable
  home.elem.subscribeBtn.classList.remove('active')
  home.elem.subscribeInputContainer.style.animationName = ''
  void home.elem.subscribeInputContainer.offsetWidth

  // VALIDATE
  const result = global.validateEmail(home.elem.subscribeInput.value)
  if (result === 'empty') {
    home.elem.subscribeError.innerHTML = "An email is required"
    home.elem.subscribeInputContainer.style.animationName = 'home-shake'
    return
  } else if (result === 'invalid') {
    home.elem.subscribeError.innerHTML = "Please enter a valid email"
    home.elem.subscribeBtn.classList.add('active')
    home.elem.subscribeInputContainer.style.animationName = 'home-shake'
    return
  }

  // SUBMIT
  try {
    await global.subscribe(home.elem.subscribeInput.value);
  } catch (error) {
    home.elem.subscribeError.innerHTML = "An error occurred, please try again"
    home.elem.subscribeBtn.classList.add('active')
    notification.generate('subscribe', 'error')
    return
  }
  // SUCCESS HANDLER
  home.elem.subscribeInput.value = ""
  home.elem.subscribeError.innerHTML = ""
}

// home.addImages = () => {
//   return new Promise(async (resolve, reject) => {
//     // IMAGES
//     const image1 = {
//       src: "/public/images/home/landing-3-1.jpg", id: "",
//       alt: "Landing 1", classes: [], parentId: "landing-1"
//     }
//     const image2 = {
//       src: "/public/images/home/landing-1-1.jpg", id: "",
//       alt: "Landing 2", classes: [], parentId: "landing-2"
//     }
//     const image3 = {
//       src: "/public/images/home/landing-2-1.jpg", id: "",
//       alt: "Landing 3", classes: [], parentId: "landing-3"
//     }
//     // LOAD IMAGES
//     const objects = [image1, image2, image3];
//     try {
//       await imageLoader(objects);
//     } catch (error) {
//       reject(error)
//     }
//     // SUCCESS RESPONSE
//     // Add classes for animation
//     document.querySelector("#landing-1").classList.add("landing-1");
//     document.querySelector("#landing-2").classList.add("landing-2");
//     document.querySelector("#landing-3").classList.add("landing-3");
//     resolve();
//   });
// }

// home.subscription = (login = false) => {
//   // INPUT FIELD DISPLAY
//   if (login) {
//     document.querySelector("#subscribe-field").classList.add("hide");
//   }
//   // BUTTON ATTRIBUTE
//   document.querySelector("#subscribe-main").setAttribute("onclick", `global.temporarySubscribeToMailingList();`);
// }