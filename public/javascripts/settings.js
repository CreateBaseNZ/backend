/* ========================================================================================
VARIABLES
======================================================================================== */

let settings = {
  changeEmail: undefined,
  changeEmailCollect: undefined,
  changeEmailValidate: undefined,
  changeEmailSubmit: undefined,
  changePassword: undefined,
  changePasswordCollect: undefined,
  changePasswordValidate: undefined,
  changePasswordSubmit: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  settings.changeEmail
// @desc  Initiate the Change Email
settings.changeEmail = () => {
  // TO DO .....
  // LOADER
  // COLLECT INPUTS
  // VALIDATE INPUTS
  // TO DO .....
  // SUBMIT REQUEST
  let data;
  try {
    data = await settings.changeEmailSubmit(email);
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

// @func  settings.changeEmailSubmit
// @desc  Sends the change email request to the backend
settings.changeEmailSubmit = (email) => {
  return new Promise(async (resolve, reject) => {
    // SEND REQUEST TO THE BACKEND
    let data;
    try {
      data = (await axios.post("/settings/change-email", email))["data"];
    } catch (error) {
      return reject(error);
    }
    // RESOLVE PROMISE
    return resolve(data);
  })
}

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
    data = await settings.changePasswordSubmit(password);
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
settings.changePasswordSubmit = (password) => {
  return new Promise(async (resolve, reject) => {
    // SEND REQUEST TO THE BACKEND
    let data;
    try {
      data = (await axios.post("/settings/change-password", password))["data"];
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