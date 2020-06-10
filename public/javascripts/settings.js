/* ========================================================================================
VARIABLES
======================================================================================== */

let settings = {
  initialise: undefined,
  fetchCustomerDetails: undefined,
  updateSubmit: undefined,
  // EMAIL SECTION
  populateEmail: undefined,
  changeEmail: undefined,
  changeEmailCollect: undefined,
  changeEmailValidate: undefined,
  changeEmailSubmit: undefined,
  // ADDRESS SECTION
  populateAddress: undefined,
  changeAddress: undefined,
  changeAddressCollect: undefined,
  changeAddressValidate: undefined,
  // PASSWORD SECTION
  changePassword: undefined,
  changePasswordValidate: undefined,
  changePasswordSubmit: undefined
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
  // Address
  settings.populateAddress(details.customer.address);
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

// @func  settings.populateEmail
// @desc  

settings.populateEmail = (email) => {
  // TO DO .....
  // Assign ID of the email display element
  document.querySelector("#").innerHTML = email;
  // TO DO .....

  // TO DO .....
  // Assign ID of the email loader element
  document.querySelector("#").classList.add("hide");
  // TO DO .....
  return;
};

// @func  settings.changeEmail
// @desc  Initiate the Change Email
settings.changeEmail = async () => {
  // TO DO .....
  // Assign ID of the email loader element
  document.querySelector("#").classList.remove("hide");
  // TO DO .....
  // COLLECT INPUTS
  const [email, password] = settings.changeEmailCollect();
  // VALIDATE INPUTS
  if (!settings.changeEmailValidate(email, password)) {
    // TO DO .....
    // Assign ID of the email loader element
    return document.querySelector("#").classList.add("hide");
    // TO DO .....
  };
  // SUBMIT REQUEST
  let data;
  try {
    data = await settings.changeEmailSubmit(email, password);
  } catch (error) {
    // TO DO .....
    // Assign ID of the email loader element
    document.querySelector("#").classList.add("hide");
    // TO DO .....
    return console.log(error);
  }
  // VALIDATE DATA
  if (data.status === "failed") {
    // TO DO .....
    // Assign the email error ID
    document.querySelector("#").innerHTML = data.content;
    // TO DO .....
    // TO DO .....
    // Assign ID of the email loader element
    return document.querySelector("#").classList.add("hide");
    // TO DO .....
  }
  // TO DO .....
  // SUCCESS HANDLER
  // Add a notification
  // TO DO .....
  // TO DO .....
  // Assign ID of the email loader element
  return document.querySelector("#").classList.add("hide");
  // TO DO .....
}

// @func  settings.changeEmailCollect
// @desc  
settings.changeEmailCollect = () => {
  // TO DO .....
  // Assign the email input ID
  const email = document.querySelector("#").value;
  // TO DO .....

  // TO DO .....
  // Assign the email password input ID
  const password = document.querySelector("#").value;
  // TO DO .....

  return [email, password];
}

// @func  settings.changeEmailValidate
// @desc  
settings.changeEmailValidate = (email, password) => {
  let valid = true;
  let error = "";
  // EMAIL
  if (!email) {
    valid = false;
    error = "email required";
  }
  // PASSWORD
  if (!password) {
    valid = false;
    error = "password required";
  }
  // SET ERROR
  // TO DO .....
  // Assign the email error ID
  document.querySelector("#").innerHTML = error;
  // TO DO .....
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

/* ----------------------------------------------------------------------------------------
ADDRESS
---------------------------------------------------------------------------------------- */

// @func  settings.populateAddress
// @desc  
settings.populateAddress = (address) => {
  // TO DO .....
  // Assign IDs of the address display elements
  document.querySelector("#").value = address.unit;
  document.querySelector("#").value = address.street.number;
  document.querySelector("#").value = address.street.name;
  document.querySelector("#").value = address.suburb;
  document.querySelector("#").value = address.city;
  document.querySelector("#").value = address.postcode;
  document.querySelector("#").value = address.country;
  // TO DO .....

  // TO DO .....
  // Assign ID of the address loader element
  document.querySelector("#").classList.add("hide");
  // TO DO .....
  return;
};

// @func  settings.changeAddress
// @desc  
settings.changeAddress = async () => {
  // TO DO .....
  // Assign ID of the address loader element
  document.querySelector("#").classList.remove("hide");
  // TO DO .....
  // COLLECT INPUTS
  const address = settings.changeAddressCollect();
  // VALIDATE INPUTS
  if (!settings.changeAddressValidate(address)) {
    // TO DO .....
    // Assign ID of the email loader element
    return document.querySelector("#").classList.add("hide");
    // TO DO .....
  };
  // SUBMIT REQUEST
  let data;
  try {
    data = await settings.updateSubmit({ address });
  } catch (error) {
    // TO DO .....
    // Assign ID of the email loader element
    document.querySelector("#").classList.add("hide");
    // TO DO .....
    return console.log(error);
  }
  // VALIDATE DATA
  if (data.status === "failed") {
    // TO DO .....
    // Assign the email error ID
    document.querySelector("#").innerHTML = data.content;
    // TO DO .....
    // TO DO .....
    // Assign ID of the email loader element
    return document.querySelector("#").classList.add("hide");
    // TO DO .....
  }
  // TO DO .....
  // SUCCESS HANDLER
  // Add a notification
  // TO DO .....
  // TO DO .....
  // Assign ID of the email loader element
  return document.querySelector("#").classList.add("hide");
  // TO DO .....
}

// @func  settings.changeAddressCollect
// @desc  
settings.changeAddressCollect = () => {
  // TO DO .....
  // Assign IDs of the address display elements
  const address = {
    unit: document.querySelector("#").value,
    street: {
      number: document.querySelector("#").value,
      name: document.querySelector("#").value
    },
    suburb: document.querySelector("#").value,
    city: document.querySelector("#").value,
    postcode: document.querySelector("#").value,
    country: document.querySelector("#").value
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
    valid = false;
    error = "country required";
  }
  // SET ERROR
  // TO DO .....
  // Assign the email error ID
  document.querySelector("#").innerHTML = error;
  // TO DO .....
  return valid;
}

/* ----------------------------------------------------------------------------------------
PASSWORD
---------------------------------------------------------------------------------------- */

// @func  settings.changePassword
// @desc  Initiate the Change Password
settings.changePassword = async () => {
  // TO DO .....
  // LOADER
  // COLLECT INPUTS
  // VALIDATE INPUTS
  // TO DO .....
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
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    return console.log(data.content);
  }
  // TO DO .....
  // SUCCESS HANDLER
  // TO DO .....
  return;
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

/* ========================================================================================
END
======================================================================================== */