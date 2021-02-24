let footer = {
  init: {
    attachListeners: undefined,
    init: undefined,
  },

  elem: {
    subscribeBtn: document.querySelector('.footer-btn'),
    subscribeError: document.querySelector('.footer-error'),
    subscribeInput: document.querySelector('#footer-input'),
  },

  event: {
    subscribeEnter: undefined,
    subscribeInput: undefined,
  },

  subscribeSubmit: undefined
}

// ==================================================================
// FUNCTIONS
// ==================================================================

footer.init.init = () => {
  footer.init.attachListeners()
}

footer.init.attachListeners = () => {
  footer.elem.subscribeInput.addEventListener('input', footer.event.subscribeInput)
  footer.elem.subscribeInput.addEventListener('keypress', footer.event.subscribeEnter)
  footer.elem.subscribeBtn.addEventListener('click', footer.subscribeSubmit)
}

footer.event.subscribeInput = function() {
  if (this.value) {
    footer.elem.subscribeBtn.classList.add('active')
  } else {
    footer.elem.subscribeBtn.classList.remove('active')
  }
}

footer.event.subscribeEnter = (e) => {
  footer.elem.subscribeError.innerHTML = ''
  if (e.key === 'Enter') {
    footer.subscribeSubmit()
  }
}

footer.subscribeSubmit = async () => {
  // Disable
  footer.elem.subscribeBtn.classList.remove('active')
  footer.elem.subscribeInput.style.animationName = ''
  void footer.elem.subscribeInput.offsetWidth

  // VALIDATE
  const result = global.validateEmail(footer.elem.subscribeInput.value)
  if (result === 'empty') {
    // notification.popup("Email is required", "failed");
    footer.elem.subscribeError.innerHTML = "An email is required"
    footer.elem.subscribeInput.style.animationName = 'shake'
    return
  } else if (result === 'invalid') {
    // notification.popup("Invalid email", "failed");
    footer.elem.subscribeError.innerHTML = "Please enter a valid email"
    footer.elem.subscribeBtn.classList.add('active')
    footer.elem.subscribeInput.style.animationName = 'shake'
    return
  }

  // SUBMIT
  try {
    await global.subscribe(footer.elem.subscribeInput.value);
  } catch (error) {
    // TODO: Error message
    footer.elem.subscribeError.innerHTML = "An error occurred, please try again"
    footer.elem.subscribeBtn.classList.add('active')
    return
  }
  // SUCCESS HANDLER
  footer.elem.subscribeInput.value = "";
  footer.elem.subscribeError.innerHTML = ""
  
  return;
}