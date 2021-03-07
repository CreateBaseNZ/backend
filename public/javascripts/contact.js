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
  contact.elem.sendBtn.classList.remove('active')
  const input = {
    name: contact.elem.name.value,
    email: contact.elem.email.value,
    subject: contact.elem.subject.value,
    message: contact.elem.message.value
  }

  const valid = contact.validate(input)

  if (!valid) {
    contact.elem.sendBtn.classList.add('active')
    return
  }

  let data;
  try {
    data = (await axios.post("/contact-us/submit-inquiry", input))["data"]
  } catch (error) {
    data = { status: "error", content: error }
  }

  if (data.status === 'error') {
    notification.generate('contact', 'error')
    return
  } else if (data.status === 'failed') {
    contact.elem.sendBtn.classList.add('active')
    notification.generate('contact', 'failed')
    return
  }

  contact.elem.name.value = null
  contact.elem.email.value = null
  contact.elem.subject.value = null
  contact.elem.message.value = null
  notification.generate('contact', 'success')
}

contact.validate = (input) => {
  let valid = true
  let nameRE = /^[A-Za-z0-9_-\s]+$/
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!nameRE.test(String(input.name).toLowerCase())) {
    document.querySelector('.name-error').innerHTML = "Please use another name"
    valid = false
  }
  if (!emailRE.test(String(input.email).toLowerCase())) {
    document.querySelector('.email-error').innerHTML = "Please enter a valid email"
    valid = false
  }
  if (input.subject.includes('"')) {
    document.querySelector('.subject-error').innerHTML = "Please use single quotation marks"
    valid = false
  }
  if (input.message.includes('"')) {
    document.querySelector('.message-error').innerHTML = "Please use single quotation marks"
    valid = false
  }
  return valid
}

// // @func  contactUs.declareVariables
// // @desc  
// contactUs.declareVariables = () => {
//   contactUs.name = document.querySelector("#form-name");
//   contactUs.email = document.querySelector("#form-email");
//   contactUs.subject = document.querySelector("#form-subject");
//   contactUs.message = document.querySelector("#form-msg");
//   contactUs.submitButton = document.querySelector("#form-submit");
// }

// // @func  contactUs.collect
// // @desc  
// contactUs.collect = () => {
//   return {
//     name: contactUs.name.value,
//     email: contactUs.email.value,
//     subject: contactUs.subject.value,
//     message: contactUs.message.value
//   }
// }

// // @func  contactUs.validate
// // @desc  
// contactUs.validate = (input = {}) => {
//   // DECLARE AND INITIALISE VARIABLES
//   let name = { valid: true, error: "" };
//   let email = { valid: true, error: "" };
//   let subject = { valid: true, error: "" };
//   let message = { valid: true, error: "" };
//   // Regex
//   let nameRE = /^[A-Za-z0-9_-\s]+$/;
//   let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   // VALIDATE NAME
//   if (!input.name) {
//     name.valid = false;
//     name.error = "Name is required";
//   } else if (!nameRE.test(String(input.name).toLowerCase())) {
//     name.valid = false;
//     name.error = "Invalid name";
//   }
//   // VALIDATE EMAIL
//   if (!input.email) {
//     email.valid = false;
//     email.error = "Email is required";
//   } else if (!emailRE.test(String(input.email).toLowerCase())) {
//     email.valid = false;
//     email.error = "Invalid email";
//   }
//   // VALIDATE SUBJECT
//   if (!input.subject) {
//     subject.valid = false;
//     subject.error = "Subject is required";
//   } else if (input.subject.includes('"')) {
//     subject.valid = false;
//     subject.error = "Subject cannot contain double quotation marks";
//   }
//   // VALIDATE MESSAGE
//   if (!input.message) {
//     message.valid = false;
//     message.error = "Message is required";
//   } else if (input.message.includes('"')) {
//     message.valid = false;
//     message.error = "Message cannot contain double quotation marks";
//   }
//   // UPDATE ERROR MESSAGES
//   document.querySelector("#form-name-error").innerHTML = name.error;
//   document.querySelector("#form-email-error").innerHTML = email.error;
//   document.querySelector("#form-subject-error").innerHTML = subject.error;
//   document.querySelector("#form-msg-error").innerHTML = message.error;
//   // FAILED HANDLER
//   if (!name.valid || !email.valid || !subject.valid || !message.valid) {
//     return false;
//   }
//   // SUCCESS HANDLER
//   return true;
// }

// // @func  contactUs.submit
// // @desc  
// contactUs.submit = async () => {
//   // DISABLE SUBMIT BUTTON
//   contactUs.submitButton.setAttribute("disabled", "");
//   // COLLECT
//   const input = contactUs.collect();
//   // VALIDATION
//   if (!contactUs.validate(input)) return contactUs.submitButton.removeAttribute("disabled");
//   // SEND REQUEST
//   let data;
//   try {
//     data = (await axios.post("/contact-us/submit-inquiry", input))["data"];
//   } catch (error) {
//     data = { status: "error", content: error };
//   }
//   // ERROR AND FAILED HANDLER
//   if (data.status === "error") {
//     console.log(data);
//     contactUs.submitButton.removeAttribute("disabled");
//     return contactUs.errorHandler(data.content);
//   } else if (data.status === "failed") {
//     console.log(data.content); // TEMPORARY
//     notification.popup("Failed to send the inquiry, please try again", "failed");
//     return contactUs.submitButton.removeAttribute("disabled");
//   }
//   // SUCCESS HANDLER
//   // clear input fields
//   contactUs.name.value = null;
//   contactUs.email.value = null;
//   contactUs.subject.value = null;
//   contactUs.message.value = null;
//   // notify user
//   contactUs.submitButton.removeAttribute("disabled");
//   return notification.popup(data.content, "sent");
// }

// // @func  contactUs.errorHandler
// // @desc  
// contactUs.errorHandler = (error = "") => {
//   console.log(error); // TEMPORARY
//   notification.popup("Encountered an error, refresh the page and try again", "error"); // TEMPORARY
//   return;
// }