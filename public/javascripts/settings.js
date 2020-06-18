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
  console.log(details); // TEMPORARY
  // Email
  settings.populateEmail(details.account.email);
  // Address
  settings.populateAddress(details.customer.address);
  // Subscription
  settings.populateSubscription(details.customer.subscription.mail);
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
  document.querySelector("#settings-edit-email").classList.toggle("hide");
  document.querySelector("#newEmail-container").classList.toggle("hide");
  document.querySelector("#emailPassword-container").classList.toggle("hide");
  document.querySelector("#email-error").classList.toggle("hide");
  document.querySelector("#email-btn-group-email").classList.toggle("hide");
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
    document.querySelector("#email-error").innerHTML = "failed";
    settings.changeEmailEnable();
    return console.log(error);
  }
  // VALIDATE DATA
  if (data.status === "failed") {
    document.querySelector("#email-error").innerHTML = data.content;
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
  // PASSWORD
  if (!password) {
    valid = false;
    error = "password required";
  }
  // EMAIL
  if (!email) {
    valid = false;
    error = "email required";
  }
  // SET ERROR
  document.querySelector("#email-error").innerHTML = error;
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
  // INPUTS
  document.querySelector("#newEmail").removeAttribute("disabled");
  document.querySelector("#emailPassword").removeAttribute("disabled");
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
  // INPUTS
  document.querySelector("#newEmail").setAttribute("disabled", "");
  document.querySelector("#emailPassword").setAttribute("disabled", "");
}

/* ----------------------------------------------------------------------------------------
ADDRESS
---------------------------------------------------------------------------------------- */

// @func  settings.editAddress
// @desc  
settings.editAddress = () => {
  document.querySelector("#settings-edit-address").classList.toggle("hide");
  document.querySelector("#address-error").classList.toggle("hide");
  document.querySelector("#settings-btn-group-address").classList.toggle("hide");
  // CONTAINER
  document.querySelector("#address-field-name").classList.toggle("current");
  document.querySelector("#address-field-unit").classList.toggle("current");
  document.querySelector("#address-field-street-number").classList.toggle("current");
  document.querySelector("#address-field-street-name").classList.toggle("current");
  document.querySelector("#address-field-suburb").classList.toggle("current");
  document.querySelector("#address-field-city").classList.toggle("current");
  document.querySelector("#address-field-postcode").classList.toggle("current");
  document.querySelector("#address-field-country").classList.toggle("current");
  // LABEL
  document.querySelector("#address-label-name").classList.toggle("hide");
  document.querySelector("#address-label-unit").classList.toggle("hide");
  document.querySelector("#address-label-street-number").classList.toggle("hide");
  document.querySelector("#address-label-street-name").classList.toggle("hide");
  document.querySelector("#address-label-suburb").classList.toggle("hide");
  document.querySelector("#address-label-city").classList.toggle("hide");
  document.querySelector("#address-label-postcode").classList.toggle("hide");
  document.querySelector("#address-label-country").classList.toggle("hide");
  // INPUT
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
  // LOADER
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
    document.querySelector("#address-error").innerHTML = data.content;
    return settings.changeAddressEnable();
  }
  // SUCCESS HANDLER
  // Add a notification
  notificationPopup("Address Updated");
  // Toggle Edit Mode
  settings.changeAddressEnable();
  return settings.editAddress();
}

// @func  settings.changeAddressCollect
// @desc  
settings.changeAddressCollect = () => {
  // TO DO .....
  // Assign IDs of the address display elements
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
  // TO DO .....
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
    error = "street number required";
  }
  // STREET NAME
  if (!address.street.name) {
    valid = false;
    error = "street name required";
  }
  // SUBURB
  if (!address.suburb) {
    valid = false;
    error = "suburb required";
  }
  // CITY
  if (!address.city) {
    valid = false;
    error = "city required";
  }
  // POSTCODE
  if (!address.postcode) {
    valid = false;
    error = "postcode required";
  }
  // COUNTRY
  if (!address.country) {
    valid = true;
    error = "";
  }
  // SET ERROR
  // TO DO .....
  // Assign the email error ID
  document.querySelector("#address-error").innerHTML = error;
  // TO DO .....
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
  // INPUTS
  document.querySelector("#addressName").removeAttribute("disabled");
  document.querySelector("#addressUnit").removeAttribute("disabled");
  document.querySelector("#streetNum").removeAttribute("disabled");
  document.querySelector("#streetName").removeAttribute("disabled");
  document.querySelector("#addressSuburb").removeAttribute("disabled");
  document.querySelector("#addressCity").removeAttribute("disabled");
  document.querySelector("#postCode").removeAttribute("disabled");
  document.querySelector("#addressCountry").removeAttribute("disabled");
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
  // INPUTS
  document.querySelector("#addressName").setAttribute("disabled", "");
  document.querySelector("#addressUnit").setAttribute("disabled", "");
  document.querySelector("#streetNum").setAttribute("disabled", "");
  document.querySelector("#streetName").setAttribute("disabled", "");
  document.querySelector("#addressSuburb").setAttribute("disabled", "");
  document.querySelector("#addressCity").setAttribute("disabled", "");
  document.querySelector("#postCode").setAttribute("disabled", "");
  document.querySelector("#addressCountry").setAttribute("disabled", "");
}

/* ----------------------------------------------------------------------------------------
PASSWORD
---------------------------------------------------------------------------------------- */

// @func  settings.editPassword
// @desc  
settings.editPassword = () => {
  document.querySelector("#settings-edit-password").classList.toggle("hide");
  document.querySelector("#password-error").classList.toggle("hide");
  document.querySelector("#settings-btn-group-password").classList.toggle("hide");
  document.querySelector("#password-item-wrap").classList.toggle("hide");
  return;
}

// @func  settings.changePassword
// @desc  Initiate the Change Password
settings.changePassword = async () => {
  // LOADER
  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.remove("hide");
  // TO DO .....
  // COLLECT INPUTS
  const [newPassword, newPasswordConfirm, password] = settings.changePasswordCollect();
  // VALIDATE INPUTS
  if (!settings.changePasswordValidate(newPassword, newPasswordConfirm, password)) {
    // TO DO .....
    // Assign ID of the email loader element
    // return document.querySelector("#").classList.add("hide");
    // TO DO .....
    return;
  };
  // SUBMIT REQUEST
  let data;
  try {
    data = await settings.changePasswordSubmit(newPassword, password);
  } catch (error) {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    return console.log(error);
  }
  // VALIDATE DATA
  if (data.status === "failed") {
    document.querySelector("#password-error").innerHTML = data.content
    // TO DO .....
    // Assign ID of the address loader element
    // return document.querySelector("#").classList.add("hide");
    // TO DO .....
    return;
  }
  // SUCCESS HANDLER
  // Add a notification
  notificationPopup("Password Updated");
  // Toggle Edit Mode
  settings.editPassword();
  // Clear Input Fields
  settings.changePasswordClear();
  // TO DO .....
  // TO DO .....
  // Assign ID of the email loader element
  // return document.querySelector("#").classList.add("hide");
  // TO DO .....
  return;
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
    error = "confirm new password required";
  }
  // NEW PASSWORD
  if (!newPassword) {
    valid = false;
    error = "new password required";
  }
  // PASSWORD MATCH
  if (newPassword !== newPasswordConfirm) {
    valid = false;
    error = "new password does not match";
  }
  // PASSWORD
  if (!password) {
    valid = false;
    error = "password required";
  }
  // SET ERROR
  document.querySelector("#password-error").innerHTML = error;

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
}

// @func  settings.changePasswordDisable
// @desc  
settings.changePasswordDisable = () => {
  // LOADER
  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.remove("hide");
  // TO DO .....
}

/* ----------------------------------------------------------------------------------------
SUBSCRIPTION
---------------------------------------------------------------------------------------- */

// @func  settings.populateSubscription
// @desc  
settings.populateSubscription = (subscription) => {
  document.querySelector("#settings-subscription-input").checked = subscription;

  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.add("hide");
  // TO DO .....
  return;
}

// @func  settings.changeSubscription
// @desc  
settings.changeSubscription = async () => {
  // LOADER
  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.remove("hide");
  // TO DO .....
  // COLLECT INPUTS
  const subscription = settings.changeSubscriptionCollect();
  // VALIDATE INPUTS
  if (!settings.changeSubscriptionValidate(subscription)) {
    // TO DO .....
    // Assign ID of the email loader element
    // document.querySelector("#").classList.add("hide");
    // TO DO .....
    return;
  };
  // SUBMIT REQUEST
  const updates = { subscription: { mail: subscription }, address: undefined };
  let data;
  try {
    data = await settings.updateSubmit(updates);
  } catch (error) {
    // TO DO .....
    // Assign ID of the email loader element
    // document.querySelector("#").classList.add("hide");
    // TO DO .....
    return console.log(error);
  }
  // VALIDATE DATA
  if (data.status === "failed") {
    document.querySelector("#subscription-error").innerHTML = data.content;

    // TO DO .....
    // Assign ID of the email loader element
    // return document.querySelector("#").classList.add("hide");
    // TO DO .....
    return;
  }
  // SUCCESS HANDLER
  // Add a notification
  let message;
  if (subscription) {
    message = "subscribed successfully";
  } else {
    message = "unsubscribed successfully";
  }
  notificationPopup(message);
  // TO DO .....
  // Assign ID of the email loader element
  // return document.querySelector("#").classList.add("hide");
  // TO DO .....
  return;
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
    error = "subscription required";
  }
  // SET ERROR
  document.querySelector("#subscription-error").innerHTML = error;

  return valid;
}

// @func  settings.changeSubscriptionEnable
// @desc  
settings.changeSubscriptionEnable = () => {

}

// @func  settings.changeSubscriptionDisable
// @desc  
settings.changeSubscriptionDisable = () => {

}

/* ----------------------------------------------------------------------------------------
DELETE ACCOUNT
---------------------------------------------------------------------------------------- */

// @func  settings.deleteAccountConfirmation
// @desc  
settings.deleteAccountConfirmation = () => {
  document.querySelector("#settings-delete-account-password-container").classList.toggle("hide");
  document.querySelector("#delete-account-error").classList.toggle("hide");
  document.querySelector("#settings-btn-group-account").classList.toggle("hide");
  return;
}

// @func  settings.deleteAccountCancel
// @desc  
settings.deleteAccountCancel = () => {
  document.querySelector("#settings-delete-account-password-container").classList.toggle("hide");
  document.querySelector("#delete-account-error").classList.toggle("hide");
  document.querySelector("#settings-btn-group-account").classList.toggle("hide");
  document.querySelector("#settings-delete-account-input").checked = false;
  return;
}

// @func  settings.deleteAccount
// @desc  
settings.deleteAccount = async () => {
  // LOADER
  // TO DO .....
  // Assign ID of the address loader element
  // document.querySelector("#").classList.remove("hide");
  // TO DO .....
  // COLLECT INPUTS
  const password = settings.deleteAccountCollect();
  // VALIDATE INPUTS
  if (!settings.deleteAccountValidate(password)) {
    // TO DO .....
    // Assign ID of the email loader element
    // return document.querySelector("#").classList.add("hide");
    // TO DO .....
    return;
  };
  // SUBMIT REQUEST
  let data;
  try {
    data = await settings.deleteAccountSubmit(password);
  } catch (error) {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    return console.log(error);
  }
  // VALIDATE DATA
  if (data.status === "failed") {
    document.querySelector("#delete-account-error").innerHTML = data.content;

    return console.log(data.content);
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
    error = "password required";
  }
  // SET ERROR
  document.querySelector("#delete-account-error").innerHTML = error;

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

}

// @func  settings.deleteAccountDisable
// @desc  
settings.deleteAccountDisable = () => {

}

/* ========================================================================================
END
======================================================================================== */