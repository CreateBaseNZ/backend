let home = {
  init: {
    init: undefined,
    swiper: undefined,
  },

  event: {
    onSwipe: undefined,
    afterSwipe: undefined,
  },

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

  // promises = [global.initialise(), home.addImages()];
  // try {
  //   await Promise.all(promises);
  // } catch (error) {
  //   return console.log(error);
  // }

  // PAGE CONFIGURATIONS
  // textSequence(0, home.words, "change-text");
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
  });
  home.slides[0].classList.add('active')
}

home.event.onSwipe = () => {
  home.slides[home.swiper.realIndex].classList.add('active')
  console.log(home.slides[home.swiper.realIndex])
}

home.event.afterSwipe = () => {
  home.slides[home.swiper.previousIndex].classList.remove('active')
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