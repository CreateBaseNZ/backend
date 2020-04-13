const homeInit = async() => {
  history.scrollRestoration = "manual"
  var mq = window.matchMedia("(min-width: 850px)")

  var landscape = window.innerWidth > window.innerHeight

  const brycepKit = document.querySelector('.eng-kit-brycep')
  const hyelosKit = document.querySelector('.eng-kit-hyelos')

  let status;
  try {
    status = (await axios.get("/login-status"))["data"]["status"]
  } catch (error) {
    console.log(error)
    return
  }


  if (mq.matches && landscape)  {
    
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
  
    landingBtn1.addEventListener("click", function() {
      slide1Click();
    });
    landingBtn2.addEventListener("click", function() {
      slide2Click();
    });
    landingBtn3.addEventListener("click", function() {
      slide3Click();
    });
  
    landing1.addEventListener("click", function() {
      slide1Click();
    });
    landing2.addEventListener("click", function() {
      slide2Click();
    });
    landing3.addEventListener("click", function() {
      slide3Click();
    });  

  const brycepButton = document.querySelector('#eng-kit-btn-brycep');
  const hyelosButton = document.querySelector('#eng-kit-btn-hyelos');

  let activeSlide = brycepKit;
  let activeButton = brycepButton;

  window.addEventListener("scroll", function () {
    var scrollPos = this.scrollY;
    if (scrollPos > 380) {
      activeSlide.style.display = 'flex';
    } else if (scrollPos == 0) {
      activeSlide.style.display = 'none';
    }
  });
  
  brycepButton.addEventListener("click", function() {
    activeSlide.style.display = 'none';
    brycepKit.style.display = 'flex';
    activeSlide = brycepKit;

    activeButton.classList.remove('eng-kit-btn-focus');
    brycepButton.classList.add('eng-kit-btn-focus');
    activeButton = brycepButton;
  });

  hyelosButton.addEventListener("click", function() {
    activeSlide.style.display = 'none';
    hyelosKit.style.display = 'flex';
    activeSlide = hyelosKit;

    activeButton.classList.remove('eng-kit-btn-focus');
    hyelosButton.classList.add('eng-kit-btn-focus');
    activeButton = hyelosButton;
  });

  } else {

    window.addEventListener("scroll", function (event) {
      var scroll = this.scrollY;
      if (scroll > 350) {
        brycepKit.classList.add('eng-kit-load');
        hyelosKit.classList.add('eng-kit-load');
      } else if (scroll == 0) {
        brycepKit.classList.remove('eng-kit-load');
        hyelosKit.classList.remove('eng-kit-load');
      }
    });

    var swiper = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
      },
    });

  }
}



