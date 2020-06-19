const printingInit = async () => {

  // LOAD NAVIGATION
  try {
    await navigation.initialise(false);
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
  banner.add();

  history.scrollRestoration = "manual"
  var mq = window.matchMedia("(min-width: 60em)")

  var landscape = window.innerWidth > window.innerHeight

  if (mq.matches && landscape) {
  } else {
    var swiper = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
}