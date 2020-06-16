const homeInit = async () => {
  history.scrollRestoration = "manual"
  var mq = window.matchMedia("(min-width: 850px)")

  var landscape = window.innerWidth > window.innerHeight

  // LOAD NAVIGATION
  try {
    await navigation.initialise();
  } catch (error) {
    return console.log(error);
  }

  // TO DO .....
  // REMOVE STARTUP LOADER
  // TO DO .....

  // LOAD SESSION
  try {
    await session.initialise();
  } catch (error) {
    return console.log(error);
  }

  textSequence(0, ['COMING SOON', 'MARKETPLACE', 'COMING SOON', 'ENG KITS'], "change-text");

  if (mq.matches && landscape) {

    const landingCarousel = document.querySelector('.landing-carousel')
    const landing1 = document.querySelector('#landing-1')
    const landing2 = document.querySelector('#landing-2')
    const landing3 = document.querySelector('#landing-3')
    const landingBtn1 = document.querySelector('#landing-btn-1')
    const landingBtn2 = document.querySelector('#landing-btn-2')
    const landingBtn3 = document.querySelector('#landing-btn-3')

    function slide1Click() {
      if (landingBtn2.classList.contains('landing-slide-nav-btn-focus')) {
        landing1.classList.remove('landing-slide-left')
        landing2.classList.remove('landing-slide-middle')
        landing3.classList.remove('landing-slide-right')
        landing1.classList.add('landing-slide-middle')
        landing2.classList.add('landing-slide-right')
        landingCarousel.style.marginLeft = "150vmax"
        landingBtn2.classList.remove('landing-slide-nav-btn-focus')
        landingBtn1.classList.add('landing-slide-nav-btn-focus')
      } else if (landingBtn3.classList.contains('landing-slide-nav-btn-focus')) {
        landing2.classList.remove('landing-slide-left')
        landing3.classList.remove('landing-slide-middle')
        landing1.classList.add('landing-slide-middle')
        landing2.classList.add('landing-slide-right')
        landingCarousel.style.marginLeft = "150vmax"
        landingBtn3.classList.remove('landing-slide-nav-btn-focus')
        landingBtn1.classList.add('landing-slide-nav-btn-focus')
      }
    }
    function slide2Click() {
      if (landingBtn1.classList.contains('landing-slide-nav-btn-focus')) {
        landing1.classList.remove('landing-slide-middle')
        landing2.classList.remove('landing-slide-right')
        landing1.classList.add('landing-slide-left')
        landing2.classList.add('landing-slide-middle')
        landing3.classList.add('landing-slide-right')
        landingCarousel.style.marginLeft = "0vmax"
        landingBtn1.classList.remove('landing-slide-nav-btn-focus')
        landingBtn2.classList.add('landing-slide-nav-btn-focus')
      } else if (landingBtn3.classList.contains('landing-slide-nav-btn-focus')) {
        landing3.classList.remove('landing-slide-middle')
        landing2.classList.remove('landing-slide-left')
        landing1.classList.add('landing-slide-left')
        landing2.classList.add('landing-slide-middle')
        landing3.classList.add('landing-slide-right')
        landingCarousel.style.marginLeft = "0vmax"
        landingBtn3.classList.remove('landing-slide-nav-btn-focus')
        landingBtn2.classList.add('landing-slide-nav-btn-focus')
      }
    }
    function slide3Click() {
      if (landingBtn1.classList.contains('landing-slide-nav-btn-focus')) {
        landing1.classList.remove('landing-slide-middle')
        landing2.classList.remove('landing-slide-right')
        landing2.classList.add('landing-slide-left')
        landing3.classList.add('landing-slide-middle')
        landingCarousel.style.marginLeft = "-150vmax"
        landingBtn1.classList.remove('landing-slide-nav-btn-focus')
        landingBtn3.classList.add('landing-slide-nav-btn-focus')
      } else if (landingBtn2.classList.contains('landing-slide-nav-btn-focus')) {
        landing1.classList.remove('landing-slide-left')
        landing2.classList.remove('landing-slide-middle')
        landing3.classList.remove('landing-slide-right')
        landing2.classList.add('landing-slide-left')
        landing3.classList.add('landing-slide-middle')
        landingCarousel.style.marginLeft = "-150vmax"
        landingBtn2.classList.remove('landing-slide-nav-btn-focus')
        landingBtn3.classList.add('landing-slide-nav-btn-focus')
      }
    }

    landingBtn1.addEventListener("click", function () {
      slide1Click();
    });
    landingBtn2.addEventListener("click", function () {
      slide2Click();
    });
    landingBtn3.addEventListener("click", function () {
      slide3Click();
    });

    landing1.addEventListener("click", function () {
      slide1Click();
    });
    landing2.addEventListener("click", function () {
      slide2Click();
    });
    landing3.addEventListener("click", function () {
      slide3Click();
    });

  }
}

// const homeSubscribe = async () => {
//   // Fetch Email if user not login
//   let email = "";

//   // Loading animation

//   // Subscribe User
//   let data;
//   try {
//     data = await subscribe(email);
//   } catch (error) {
//     // Failed animation
//     return console.log(error);
//   }
//   // Success animation

//   return;
// }


