let notification = {
  generate: undefined,

  elem: {
    wrapper: document.querySelector('.notif-wrapper'),
  },

  event: {
    close: undefined,
  }
}

let popup = {
  close: undefined,
  elem: {
    subscribeBtn: document.querySelector('.popup-subscribe-btn'),
    subscribeError: document.querySelector('.popup-subscribe-error'),
    subscribeInput: document.querySelector('#popup-subscribe'),
    subscribeInputContainer: document.querySelector('.popup-subscribe-container'),
  },
  init: undefined,
  subscribeEnter: undefined,
  subscribeInput: undefined,
  subscribeSubmit: undefined,
}

// ==================================================================
// FUNCTIONS (NOTIFICATIONS)
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

// ==================================================================
// FUNCTIONS (POPUP)
// ==================================================================

popup.init = () => {
  document.querySelector('.popup').style.display = 'flex'
  sessionStorage.setItem('popup', true)
  popup.elem.subscribeBtn.addEventListener('click', popup.subscribeSubmit)
  popup.elem.subscribeInput.addEventListener('input', popup.subscribeInput)
  popup.elem.subscribeInput.addEventListener('keypress', popup.subscribeEnter)
  document.querySelector('.popup-close').addEventListener('click', popup.close)
}

popup.close = () => {
  document.querySelector('.popup').style.display = 'none'
}

popup.subscribeEnter = (e) => {
  if (e.key === 'Enter') {
    popup.subscribeSubmit()
  }
}

popup.subscribeInput = function() {
  popup.elem.subscribeError.innerHTML = ''
  if (this.value) {
    popup.elem.subscribeBtn.classList.add('active')
  } else {
    popup.elem.subscribeBtn.classList.remove('active')
  }
}

popup.subscribeSubmit = async () => {
  // Disable
  popup.elem.subscribeBtn.classList.remove('active')
  popup.elem.subscribeInputContainer.style.animationName = ''
  void popup.elem.subscribeInputContainer.offsetWidth

  // VALIDATE
  const result = global.validateEmail(popup.elem.subscribeInput.value)
  if (result === 'empty') {
    popup.elem.subscribeError.innerHTML = "An email is required"
    popup.elem.subscribeInputContainer.style.animationName = 'footer-shake'
    return
  } else if (result === 'invalid') {
    popup.elem.subscribeError.innerHTML = "Please enter a valid email"
    popup.elem.subscribeBtn.classList.add('active')
    popup.elem.subscribeInputContainer.style.animationName = 'footer-shake'
    return
  }

  // SUBMIT
  try {
    await global.subscribe(popup.elem.subscribeInput.value);
  } catch (error) {
    popup.elem.subscribeError.innerHTML = "An error occurred, please try again"
    popup.elem.subscribeBtn.classList.add('active')
    popup.generate('subscribe', 'error')
    return
  }
  // SUCCESS HANDLER
  popup.elem.subscribeInput.value = ""
  popup.elem.subscribeError.innerHTML = ""
}