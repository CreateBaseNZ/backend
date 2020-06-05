/* ========================================================================================
VARIABLES
======================================================================================== */

let settings = {
  changeEmail: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func    settings.changeEmail
// @desc    Sends the change email request to the backend
settings.changeEmail = (email) => {
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

/* ========================================================================================
END
======================================================================================== */