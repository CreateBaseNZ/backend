window,onbeforeunload = function () {
  window.scrollTo(0, 0)
}

const teamInit = async() => {

  const memb1 = document.querySelector('#memb-1').childNodes
  const memb2 = document.querySelector('#memb-2').childNodes
  const memb3 = document.querySelector('#memb-3').childNodes
  const memb4 = document.querySelector('#memb-4').childNodes
  const memb5 = document.querySelector('#memb-5').childNodes
  const memb6 = document.querySelector('#memb-6').childNodes
  const memb7 = document.querySelector('#memb-7').childNodes
  const memb8 = document.querySelector('#memb-8').childNodes
  const memb9 = document.querySelector('#memb-9').childNodes
  


  window.addEventListener("scroll", function () {
    var pos = this.scrollY / document.documentElement.clientHeight

    if (pos > 3) {
      memb9[3].style.display = 'block'
      memb9[5].style.display = 'block'
    } else if (pos > 2.75) {
      memb8[3].style.display = 'block'
      memb8[5].style.display = 'block'
    } else if (pos > 2.45) {
      memb7[3].style.display = 'block'
      memb7[5].style.display = 'block'
    } else if (pos > 2.1) {
      memb6[3].style.display = 'block'
      memb6[5].style.display = 'block'
    } else if (pos > 1.85) {
      memb5[3].style.display = 'block'
      memb5[5].style.display = 'block'
    } else if (pos > 1.55) {
      memb4[3].style.display = 'block'
      memb4[5].style.display = 'block'
    } else if (pos > 1.25) {
      memb3[3].style.display = 'block'
      memb3[5].style.display = 'block'
    } else if (pos > 1) {
      memb2[3].style.display = 'block'
      memb2[5].style.display = 'block'
    } else if (pos > 0.67) {
      memb1[3].style.display = 'block'
      memb1[5].style.display = 'block'
    }
  });

}