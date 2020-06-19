/* ========================================================================================
VARIABLES
======================================================================================== */

let mail = {
  subscribe: undefined,
  unsubscribe: undefined,
  subscribeSubmit: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

mail.subscribe = (input) => {
  return new Promise(async (resolve, reject) => {
    // Validate if user is online
    let dataOne;
    try {
      dataOne = (await axios.get("/login-status"))["data"];
    } catch (error) {
      return reject(error);
    }
    // Validate if email is provided
    let email = "";
    if (!dataOne.status) {
      if (!input) {
        return reject("no email provided");
      } else {
        email = input;
      }
    }
    // Send the subscription request to backend
    let dataTwo;
    try {
      dataTwo = (await axios.post("/subscribe/mailing-list", { email }))["data"];
    } catch (error) {
      return reject(error);
    }
    // Validate Data
    if (dataTwo.status === "failed") {
      return reject(dataTwo.content);
    }
    // Return Success
    return resolve(dataTwo.content);
  })
}

mail.unsubscribe = (input) => {
  return new Promise(async (resolve, reject) => {
    //Validate user is logged in
    let dataOne;
    try {
      dataOne = (await axios.get("/login-status"))["data"];
    } catch (error) {
      return reject(error);
    }

    // Validate if email is provided
    let email = "";
    if (!dataOne.status) {
      if (!input) {
        return reject("no email provided");
      } else {
        email = input;
      }
    }

    //Send unsubscribe request to backend
    let dataTwo;
    try {
      dataTwo = (await axios.post("/unsubscribe/mailing-list", { email }))["data"];
    } catch (error) {
      return reject(error);
    }

    //Validate Data
    if (dataTwo.status === "failed") {
      return reject(dataTwo.content);
    }

    //Return Success
    return resolve(dataTwo.content)
  })
}


mail.subscribeSubmit = async () => {
  // Declare and initialise variables
  let input = document.getElementById('sign-up-eml');
  let subBtn = document.getElementById('subscribe-main');
  // Subscribe user
  let data;
  try {
    data = await mail.subscribe(input.value);
  } catch (error) {
    return console.log(error);
  }
  if (data === "already subscribed") {
    // Success Handler
    subBtn.innerHTML = 'SUBSCRIBE NEW EMAIL';
    alreadysubscribedNotif();
    return;
  } else if (data === "subscribed") {
    input.value = ''; // Clear email input field
    // Success Handler
    subBtn.innerHTML = 'SUBSCRIBE NEW EMAIL';
    subscribeNotif();
    return;
  }
}

/* ========================================================================================
END
======================================================================================== */