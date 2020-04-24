/*=========================================================================================
VARIABLES
=========================================================================================*/

let session = {
  initialise: undefined,
  create: undefined,
  save: undefined,
  unsave: undefined,
  status: undefined,
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
  if (sessionStatus !== "unset") {
    return;
  }
  // Cookies Popup
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

/*=========================================================================================
END
=========================================================================================*/
