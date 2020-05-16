const num_membs = 6
var mq = window.matchMedia("(min-width: 850px)")
var landscape = window.innerWidth > window.innerHeight

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

const teamInit = async () => {
  const objects = [{ src: "./../../public/images/team/carl.png", id: "indiv-photo-carl-default" },
  { src: "./../../public/images/team/carlos.png", id: "indiv-photo-carlos-default" },
  { src: "./../../public/images/team/louis.png", id: "indiv-photo-louis-default" },
  { src: "./../../public/images/team/hyesu.png", id: "indiv-photo-hyesu-default" },
  { src: "./../../public/images/team/brad.jpg", id: "indiv-photo-brad-default" },
  { src: "./../../public/images/team/brydon.jpg", id: "indiv-photo-brydon-default" }];
  const classes = ["indiv-photo"];
  // Pre-Load
  try {
    await imageLoader(objects, classes);
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