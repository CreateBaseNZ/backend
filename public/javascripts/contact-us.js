/*=========================================================================================
VARIABLES
=========================================================================================*/

let contactUs = {
  // VARIABLES
  name: undefined,
  email: undefined,
  subject: undefined,
  message: undefined,
  submitButton: undefined,
  // FUNCTIONS
  initialise: undefined,
  declareVariables: undefined,
  populate: undefined,
  collect: undefined,
  validate: undefined,
  submit: undefined,
  errorHandler: undefined
}

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

// @func  contactUs.initialise
// @desc  
contactUs.initialise = async () => {
  /*// FETCH USER
  let data;
  try {
    data = (await axios.get("/fetch-account"))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  // ERROR HANDLER
  if (data.status === "error") return contactUs.errorHandler(data.content);*/
  // LOAD SYSTEM
  try {
    //await global.initialise(true, true, data.content.authenticated);
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  // DECLARE VARIABLES
  contactUs.declareVariables();
  // POPULATE IF AUTHENTICATED
  //if (data.content.authenticated) contactUs.populate(data.content.user);
  // REMOVE STARTUP LOADER
  removeLoader();
}

// @func  contactUs.declareVariables
// @desc  
contactUs.declareVariables = () => {
  contactUs.name = document.querySelector("#form-name");
  contactUs.email = document.querySelector("#form-email");
  contactUs.subject = document.querySelector("#form-subject");
  contactUs.message = document.querySelector("#form-msg");
  contactUs.submitButton = document.querySelector("#form-submit");
}

// @func  contactUs.populate
// @desc  
contactUs.populate = (account = {}) => {
  contactUs.name.value = account.name;
  contactUs.email.value = account.email;
}

// @func  contactUs.collect
// @desc  
contactUs.collect = () => {
  return {
    name: contactUs.name.value,
    email: contactUs.email.value,
    subject: contactUs.subject.value,
    message: contactUs.message.value
  }
}

// @func  contactUs.validate
// @desc  
contactUs.validate = (input = {}) => {
  // DECLARE AND INITIALISE VARIABLES
  let name = { valid: true, error: "" };
  let email = { valid: true, error: "" };
  let subject = { valid: true, error: "" };
  let message = { valid: true, error: "" };
  // Regex
  let nameRE = /^[A-Za-z0-9_-\s]+$/;
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // VALIDATE NAME
  if (!input.name) {
    name.valid = false;
    name.error = "Name is required";
  } else if (!nameRE.test(String(input.name).toLowerCase())) {
    name.valid = false;
    name.error = "Invalid name";
  }
  // VALIDATE EMAIL
  if (!input.email) {
    email.valid = false;
    email.error = "Email is required";
  } else if (!emailRE.test(String(input.email).toLowerCase())) {
    email.valid = false;
    email.error = "Invalid email";
  }
  // VALIDATE SUBJECT
  if (!input.subject) {
    subject.valid = false;
    subject.error = "Subject is required";
  } else if (input.subject.includes('"')) {
    subject.valid = false;
    subject.error = "Subject cannot contain double quotation marks";
  }
  // VALIDATE MESSAGE
  if (!input.message) {
    message.valid = false;
    message.error = "Message is required";
  } else if (input.message.includes('"')) {
    message.valid = false;
    message.error = "Message cannot contain double quotation marks";
  }
  // UPDATE ERROR MESSAGES
  document.querySelector("#form-name-error").innerHTML = name.error;
  document.querySelector("#form-email-error").innerHTML = email.error;
  document.querySelector("#form-subject-error").innerHTML = subject.error;
  document.querySelector("#form-msg-error").innerHTML = message.error;
  // FAILED HANDLER
  if (!name.valid || !email.valid || !subject.valid || !message.valid) {
    return false;
  }
  // SUCCESS HANDLER
  return true;
}

// @func  contactUs.submit
// @desc  
contactUs.submit = async () => {
  // DISABLE SUBMIT BUTTON
  contactUs.submitButton.setAttribute("disabled", "");
  // COLLECT
  const input = contactUs.collect();
  // VALIDATION
  if (!contactUs.validate(input)) return contactUs.submitButton.removeAttribute("disabled");
  // SEND REQUEST
  let data;
  try {
    data = (await axios.post("/contact-us/submit-inquiry", input))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  // ERROR AND FAILED HANDLER
  if (data.status === "error") {
    contactUs.submitButton.removeAttribute("disabled");
    return contactUs.errorHandler(data.content);
  } else if (data.status === "failed") {
    console.log(data.content); // TEMPORARY
    notification.popup("Failed to send the inquiry, please try again", "failed");
    return contactUs.submitButton.removeAttribute("disabled");
  }
  // SUCCESS HANDLER
  // clear input fields
  contactUs.name.value = null;
  contactUs.email.value = null;
  contactUs.subject.value = null;
  contactUs.message.value = null;
  // notify user
  contactUs.submitButton.removeAttribute("disabled");
  return notification.popup(data.content, "sent");
}

// @func  contactUs.errorHandler
// @desc  
contactUs.errorHandler = (error = "") => {
  console.log(error); // TEMPORARY
  notification.popup("Encountered an error, refresh the page and try again", "error"); // TEMPORARY
  return;
}

/*=========================================================================================
END
=========================================================================================*/