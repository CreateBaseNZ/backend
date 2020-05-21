/*=========================================================================================
ASYNCHRONOUS IMAGE LOADER
=========================================================================================*/

const imageLoader = (objects, classes) => {
  return new Promise(async (resolve, reject) => {
    // INITIALISE AND DECLARE VARIABLES
    let promises = [];
    let images = [];
    // BUILD THE VARIABLES
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      let image = new Image();
      image.decoding = "async";
      image.src = object.src;
      if (classes) {
        image.classList.add(...classes);
      }
      promises.push(image.decode());
      images.push(image);
    }
    // PROMISE ALL
    try {
      await Promise.all(promises);
    } catch (error) {
      reject(error);
      return;
    }
    // INSERT IMAGES INTO PARENT DIV
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      const image = images[i];
      document.querySelector(`#${object.id}`).innerHTML = "";
      document.querySelector(`#${object.id}`).appendChild(image);
    }
    resolve();
  })
}

/*=========================================================================================
SUBSCRIBE/UNSUBSCRIBE FUNCTIONS
=========================================================================================*/

const subscribe = (input) => {
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
      dataTwo = (await axios.post("/subscribe/mailing-list", {email}))["data"];
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

const unsubscribe = (input) => {
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
      dataTwo = (await axios.post("/unsubscribe/mailing-list", {email}))["data"];
    } catch (error){
      return reject(error);
    }

    //Validate Data
    if(dataTwo.status === "failed") {
      return reject(dataTwo.content);
    }

    //Return Success
    return resolve(dataTwo.content)
  })
}

// const footerSubscribe = async () => {
//   // Fetch Email if user not login
//   let email = "";

//   // Loading animation

//   // Subscribe User
//   let data;
//   try {
//     data = await subscribe(email);
//   } catch (error) {
//     // Failed animation
//     return console.log(error);
//   }
//   // Success animation

//   return;
// }
/*=========================================================================================
Global notifs
=========================================================================================*/

function  subscribeNotif() {
  //Create div to insert
  let newDiv = document.createElement('div')
  newDiv.className = 'subbed-notif'
  let messageWrap = document.createElement('div')
  newDiv.appendChild(messageWrap).className = 'subMsgWrap'
  messageWrap.appendChild(document.createElement('i')).className = 'fab fa-telegram-plane'
  messageWrap.appendChild(document.createElement('p')).innerHTML = 'Thank you for subscribing to the newsletter!'

  //Find location to insert div
  let notifDiv = document.getElementById('notification-wrap')
  let cookieDiv = document.getElementById('cookie-container')

  //Insert div
  notifDiv.insertBefore(newDiv, cookieDiv.nextSibling)

  // Fade out
  setTimeout(() => {
      newDiv.style.transition = 'all 2s';
      newDiv.style.opacity = 0;
      // Hide
      setTimeout(() => {
          newDiv.style.display = 'none';
      }, 1000);
  }, 3000);
}

subscribe.listener = async () => {
  // Declare and initialise variables
  let input = document.getElementById('sign-up-eml');
  let subBtn = document.getElementById('subscribe-main');
  // Subscribe user
  try {
      await subscribe(input.value);
  } catch (error) {
      return console.log(error);
  }
  input.value = ''; // Clear email input field
  // Success Handler
  subBtn.innerHTML = 'SUBSCRIBE NEW EMAIL';
  subscribeNotif();
  return;
}

/*=========================================================================================
END
=========================================================================================*/