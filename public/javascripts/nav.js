var mq = window.matchMedia("(min-width: 850px)")

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
  const userIn = document.querySelector(".nav-user-icon")
  const userOut = document.querySelector(".nav-user-button")
  const rightMenuIn = document.querySelector(".nav-right-menu-in")
  const rightMenuOut = document.querySelector(".nav-right-menu-out")

  function mainFunction(mq) {

    if (mq.matches) { /* Desktop */

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
        userOut.style.display = "none"
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
  
        userOut.style.display = "block"
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

      userIn.style.display = "block"
      userOut.style.display = "none"
  
      if (status) { /* Logged in on mobile */
  
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
    
        userIn.addEventListener("click", function () {
          rightMenuOut.classList.toggle('nav-right-menu-active')
          userIn.classList.toggle('nav-user-active')
    
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