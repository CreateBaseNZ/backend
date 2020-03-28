window,onbeforeunload = function () {
  window.scrollTo(0, 0)
}

const num_membs = 8
var mq = window.matchMedia("(min-width: 850px)")

const teamInit = async() => {

  // Array of profiles
  var team = {};
  for(var i=0; i < num_membs; i++){
    team[i] = document.querySelector('.profile-section').children[i].children
  }
  
  function mainFunction(mq) {

    // -- Desktop --
    if (mq.matches) {

      // On desktop, 3 profiles per row
      var row = 3
      // Each position is in increments of 0.55
      var inc = 0.55

      window.addEventListener("scroll", function () {
        var pos = this.scrollY / document.documentElement.clientHeight
        if (pos == 0) {
          for(var i = 0; i < num_membs; i++) {
            for(var j = 1; j <= 3; j++) {
              team[i][j].style.display = 'none'
            }
          }
        } else if (pos > inc) {
          var ind = (Math.floor((pos / inc)) - 1) * row
          for(var i = ind; i < Math.min(ind+row, num_membs); i++) {
            console.log(i)
            for(var j = 1; j <= 3; j++) {
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
          for(var i = 0; i < num_membs; i++) {
            for(var j = 1; j <= 3; j++) {
              team[i][j].style.display = 'none'
            }
          }
        } else if (pos > inc) {
          var ind = (Math.floor((pos / inc)) - 1) * row
          for(var i = ind; i < Math.min(ind+row, num_membs); i++) {
            console.log(i)
            for(var j = 1; j <= 3; j++) {
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