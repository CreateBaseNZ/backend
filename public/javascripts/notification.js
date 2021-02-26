let notification = {
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
  }, 6000)
}

notification.event.close = function() {
  this.parentElement.classList.add('remove-now')
}