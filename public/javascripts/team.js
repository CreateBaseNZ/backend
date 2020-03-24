window,onbeforeunload = function () {
  window.scrollTo(0, 0)
}

const num_membs = 9

const teamInit = async() => {

  var team = {};
  
  for(var i=0; i < num_membs; i++){
    team[i] = document.getElementById('memb-'+i).childNodes;
  }

  window.addEventListener("scroll", function () {
    var pos = this.scrollY / document.documentElement.clientHeight
    console.log(pos)

    if (pos > 1.65) {
      team[6][3].style.display = 'block'
      team[6][5].style.display = 'block'
      team[6][7].style.display = 'block'
      team[7][3].style.display = 'block'
      team[7][5].style.display = 'block'
      team[7][7].style.display = 'block'
      team[8][3].style.display = 'block'
      team[8][5].style.display = 'block'
      team[8][7].style.display = 'block'
    } else if (pos > 1.1) {
      team[3][3].style.display = 'block'
      team[3][5].style.display = 'block'
      team[3][7].style.display = 'block'
      team[4][3].style.display = 'block'
      team[4][5].style.display = 'block'
      team[4][7].style.display = 'block'
      team[5][3].style.display = 'block'
      team[5][5].style.display = 'block'
      team[5][7].style.display = 'block'
    } else if (pos > 0.55) {
      team[0][3].style.display = 'block'
      team[0][5].style.display = 'block'
      team[0][7].style.display = 'block'
      team[1][3].style.display = 'block'
      team[1][5].style.display = 'block'
      team[1][7].style.display = 'block'
      team[2][3].style.display = 'block'
      team[2][5].style.display = 'block'
      team[2][7].style.display = 'block'
    } else if (pos == 0) {
      for(var i = 0; i < num_membs; i++){
        team[i][3].style.display = 'none'
        team[i][5].style.display = 'none'
        team[i][7].style.display = 'none'
      }
    }
  });

}