/* ========================================================================================
VARIABLES
======================================================================================== */

let settings = {
  initialise: undefined,
  fetchCustomerDetails: undefined,
  updateSubmit: undefined,
  // EMAIL SECTION
  editEmail: undefined,
  populateEmail: undefined,
  changeEmail: undefined,
  changeEmailCollect: undefined,
  changeEmailValidate: undefined,
  changeEmailSubmit: undefined,
  changeEmailEnable: undefined,
  changeEmailDisable: undefined,
  // ADDRESS SECTION
  editAddress: undefined,
  populateAddress: undefined,
  changeAddress: undefined,
  changeAddressCollect: undefined,
  changeAddressValidate: undefined,
  changeAddressEnable: undefined,
  changeAddressDisable: undefined,
  // PASSWORD SECTION
  editPassword: undefined,
  changePassword: undefined,
  changePasswordCollect: undefined,
  changePasswordValidate: undefined,
  changePasswordSubmit: undefined,
  changePasswordClear: undefined,
  changePasswordEnable: undefined,
  changePasswordDisable: undefined,
  // SUBSCRIPTION SECTION
  populateSubscription: undefined,
  changeSubscription: undefined,
  changeSubscriptionCollect: undefined,
  changeSubscriptionValidate: undefined,
  changeSubscriptionEnable: undefined,
  changeSubscriptionDisable: undefined,
  // DELETE ACCOUNT SECTION
  deleteAccountConfirmation: undefined,
  deleteAccountCancel: undefined,
  deleteAccount: undefined,
  deleteAccountCollect: undefined,
  deleteAccountValidate: undefined,
  deleteAccountSubmit: undefined,
  deleteAccountEnable: undefined,
  deleteAccountDisable: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  settings.initialise
// @desc  
settings.initialise = async () => {
  // FETCH DETAILS
  let data;
  try {
    data = await settings.fetchCustomerDetails();
  } catch (error) {
    // TO DO .....
    // ERROR HANDLING
    // TO DO .....
    return console.log(error);
  }
  if (data.status === "failed") {
    // TO DO .....
    // ERROR HANDLING
    // TO DO .....
    return console.log(data.content);
  }
  const details = data.content;
  // POPULATE FIELDS
  // Email
  settings.populateEmail(details.account.email);
  document.getElementById('emailPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      settings.changeEmail()
    }
  })
  // Address
  settings.populateAddress(details.customer.address);
  // Password
  document.getElementById('confirmNewPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      settings.changePassword()
    }
  })
  // Subscription
  settings.populateSubscription(details.customer.subscription.mail);
  // Delete
  document.getElementById('confirm-removal-password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      settings.deleteAccount()
    }
  })
}

// @func  settings.fetchCustomerDetails
// @desc  
settings.fetchCustomerDetails = () => {
  return new Promise(async (resolve, reject) => {
    // SEND REQUEST TO THE BACKEND
    let data;
    try {
      data = (await axios.get("/settings/fetch-customer-details"))["data"];
    } catch (error) {
      return reject(error);
    }
    // RESOLVE PROMISE
    return resolve(data);
  })
}

// @func  settings.updateSubmit
// @desc  
settings.updateSubmit = (updates) => {
  return new Promise(async (resolve, reject) => {
    // SEND REQUEST TO THE BACKEND
    let data;
    try {
      data = (await axios.post("/settings/update", updates))["data"];
    } catch (error) {
      return reject(error);
    }
    // RESOLVE PROMISE
    return resolve(data);
  })
}

/* ----------------------------------------------------------------------------------------
EMAIL
---------------------------------------------------------------------------------------- */

// @func  settings.editEmail
// @desc  
settings.editEmail = () => {
  console.log('being used')
  document.getElementById('settings-email-container').classList.toggle('settings-active')
  document.getElementById('settings-email-error').innerHTML = ''
  return;
}

// @func  settings.populateEmail
// @desc  
settings.populateEmail = (email) => {
  // TO DO .....
  // Assign ID of the email display element
  document.querySelector("#settingEmail").value = email;
  // TO DO .....

  // TO DO .....
  // Assign ID of the email loader element
  // document.querySelector("#").classList.add("hide");
  // TO DO .....
  return;
};

// @func  settings.changeEmail
// @desc  Initiate the Change Email
settings.changeEmail = async () => {
  settings.changeEmailDisable();
  // COLLECT INPUTS
  const [email, password] = settings.changeEmailCollect();
  // VALIDATE INPUTS
  if (!settings.changeEmailValidate(email, password)) {
    return settings.changeEmailEnable();
  };
  // SUBMIT REQUEST
  let data;
  try {
    data = await settings.changeEmailSubmit(email, password);
  } catch (error) {
    document.getElementById("settings-email-error").innerHTML = "Failed";
    settings.changeEmailEnable();
    return console.log(error);
  }
  // VALIDATE DATA
  if (data.status === "failed") {
    console.log(data)
    document.getElementById("settings-email-error").innerHTML = data.content;
    return settings.changeEmailEnable();
  }
  // SUCCESS HANDLER
  return window.location.href = "/verification";
}

// @func  settings.changeEmailCollect
// @desc  
settings.changeEmailCollect = () => {
  // COLLECT
  const email = document.querySelector("#newEmail").value;
  const password = document.querySelector("#emailPassword").value;
  // SUCCESS HANDLER
  return [email, password];
}

// @func  settings.changeEmailValidate
// @desc  
settings.changeEmailValidate = (email, password) => {
  let valid = true;
  let error = "";
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // PASSWORD
  if (!password) {
    valid = false;
    error = "Password required";
  } else if (!global.passwordValidity(password)) {
    valid = false;
    error = "Invalid password";
  }
  // EMAIL
  if (!email) {
    valid = false;
    error = "Email required";
  } else if (!emailRE.test(String(email).toLowerCase())) {
    valid = false;
    errorEmail = "Invalid email";
  }
  // SET ERROR
  document.getElementById("settings-email-error").innerHTML = error;
  // SUCCESS HANDLER
  return valid;
}

// @func  settings.changeEmailSubmit
// @desc  Sends the change email request to the backend
settings.changeEmailSubmit = (email, password) => {
  return new Promise(async (resolve, reject) => {
    // SEND REQUEST TO THE BACKEND
    let data;
    try {
      data = (await axios.post("/settings/change-email", { email, password }))["data"];
    } catch (error) {
      return reject(error);
    }
    // RESOLVE PROMISE
    return resolve(data);
  })
}

// @func  settings.changeEmailEnable
// @desc  
settings.changeEmailEnable = () => {
  // LOADER
  // TO DO .....
  // Assign ID of the email loader element
  // document.querySelector("#").classList.add("hide");
  // TO DO .....
  // BUTTONS
  document.querySelector("#settings-email-submit").removeAttribute("disabled");
  document.querySelector("#settings-email-cancel").removeAttribute("disabled");
}

// @func  settings.changeEmailDisable
// @desc  
settings.changeEmailDisable = () => {
  // LOADER
  // TO DO .....
  // Assign ID of the email loader element
  // document.querySelector("#").classList.remove("hide");
  // TO DO .....
  // BUTTONS
  document.querySelector("#settings-email-submit").setAttribute("disabled", "");
  document.querySelector("#settings-email-cancel").setAttribute("disabled", "");
}

/* ----------------------------------------------------------------------------------------
ADDRESS
---------------------------------------------------------------------------------------- */

// @func  settings.editAddress
// @desc  
settings.editAddress = () => {
  document.getElementById('settings-address-container').classList.toggle('settings-active')
  document.getElementById('settings-email-error').innerHTML = ''

  if (document.querySelector("#addressUnit").getAttribute("disabled") === "") {
    document.querySelector("#addressName").removeAttribute("disabled");
    document.querySelector("#addressUnit").removeAttribute("disabled");
    document.querySelector("#streetNum").removeAttribute("disabled");
    document.querySelector("#streetName").removeAttribute("disabled");
    document.querySelector("#addressSuburb").removeAttribute("disabled");
    document.querySelector("#addressCity").removeAttribute("disabled");
    document.querySelector("#postCode").removeAttribute("disabled");
    document.querySelector("#addressCountry").removeAttribute("disabled");
  } else {
    document.querySelector("#addressName").setAttribute("disabled", "");
    document.querySelector("#addressUnit").setAttribute("disabled", "");
    document.querySelector("#streetNum").setAttribute("disabled", "");
    document.querySelector("#streetName").setAttribute("disabled", "");
    document.querySelector("#addressSuburb").setAttribute("disabled", "");
    document.querySelector("#addressCity").setAttribute("disabled", "");
    document.querySelector("#postCode").setAttribute("disabled", "");
    document.querySelector("#addressCountry").setAttribute("disabled", "");
  }
  return;
}

// @func  settings.populateAddress
// @desc  
settings.populateAddress = (address) => {
  document.querySelector("#addressName").value = address.recipient;
  document.querySelector("#addressUnit").value = address.unit;
  document.querySelector("#streetNum").value = address.street.number;
  document.querySelector("#streetName").value = address.street.name;
  document.querySelector("#addressSuburb").value = address.suburb;
  document.querySelector("#addressCity").value = address.city;
  document.querySelector("#postCode").value = address.postcode;
  document.querySelector("#addressCountry").value = address.country;

  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.add("hide");
  // TO DO .....
  return;
};

// @func  settings.changeAddress
// @desc  
settings.changeAddress = async () => {
  settings.changeAddressDisable();
  // COLLECT INPUTS
  const address = settings.changeAddressCollect();
  // VALIDATE INPUTS
  if (!settings.changeAddressValidate(address)) return settings.changeAddressEnable();
  // SUBMIT REQUEST
  const updates = { subscription: { mail: undefined }, address };
  let data;
  try {
    data = await settings.updateSubmit(updates);
  } catch (error) {
    settings.changeAddressEnable();
    return console.log(error);
  }
  // VALIDATE DATA
  if (data.status === "failed") {
    document.getElementById("settings-address-error").innerHTML = data.content;
    return settings.changeAddressEnable();
  }
  // SUCCESS HANDLER
  // Update the address on the dashboard
  document.querySelector("#profile-location").innerHTML = `${address.city}, ${address.country}`;
  // Add a notification
  notification.popup("Address updated");
  // Toggle Edit Mode
  settings.changeAddressEnable();
  return settings.editAddress();
}

// @func  settings.changeAddressCollect
// @desc  
settings.changeAddressCollect = () => {
  const address = {
    recipient: document.querySelector("#addressName").value,
    unit: document.querySelector("#addressUnit").value,
    street: {
      number: document.querySelector("#streetNum").value,
      name: document.querySelector("#streetName").value
    },
    suburb: document.querySelector("#addressSuburb").value,
    city: document.querySelector("#addressCity").value,
    postcode: document.querySelector("#postCode").value,
    country: document.querySelector("#addressCountry").value
  }
  return address;
}

// @func  settings.changeAddressValidate
// @desc  
settings.changeAddressValidate = (address) => {
  let valid = true;
  let error = "";
  // STREET NUMBER
  if (!address.street.number) {
    valid = false;
    error = "Street number required";
  }
  // STREET NAME
  if (!address.street.name) {
    valid = false;
    error = "Street name required";
  }
  // SUBURB
  if (!address.suburb) {
    valid = false;
    error = "Suburb required";
  }
  // CITY
  if (!address.city) {
    valid = false;
    error = "City required";
  }
  // POSTCODE
  if (!address.postcode) {
    valid = false;
    error = "Postcode required";
  }
  // COUNTRY
  if (!address.country) {
    valid = true;
    error = "";
  }
  // SET ERROR
  document.getElementById("settings-address-error").innerHTML = error;
  return valid;
}

// @func  settings.changeAddressEnable
// @desc  
settings.changeAddressEnable = () => {
  // LOADER
  // TO DO .....
  // Assign ID of the email loader element
  // return document.querySelector("#").classList.add("hide");
  // TO DO .....
  // BUTTONS
  document.querySelector("#settings-address-submit").removeAttribute("disabled");
  document.querySelector("#settings-address-cancel").removeAttribute("disabled");
}

// @func  settings.changeAddressDisable
// @desc  
settings.changeAddressDisable = () => {
  // LOADER
  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.remove("hide");
  // TO DO .....
  // BUTTONS
  document.querySelector("#settings-address-submit").setAttribute("disabled", "");
  document.querySelector("#settings-address-cancel").setAttribute("disabled", "");
}

/* ----------------------------------------------------------------------------------------
PASSWORD
---------------------------------------------------------------------------------------- */

// @func  settings.editPassword
// @desc  
settings.editPassword = () => {
  document.getElementById('settings-pass-container').classList.toggle('settings-active')
  return;
}

// @func  settings.changePassword
// @desc  Initiate the Change Password
settings.changePassword = async () => {
  settings.changePasswordDisable();
  // COLLECT INPUTS
  const [newPassword, newPasswordConfirm, password] = settings.changePasswordCollect();
  // VALIDATE INPUTS
  if (!settings.changePasswordValidate(newPassword, newPasswordConfirm, password)) return settings.changePasswordEnable();
  // SUBMIT REQUEST
  let data;
  try {
    data = await settings.changePasswordSubmit(newPassword, password);
  } catch (error) {
    console.log(error);
    return settings.changePasswordEnable();
  }
  // VALIDATE DATA
  if (data.status === "failed") {
    document.getElementById("settings-pass-error").innerHTML = data.content
    return settings.changePasswordEnable();
  }
  // SUCCESS HANDLER
  // Add a notification
  notification.popup("Password updated");
  // Clear Input Fields
  settings.changePasswordClear();
  settings.changePasswordEnable();
  // Toggle Edit Mode
  return settings.editPassword();
}

// @func  settings.changePasswordCollect
// @desc  
settings.changePasswordCollect = () => {
  const newPassword = document.querySelector("#newPassword").value;
  const newPasswordConfirm = document.querySelector("#confirmNewPassword").value;
  const password = document.querySelector("#oldPassword").value;

  return [newPassword, newPasswordConfirm, password];
}

// @func  settings.changePasswordValidate
// @desc  
settings.changePasswordValidate = (newPassword, newPasswordConfirm, password) => {
  let valid = true;
  let error = "";
  // NEW PASSWORD CONFIRM
  if (!newPasswordConfirm) {
    valid = false;
    error = "Confirm new password required";
  }
  // NEW PASSWORD
  if (!newPassword) {
    valid = false;
    error = "New password required";
  } else if (!global.passwordValidity(newPassword)) {
    valid = false;
    error = "Password is too weak";
  }
  // PASSWORD MATCH
  if (newPassword !== newPasswordConfirm) {
    valid = false;
    error = "New password does not match";
  }
  // PASSWORD
  if (!password) {
    valid = false;
    error = "Password required";
  } /*else if (!global.passwordValidity(password)) {
    valid = false;
    error = "invalid password";
  }*/
  // SET ERROR
  document.getElementById("settings-pass-error").innerHTML = error;

  return valid;
}

// @func  settings.changePasswordSubmit
// @desc  Sends the change password request to the backend
settings.changePasswordSubmit = (newPassword, password) => {
  return new Promise(async (resolve, reject) => {
    // SEND REQUEST TO THE BACKEND
    let data;
    try {
      data = (await axios.post("/settings/change-password", { newPassword, password }))["data"];
    } catch (error) {
      return reject(error);
    }
    // RESOLVE PROMISE
    return resolve(data);
  })
}

// @func  settings.changePasswordClear
// @desc  
settings.changePasswordClear = () => {
  document.querySelector("#newPassword").value = "";
  document.querySelector("#confirmNewPassword").value = "";
  document.querySelector("#oldPassword").value = "";
  return;
}

// @func  settings.changePasswordEnable
// @desc  
settings.changePasswordEnable = () => {
  // LOADER
  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.add("hide");
  // TO DO .....
  // BUTTONS
  document.querySelector("#settings-password-submit").removeAttribute("disabled");
  document.querySelector("#settings-password-cancel").removeAttribute("disabled");
}

// @func  settings.changePasswordDisable
// @desc  
settings.changePasswordDisable = () => {
  // LOADER
  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.remove("hide");
  // TO DO .....
  // BUTTONS
  document.querySelector("#settings-password-submit").setAttribute("disabled", "");
  document.querySelector("#settings-password-cancel").setAttribute("disabled", "");
}

/* ----------------------------------------------------------------------------------------
SUBSCRIPTION
---------------------------------------------------------------------------------------- */

// @func  settings.populateSubscription
// @desc  
settings.populateSubscription = (subscription) => {
  document.querySelector("#settings-subscription-input").checked = subscription;
  if (subscription) {
    document.getElementById('settings-sub-status').innerHTML = 'Subscribed'
    document.getElementById('settings-sub-status').classList.add('settings-subbed')
  } else {
    document.getElementById('settings-sub-status').innerHTML = 'Subscribe'
    document.getElementById('settings-sub-status').classList.add('settings-not-subbed')
  }
  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.add("hide");
  // TO DO .....
  return;
}

// @func  settings.changeSubscription
// @desc  
settings.changeSubscription = async () => {
  settings.changeSubscriptionDisable();
  // COLLECT INPUTS
  const subscription = settings.changeSubscriptionCollect();
  // VALIDATE INPUTS
  if (!settings.changeSubscriptionValidate(subscription)) return settings.changeSubscriptionEnable();
  // SUBMIT REQUEST
  const updates = { subscription: { mail: subscription }, address: undefined };
  let data;
  try {
    data = await settings.updateSubmit(updates);
  } catch (error) {
    console.log(error);
    return settings.changeSubscriptionEnable();
  }
  // VALIDATE DATA
  if (data.status === "failed") {
    document.getElementById("settings-sub-error").innerHTML = data.content;
    return settings.changeSubscriptionEnable();
  }
  // SUCCESS HANDLER
  // Add a notification
  let message;
  if (subscription) {
    message = "Subscribed successfully";
    document.getElementById('settings-sub-status').innerHTML = 'Subscribed'
    document.getElementById('settings-sub-status').classList.toggle('settings-subbed')
    document.getElementById('settings-sub-status').classList.toggle('settings-not-subbed')
  } else {
    message = "Unsubscribed successfully";
    document.getElementById('settings-sub-status').innerHTML = 'Subscribe'
    document.getElementById('settings-sub-status').classList.toggle('settings-subbed')
    document.getElementById('settings-sub-status').classList.toggle('settings-not-subbed')
  }
  notification.popup(message);
  return settings.changeSubscriptionEnable();
}

// @func  settings.changeSubscriptionCollect
// @desc  
settings.changeSubscriptionCollect = () => {
  const subscription = document.querySelector("#settings-subscription-input").checked;

  return subscription;
}

// @func  settings.changeSubscriptionValidate
// @desc  
settings.changeSubscriptionValidate = (subscription) => {
  let valid = true;
  let error = "";
  // SUBSCRIPTION
  if (subscription === undefined) {
    valid = false;
    error = "Subscription required";
  }
  // SET ERROR
  document.getElementById("settings-sub-error").innerHTML = error;

  return valid;
}

// @func  settings.changeSubscriptionEnable
// @desc  
settings.changeSubscriptionEnable = () => {
  // LOADER
  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.add("hide");
  // TO DO .....
  // INPUT
  document.querySelector("#settings-subscription-input").removeAttribute("disabled");
}

// @func  settings.changeSubscriptionDisable
// @desc  
settings.changeSubscriptionDisable = () => {
  // LOADER
  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.remove("hide");
  // TO DO .....
  // INPUT
  document.querySelector("#settings-subscription-input").setAttribute("disabled", "");
}

/* ----------------------------------------------------------------------------------------
DELETE ACCOUNT
---------------------------------------------------------------------------------------- */

// @func  settings.deleteAccountConfirmation
// @desc  
settings.deleteAccountConfirmation = () => {
  document.getElementById('settings-delete-container').classList.toggle('settings-active')
  document.getElementById('settings-delete-message').classList.toggle('active')
  document.getElementById('settings-delete-error').innerHTML = ''
  return;
}

// @func  settings.deleteAccountCancel
// @desc  
settings.deleteAccountCancel = () => {
  document.getElementById('settings-delete-container').classList.toggle('settings-active')
  document.getElementById('settings-delete-error').innerHTML = ''
  return;
}

// @func  settings.deleteAccount
// @desc  
settings.deleteAccount = async () => {
  settings.deleteAccountDisable();
  // COLLECT INPUTS
  const password = settings.deleteAccountCollect();
  // VALIDATE INPUTS
  if (!settings.deleteAccountValidate(password)) return settings.deleteAccountEnable();
  // SUBMIT REQUEST
  let data;
  try {
    data = await settings.deleteAccountSubmit(password);
  } catch (error) {
    console.log(error);
    return settings.deleteAccountEnable();
  }
  // VALIDATE DATA
  if (data.status === "failed") {
    document.getElementById("settings-delete-error").innerHTML = data.content;
    return settings.deleteAccountEnable();
  }
  // SUCCESS HANDLER
  return window.location.href = "/logout";
}

// @func  settings.deleteAccountCollect
// @desc  
settings.deleteAccountCollect = () => {
  const password = document.querySelector("#confirm-removal-password").value;

  return password;
}

// @func  settings.deleteAccountValidate
// @desc  
settings.deleteAccountValidate = (password) => {
  let valid = true;
  let error = "";
  // PASSWORD
  if (!password) {
    valid = false;
    error = "Password required";
  } else if (!global.passwordValidity(password)) {
    valid = false;
    error = "Invalid password";
  }
  // SET ERROR
  document.getElementById("settings-delete-error").innerHTML = error;

  return valid;
}

// @func  settings.deleteAccountSubmit
// @desc  
settings.deleteAccountSubmit = (password) => {
  return new Promise(async (resolve, reject) => {
    // SEND REQUEST TO THE BACKEND
    let data;
    try {
      data = (await axios.post("/settings/delete-account", { password }))["data"];
    } catch (error) {
      return reject(error);
    }
    // RESOLVE PROMISE
    return resolve(data);
  });
}

// @func  settings.deleteAccountEnable
// @desc  
settings.deleteAccountEnable = () => {
  // LOADER
  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.add("hide");
  // TO DO .....
  // BUTTONS
  document.getElementById("settings-password-submit").removeAttribute("disabled");
  document.getElementById("settings-password-cancel").removeAttribute("disabled");
}

// @func  settings.deleteAccountDisable
// @desc  
settings.deleteAccountDisable = () => {
  // LOADER
  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.remove("hide");
  // TO DO .....
  // BUTTONS
  document.getElementById("settings-password-submit").setAttribute("disabled", "");
  document.getElementById("settings-password-cancel").setAttribute("disabled", "");
}

/* ========================================================================================
END
======================================================================================== */