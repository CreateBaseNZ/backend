/*=========================================================================================
VARIABLES
=========================================================================================*/

let session = {
  initialise: undefined,
  create: undefined,
  save: undefined,
  unsave: undefined,
  status: undefined,
  cancel: undefined,
  show: undefined,
  allow: undefined
};

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

session.initialise = async () => {
  // Create the session
  try {
    await session.create();
  } catch (error) {
    console.log(error);
    return;
  }
  // Check session's status
  let sessionStatus;
  try {
    sessionStatus = await session.status();
  } catch (error) {
    console.log(error);
    return;
  }
  console.log(sessionStatus);
  if (sessionStatus !== "unset") {
    return;
  }
  // Cookies Popup
  session.show();
  return;
};

session.create = () => {
  return new Promise(async (resolve, reject) => {
    // Send the create request
    let data;
    try {
      data = (await axios.get("/session/create"))["data"];
    } catch (error) {
      reject(error);
      return;
    }
    if (data.status === "failed") {
      reject(data.content);
      return;
    }
    resolve(data.content);
    return;
  });
};

session.save = () => {
  return new Promise(async (resolve, reject) => {
    // Send the save request
    let data;
    try {
      data = (await axios.get("/session/save"))["data"];
    } catch (error) {
      reject(error);
      return;
    }
    if (data.status === "failed") {
      reject(data.content);
      return;
    }
    resolve(data.content);
    return;
  });
};

session.unsave = () => {
  return new Promise(async (resolve, reject) => {
    // Send the unsave request
    let data;
    try {
      data = (await axios.get("/session/unsave"))["data"];
    } catch (error) {
      reject(error);
      return;
    }
    if (data.status === "failed") {
      reject(data.content);
      return;
    }
    resolve(data.content);
    return;
  });
};

session.status = () => {
  return new Promise(async (resolve, reject) => {
    // Send the request to obtain session status
    let data;
    try {
      data = (await axios.get("/session/status"))["data"];
    } catch (error) {
      reject(error);
      return;
    }
    if (data.status === "failed") {
      reject(data.content);
      return;
    }
    resolve(data.content);
    return;
  });
};

session.cancel = async () => {
  document.querySelector('#cookie-container').classList.add("hide");
  // Update backend of Cookie Status
  let data;
  try {
    data = await session.unsave();
  } catch (error) {
    console.log(error);
    return;
  }
  console.log(data);
  return;
}

session.show = () => {
  document.querySelector('#cookie-container').classList.remove("hide");
  return;
}

session.allow = async () => {
  document.querySelector('#cookie-container').classList.add("hide");
  // Update backend of Cookie Status
  let data;
  try {
    data = await session.save();
  } catch (error) {
    console.log(error);
    return;
  }
  console.log(data);
  return;
}

/* ========================================================================================
END
======================================================================================== */
