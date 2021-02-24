let notification = {
  alreadySubscribed: undefined,
  popup: undefined,
  subscribeSuccess: undefined,

  generate: undefined,

  elem: {
    wrapper: document.querySelector('.notif-wrapper')
  },

  event: {
    close: undefined
  }
}

// ==================================================================
// FUNCTIONS
// ==================================================================

notification.generate = (subject, status) => {
  var card = document.createElement('div')
  card.className = 'notif-card'
  symbol = document.createElement('i')
  card.appendChild(symbol).className = 'material-icons symbol'
  title = document.createElement('div')
  card.appendChild(title).className = 'notif-title'
  message = document.createElement('div')
  card.appendChild(message).className = 'notif-message'
  cancel = document.createElement('i')
  cancel.innerHTML = 'close'
  cancel.addEventListener('click', notification.event.close)
  card.appendChild(cancel).className = 'material-icons-round cancel'

  if (subject === 'subscribe') {
    if (status === 'success') {
      card.className += ' success'
      symbol.innerHTML = 'check_circle'
      title.innerHTML = 'Success!'
      message.innerHTML = "You're now receiving the latest news"
    } else if (status === 'already') {
      card.className += ' warning'
      symbol.innerHTML = 'warning'
      title.innerHTML = 'Already subscribed'
      message.innerHTML = "This email is already subscribed"
    } else {
      card.className += ' error'
      symbol.innerHTML = 'error'
      title.innerHTML = 'Unexpected error'
      message.innerHTML = "Sorry, please try again"
    }
  }

  notification.elem.wrapper.appendChild(card)
  setTimeout(() => {
    card.remove()
  }, 3000)
}

notification.event.close = function() {
  this.parentElement.classList.add('remove-now')
}

notification.alreadySubscribed = () => {
  //Create div to insert
  let newDiv = document.createElement('div')
  newDiv.className = 'alreadysubbed-notif'
  let messageWrap = document.createElement('div')
  newDiv.appendChild(messageWrap).className = 'msg-wrap'
  messageWrap.appendChild(document.createElement('i')).className = 'far fa-times-circle'
  messageWrap.appendChild(document.createElement('p')).innerHTML = 'This email is already subscribed'

  //Find location to insert div
  let notifDiv = document.getElementById('notification-wrap')
  let mobileDiv = document.getElementById('mobile-notif-wrap')

  //Add slide in animation
  newDiv.classList.add("slide-in");

  //Insert div
  var mq = window.matchMedia("(min-width: 53em)");
  if (mq.matches) {
    notifDiv.appendChild(newDiv)
  }
  else {
    mobileDiv.insertAdjacentElement('afterbegin', newDiv)
  }

  // Fade out
  setTimeout(() => {
    newDiv.style.transition = 'all 2s';
    newDiv.style.opacity = 0;
    // Hide
    setTimeout(() => {
      newDiv.style.display = 'none';
    }, 1000);
  }, 3000);
}

notification.popup = (message = "", type = "succeeded") => {
  // ICON
  let icon;
  switch (type) {
    case "succeeded": icon = "far fa-check-circle"; break;
    case "failed": icon = "far fa-times-circle"; break;
    case "error": icon = "fas fa-exclamation"; break;
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

notification.subscribeSuccess = () => {
  // Create div to insert
  let newDiv = document.createElement('div')
  newDiv.className = 'subbed-notif'
  let messageWrap = document.createElement('div')
  newDiv.appendChild(messageWrap).className = 'msg-wrap'
  messageWrap.appendChild(document.createElement('i')).className = 'fab fa-telegram-plane'
  messageWrap.appendChild(document.createElement('p')).innerHTML = 'Success!'
  // Find location to insert div
  let notifDiv = document.getElementById('notification-wrap');
  let mobileDiv = document.getElementById('mobile-notif-wrap');
  // Add slide in animation
  newDiv.classList.add("slide-in");
  // Insert div
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

// function projectNotif(callback, status) {
//   //Create div to insert
//   let newDiv = document.createElement('div')
//   newDiv.className = 'project-notif'
//   let messageWrap = document.createElement('div')
//   newDiv.appendChild(messageWrap).className = 'msg-wrap'
//   if (callback === 'succeeded') {
//     if (status === 'new') {
//       messageWrap.appendChild(document.createElement('i')).className = 'far fa-check-circle'
//       messageWrap.appendChild(document.createElement('p')).innerHTML = 'Your new project has been added.'
//     } else if (status === 'edit') {
//       messageWrap.appendChild(document.createElement('i')).className = 'far fa-edit'
//       messageWrap.appendChild(document.createElement('p')).innerHTML = 'Your changes have been saved.'
//     } else {
//       messageWrap.appendChild(document.createElement('i')).className = 'far fa-trash-alt'
//       messageWrap.appendChild(document.createElement('p')).innerHTML = 'Your project has been deleted.'
//     }
//   } else {
//     messageWrap.appendChild(document.createElement('i')).className = 'far fa-times-circle'
//     messageWrap.appendChild(document.createElement('p')).innerHTML = 'Oops! Something went wrong, please try again later.'
//     newDiv.style.color = 'red'
//   }

//   //Find location to insert div
//   let notifDiv = document.getElementById('notification-wrap')

//   //Add slide in animation
//   newDiv.classList.add("slide-in");

//   //Insert div
//   notifDiv.appendChild(newDiv)

//   setTimeout(() => {
//     // Fade out
//     setTimeout(() => {
//       newDiv.style.transition = 'all 2s'
//       newDiv.style.opacity = 0
//       // Hide
//       setTimeout(() => {
//         newDiv.style.display = 'none'
//       }, 1000)
//     }, 3000)
//   }, 1000)
// }