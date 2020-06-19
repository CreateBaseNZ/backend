/* ========================================================================================
VARIABLES
======================================================================================== */

let notification = {
  popup: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

notification.popup = (message = "", type = "succeeded") => {
  // ICON
  let icon;
  switch (type) {
    case "succeeded": icon = "far fa-check-circle"; break;
    case "failed": icon = "far fa-times-circle"; break;
    case "sent": icon = "fab fa-telegram-plane"; break;
    default: icon = ""; break;
  }
  // CREATE ELEMENT
  let newDiv = document.createElement("div");
  newDiv.classList.add("subbed-notif");
  let messageWrap = document.createElement("div")
  newDiv.appendChild(messageWrap).classList.add("msg-wrap");
  messageWrap.appendChild(document.createElement('i')).className = icon;
  messageWrap.appendChild(document.createElement('p')).innerHTML = message;
  // INSERT ELEMENT
  let notifDiv = document.getElementById('notification-wrap')
  let mobileDiv = document.getElementById('mobile-notif-wrap')
  // Add slide in animation
  newDiv.classList.add("slide-in");
  //Insert div
  var mq = window.matchMedia("(min-width: 53em)");
  if (mq.matches) {
    notifDiv.appendChild(newDiv)
  }
  else {
    mobileDiv.appendChild(newDiv)
  }
  // Fade out
  setTimeout(() => {
    newDiv.style.transition = 'all 2s'
    newDiv.style.opacity = 0
    // Hide
    setTimeout(() => {
      newDiv.style.display = 'none'
    }, 1000)
  }, 3000)
}