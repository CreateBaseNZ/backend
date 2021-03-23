let contact = {
  init: {
    init: undefined,
    addListeners: undefined,
  },

  elem: {
    email: document.querySelector('#email'),
    message: document.querySelector('#message'),
    name: document.querySelector('#name'),
    sendBtn: document.querySelector('.send-btn'),
    subject: document.querySelector('#subject'),
  },

  event: {
    emailInput: undefined,
    messageInput: undefined,
    nameInput: undefined,
    subjectInput: undefined,
  },

  checkAllInputs: undefined,
  send: undefined,
  validate: undefined,
}

// ==================================================================
// FUNCTIONS
// ==================================================================

contact.init.init = () => {
  contact.init.addListeners()
}

contact.init.addListeners = () => {
  contact.elem.email.addEventListener('input', contact.event.emailInput)
  contact.elem.message.addEventListener('input', contact.event.messageInput)
  contact.elem.name.addEventListener('input', contact.event.nameInput)
  contact.elem.subject.addEventListener('input', contact.event.subjectInput)
  contact.elem.sendBtn.addEventListener('click', contact.send)
}

contact.event.emailInput = function() {
  contact.checkAllInputs()
  document.querySelector('.email-error').innerHTML = ''
}

contact.event.messageInput = function() {
  contact.checkAllInputs()
  document.querySelector('.message-error').innerHTML = ''
}

contact.event.nameInput = function() {
  contact.checkAllInputs()
  document.querySelector('.name-error').innerHTML = ''
}

contact.event.subjectInput = function() {
  contact.checkAllInputs()
  document.querySelector('.subject-error').innerHTML = ''
}

contact.checkAllInputs = () => {
  if (contact.elem.email.value && contact.elem.name.value && contact.elem.subject.value && contact.elem.message.value) {
    contact.elem.sendBtn.classList.add('active')
  } else {
    contact.elem.sendBtn.classList.remove('active')
  }
}

contact.send = async () => {
  // Disable button
  contact.elem.sendBtn.classList.remove('active');
  // Clear errors
  document.querySelector('.name-error').innerHTML = "";
    document.querySelector('.email-error').innerHTML = "";
    document.querySelector('.subject-error').innerHTML = "";
    document.querySelector('.message-error').innerHTML = "";
    // Collect inputs
  const input = {
    name: contact.elem.name.value,
    email: contact.elem.email.value,
    subject: contact.elem.subject.value,
    message: contact.elem.message.value
  }
  // Validate inputs
  const valid = contact.validate(input);
  if (!valid) return contact.elem.sendBtn.classList.add('active');
  // Send request to the backend
  let data;
  try {
    data = (await axios.post("/contact-us/submit-inquiry", input))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  // Validate
  if (data.status === 'error') {
    notification.generate('contact', 'error');
    return;
  } else if (data.status === 'failed') {
    contact.elem.sendBtn.classList.add('active');
    notification.generate('contact', 'failed');
    return;
  }
  // Clear inputs
  contact.elem.name.value = null;
  contact.elem.email.value = null;
  contact.elem.subject.value = null;
  contact.elem.message.value = null;
  // Re-activate the button
  contact.elem.sendBtn.classList.add('active');
  // Notify user of successful request
  notification.generate('contact', 'success');
  return;
}

contact.validate = (input) => {
  let valid = true
  let nameRE = /^[A-Za-z0-9_-\s]+$/
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!nameRE.test(String(input.name).toLowerCase())) {
    document.querySelector('.name-error').innerHTML = "Please use another name";
    valid = false
  }
  if (!emailRE.test(String(input.email).toLowerCase())) {
    document.querySelector('.email-error').innerHTML = "Please enter a valid email";
    valid = false
  }
  if (input.subject.includes('"')) {
    document.querySelector('.subject-error').innerHTML = "Please use single quotation marks";
    valid = false
  }
  if (input.message.includes('"')) {
    document.querySelector('.message-error').innerHTML = "Please use single quotation marks";
    valid = false
  }
  return valid
}