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

    if (pos > 1.85) {
      team[8][3].style.display = 'block'
      team[8][5].style.display = 'block'

      team[0][3].style.display = 'none'
      team[0][5].style.display = 'none'
      team[2][3].style.display = 'none'
      team[2][5].style.display = 'none'
      team[1][3].style.display = 'none'
      team[1][5].style.display = 'none'
      team[3][3].style.display = 'none'
      team[3][5].style.display = 'none'
    } else if (pos > 1.4) {
      team[5][3].style.display = 'block'
      team[5][5].style.display = 'block'
      team[7][3].style.display = 'block'
      team[7][5].style.display = 'block'
    } else if (pos > 1.2) {
      team[4][3].style.display = 'block'
      team[4][5].style.display = 'block'
      team[6][3].style.display = 'block'
      team[6][5].style.display = 'block'

      team[8][3].style.display = 'none'
      team[8][5].style.display = 'none'
    } else if (pos > 0.7) {
      team[1][3].style.display = 'block'
      team[1][5].style.display = 'block'
      team[3][3].style.display = 'block'
      team[3][5].style.display = 'block'
    } else if (pos > 0.5) {
      team[0][3].style.display = 'block'
      team[0][5].style.display = 'block'
      team[2][3].style.display = 'block'
      team[2][5].style.display = 'block'

      team[4][3].style.display = 'none'
      team[4][5].style.display = 'none'
      team[6][3].style.display = 'none'
      team[6][5].style.display = 'none'
      team[5][3].style.display = 'none'
      team[5][5].style.display = 'none'
      team[7][3].style.display = 'none'
      team[7][5].style.display = 'none'
    } else if (pos == 0) {
      team[0][3].style.display = 'none'
      team[0][5].style.display = 'none'
      team[2][3].style.display = 'none'
      team[2][5].style.display = 'none'
      team[1][3].style.display = 'none'
      team[1][5].style.display = 'none'
      team[3][3].style.display = 'none'
      team[3][5].style.display = 'none'
    }
  });

}