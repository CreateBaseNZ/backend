var mq = window.matchMedia("(min-width: 850px)")
var landscape = window.innerWidth > window.innerHeight

const navInit = async() => {

  let status
  try {
    status = (await axios.get("/login-status"))["data"]["status"]
  } catch (error) {
    console.log(error)
    return
  }

  const darken = document.querySelector(".nav-darken-overlay")
  const ham = document.querySelector(".hamburger")
  const leftMenu = document.querySelector(".nav-left-menu-wrap")
  const userIn = document.querySelector('.nav-in')
  const userDesktopOut = document.querySelector('.nav-desktop-out')
  const userMobileOut = document.querySelector('.nav-mobile-out')
  const rightMenuIn = document.querySelector(".nav-right-menu-in")
  const rightMenuOut = document.querySelector(".nav-right-menu-out")

  function mainFunction(mq) {

    if (mq.matches && landscape) { /* Desktop */

      darken.addEventListener("click", function () {
        if (leftMenu.classList.contains('nav-left-menu-active')) {
          leftMenu.classList.remove('nav-left-menu-active')
          ham.classList.remove('is-active')
        }
        if (rightMenuIn.classList.contains('nav-right-menu-active')) {
          rightMenuIn.classList.remove('nav-right-menu-active')
          userIn.classList.remove('nav-user-active')
        } else if (rightMenuOut.classList.contains('nav-right-menu-active')) {
          rightMenuOut.classList.remove('nav-right-menu-active')
          userOut.classList.remove('nav-user-active')
        }
        darken.classList.remove('nav-darken-overlay-active')
      })
  
      if (status) { /* Logged in on desktop */
  
        userIn.style.display = "block"
        userDesktopOut.style.display = "none"
        userMobileOut.style.display = "none"
        rightMenuIn.style.display = "block"
        rightMenuOut.style.display = "none"
  
        ham.addEventListener("click", function () {
          leftMenu.classList.toggle('nav-left-menu-active')
          ham.classList.toggle('is-active')
          
          if (!(rightMenuIn.classList.contains('nav-right-menu-active'))) {
            darken.classList.toggle('nav-darken-overlay-active')
          }
        })
    
        userIn.addEventListener("click", function () {
          rightMenuIn.classList.toggle('nav-right-menu-active')
          userIn.classList.toggle('nav-user-active')
    
          if (!(leftMenu.classList.contains('nav-left-menu-active'))) {
            darken.classList.toggle('nav-darken-overlay-active')
          }
        })
      } else { /* Logged out on desktop */
  
        userDesktopOut.style.display = "block"
        userMobileOut.style.display = "none"
        userIn.style.display = "none"
        rightMenuOut.style.display = "block"
        rightMenuIn.style.display= "none"
  
        ham.addEventListener("click", function () {
          leftMenu.classList.toggle('nav-left-menu-active')
          ham.classList.toggle('is-active')
          
          if (!(rightMenuOut.classList.contains('nav-right-menu-active'))) {
            darken.classList.toggle('nav-darken-overlay-active')
          }
        })
      }
  
    } else { /* Mobile */
  
      if (status) { /* Logged in on mobile */

        userIn.style.display = "block"
        userDesktopOut.style.display = "none"
        userMobileOut.style.display = "none"
        rightMenuOut.style.display = "none"
        rightMenuIn.style.display = "block"
  
        ham.addEventListener("click", function () {
          leftMenu.classList.toggle('nav-left-menu-active')
          ham.classList.toggle('is-active')
          
          if (rightMenuIn.classList.contains('nav-right-menu-active')) {
            rightMenuIn.classList.remove('nav-right-menu-active')
            userIn.classList.remove('nav-user-active')
          }
        })
    
        userIn.addEventListener("click", function () {
          rightMenuIn.classList.toggle('nav-right-menu-active')
          userIn.classList.toggle('nav-user-active')
    
          if (leftMenu.classList.contains('nav-left-menu-active')) {
            leftMenu.classList.remove('nav-left-menu-active')
            ham.classList.remove('is-active')
          } 
        })
      } else { /* Logged out on mobile */
  
        userMobileOut.style.display = "block"
        userDesktopOut.style.display = "none"
        userIn.style.display = "none"
        rightMenuOut.style.display = "block"
        rightMenuIn.style.display = "none"
  
        ham.addEventListener("click", function () {
          leftMenu.classList.toggle('nav-left-menu-active')
          ham.classList.toggle('is-active')
          
          if (rightMenuOut.classList.contains('nav-right-menu-active')) {
            rightMenuOut.classList.remove('nav-right-menu-active')
            userIn.classList.remove('nav-user-active')
          }
        })
    
        userMobileOut.addEventListener("click", function () {
          rightMenuOut.classList.toggle('nav-right-menu-active')
          userMobileOut.classList.toggle('nav-user-active')
    
          if (leftMenu.classList.contains('nav-left-menu-active')) {
            leftMenu.classList.remove('nav-left-menu-active')
            ham.classList.remove('is-active')
          } 
        })
      }
    }
  }
  mainFunction(mq)
  mq.addListener(mainFunction)
}

function passTab(el) {
  var tab = el.getAttribute('data-tab')
  localStorage.setItem('tab', tab)
}