const num_membs = 6
var mq = window.matchMedia("(min-width: 850px)")
var landscape = window.innerWidth > window.innerHeight

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

const teamInit = async () => {
  // Pre-Load
  try {
    await imageLoad();
  } catch (error) {
    console.log(error);
    return;
  }
  // Hide Loading Cover

  // Array of profiles
  var team = {};
  for (var i = 0; i < num_membs; i++) {
    team[i] = document.querySelector('.profile-section').children[i].children
  }

  function mainFunction(mq) {

    // -- Desktop --
    if (mq.matches && landscape) {

      // On desktop, 3 profiles per row
      var row = 3
      // Each position is in increments of 0.55
      var inc = 0.55

      window.addEventListener("scroll", function () {
        var pos = this.scrollY / document.documentElement.clientHeight
        if (pos == 0) {
          for (var i = 0; i < num_membs; i++) {
            for (var j = 1; j <= 3; j++) {
              team[i][j].style.display = 'none'
            }
          }
        } else if (pos > inc) {
          var ind = (Math.floor((pos / inc)) - 1) * row
          for (var i = ind; i < Math.min(ind + row, num_membs); i++) {
            for (var j = 1; j <= 3; j++) {
              team[i][j].style.display = 'block'
            }
          }
        }
      });

      // -- Mobile --
    } else {

      // On mobile, 2 profiles per row
      var row = 2
      // Each position is in increments of 0.45
      var inc = 0.45

      window.addEventListener("scroll", function () {
        var pos = this.scrollY / document.documentElement.clientHeight
        if (pos == 0) {
          for (var i = 0; i < num_membs; i++) {
            for (var j = 1; j <= 3; j++) {
              team[i][j].style.display = 'none'
            }
          }
        } else if (pos > inc) {
          var ind = (Math.floor((pos / inc)) - 1) * row
          for (var i = ind; i < Math.min(ind + row, num_membs); i++) {
            for (var j = 1; j <= 3; j++) {
              team[i][j].style.display = 'block'
            }
          }
        }
      });
    }
  }

  mainFunction(mq)
  mq.addListener(mainFunction)
}

const imageLoad = () => {
  return new Promise(async (resolve, reject) => {
    // Create Image Elements
    let carlImage = new Image();
    let carlosImage = new Image();
    let louisImage = new Image();
    let bradImage = new Image();
    let hyesuImage = new Image();
    let brydonImage = new Image();
    // Set Image Attributes;
    // Decoding
    carlImage.decoding = "async";
    carlosImage.decoding = "async";
    louisImage.decoding = "async";
    bradImage.decoding = "async";
    hyesuImage.decoding = "async";
    brydonImage.decoding = "async";

    carlImage.classList.add("indiv-photo");
    // Source
    carlImage.src = "./../../public/images/team/carl.png";
    carlosImage.src = "./../../public/images/team/carlos.png";
    louisImage.src = "./../../public/images/team/louis.png";
    bradImage.src = "./../../public/images/team/brad.jpg";
    hyesuImage.src = "./../../public/images/team/hyesu.png";
    brydonImage.src = "./../../public/images/team/brydon.jpg";
    // Decoding Promise
    try {
      await Promise.all([carlImage.decode(),
      carlosImage.decode(),
      louisImage.decode(),
      bradImage.decode(),
      hyesuImage.decode(),
      brydonImage.decode()]);
    } catch (error) {
      reject(error);
      return;
    }
    // Insert to document
    document.querySelector("#indiv-photo-carl-default").appendChild(carlImage);
    resolve("loaded");
    return;
  })
}