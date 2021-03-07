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
  generate: undefined,
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
  } else if (subject === 'contact') {
    if (status === 'success') {
      card.className += ' success'
      symbol.innerHTML = 'check_circle'
      title.innerHTML = 'Success!'
      message.innerHTML = "We'll be in touch promptly"
    } else if (status === 'error') {
      card.className += ' error'
      symbol.innerHTML = 'error'
      title.innerHTML = 'Unexpected error'
      message.innerHTML = "Sorry, please refresh the page and try again"
    } else {
      card.className += ' error'
      symbol.innerHTML = 'error'
      title.innerHTML = 'Failed to send inquiry'
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
  if (document.querySelector('.popup')) {
    popup.generate()
    sessionStorage.setItem('popup', true)
    popup.elem = {
      main: document.querySelector('.popup'),
      subscribeBtn: document.querySelector('.popup-subscribe-btn'),
      subscribeError: document.querySelector('.popup-subscribe-error'),
      subscribeInput: document.querySelector('#popup-subscribe'),
      subscribeInputContainer: document.querySelector('.popup-subscribe-container'),
    },
    popup.elem.subscribeBtn.addEventListener('click', popup.subscribeSubmit)
    popup.elem.subscribeInput.addEventListener('input', popup.subscribeInput)
    popup.elem.subscribeInput.addEventListener('keypress', popup.subscribeEnter)
    document.querySelector('.popup-close').addEventListener('click', popup.close)
  }
}

popup.close = () => {
  popup.elem.main.style.display = 'none'
}

popup.generate = () => {
  popup_el = document.querySelector('.popup')
  popup_img = document.createElement('img')
  popup_img.src = '/public/images/popup.png'
  popup_el.appendChild(popup_img)
  popup_content = document.createElement('div')
  popup_el.appendChild(popup_content).className = 'popup-content'
  popup_title = document.createElement('div')
  popup_title.innerHTML = 'The CreateBase Newsletter'
  popup_content.appendChild(popup_title).className = 'popup-title'
  popup_message = document.createElement('div')
  popup_message.innerHTML = 'Be the first to receive exclusive discounts, rewards, and updates!'
  popup_content.appendChild(popup_message).className = 'popup-message'
  popup_input_container = document.createElement('div')
  popup_content.appendChild(popup_input_container).className = 'popup-subscribe-container'
  popup_input = document.createElement('input')
  popup_input.type = 'email'
  popup_input.name = 'email'
  popup_input.id = 'popup-subscribe'
  popup_input.maxLength = '100'
  popup_input.placeholder = 'Enter your email address'
  popup_input_container.appendChild(popup_input)
  popup_btn = document.createElement('div')
  popup_input_container.appendChild(popup_btn).className = 'popup-subscribe-btn'
  popup_error = document.createElement('div')
  popup_content.appendChild(popup_error).className = 'popup-subscribe-error'
  popup_privacy = document.createElement('div') 
  popup_content.appendChild(popup_privacy).className = 'popup-privacy'
  popup_lock = document.createElement('i')
  popup_lock.innerHTML = 'lock'
  popup_privacy.appendChild(popup_lock).className = 'material-icons-round'
  popup_span = document.createElement('span')
  popup_span.innerHTML = 'Your email is safe with us, check out our'
  popup_privacy.appendChild(popup_span)
  popup_link = document.createElement('a')
  popup_link.href = '/privacy'
  popup_link.innerHTML = 'privacy policy'
  popup_privacy.appendChild(popup_link)
  popup_close = document.createElement('i')
  popup_close.innerHTML = 'close'
  popup_el.appendChild(popup_close).className = 'material-icons-round popup-close'
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
    popup.elem.subscribeInputContainer.style.animationName = 'popup-shake'
    return
  } else if (result === 'invalid') {
    popup.elem.subscribeError.innerHTML = "Please enter a valid email"
    popup.elem.subscribeBtn.classList.add('active')
    popup.elem.subscribeInputContainer.style.animationName = 'popup-shake'
    return
  }

  // SUBMIT
  try {
    await global.subscribe(popup.elem.subscribeInput.value).then((data) => {
      // Resolved
      if (data === "already") {
        // Already subscribed
        notification.generate('subscribe', 'already')
        popup.elem.subscribeBtn.classList.add('active')
      } else {
        // Success
        notification.generate('subscribe', 'success')
        popup.elem.main.style.display = 'none'
      }
    },
    (data) => {
      // Rejected
      if (data === "error") {
        notification.generate('subscribe', 'error')
      } else if (data === "failed") {
        notification.generate('subscribe', 'error')
      }
    })
  } catch (error) {
    popup.elem.subscribeError.innerHTML = "An error occurred, please try again"
    popup.elem.subscribeBtn.classList.add('active')
    popup.generate('subscribe', 'error')
    return
  }
  // SUCCESS HANDLER
}