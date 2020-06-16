/*=========================================================================================
ASYNCHRONOUS IMAGE LOADER
=========================================================================================*/

const imageLoader = (objects) => {
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
      if (object.classes) {
        image.classList.add(...object.classes);
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
      image.id = object.id;
      image.alt = object.alt;
      document.querySelector(`#${object.parentId}`).insertAdjacentElement("afterbegin", image);
    }
    resolve();
  })
}

const checkLoginStatus = () => {
  return new Promise(async (resolve, reject) => {
    let data;
    try {
      data = (await axios.get("/login-status"))["data"];
    } catch (error) {
      return reject(error);
    }
    return resolve(data.status);
  })
}

/*=========================================================================================
SEND EMAIL
=========================================================================================*/

const sendEmail = async (email, subject, div, style) => {
  // LOADER
  console.log(`Sending an email to: ${email}`);
  // SEND EMAIL REQUEST
  let data;
  try {
    data = (await axios.post("/send-email", { email, subject, div, style }))["data"];
  } catch (error) {
    return console.log(error);
  }
  // ERROR HANDLER
  if (data.status === "failed") {
    return console.log(data.content);
  }
  // SUCCESS HANDLER
  return console.log("Email sent successfully");
};

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

const notificationPopup = (message) => {
  // Create div to insert
  let newDiv = document.createElement("div");
  newDiv.classList.add("subbed-notif");
  let messageWrap = document.createElement("div")
  newDiv.appendChild(messageWrap).classList.add("msg-wrap");
  messageWrap.appendChild(document.createElement('i')).className = 'fab fa-telegram-plane';
  messageWrap.appendChild(document.createElement('p')).innerHTML = message;
  // Find location to insert div
  let notifDiv = document.getElementById('notification-wrap')
  let mobileDiv = document.getElementById('mobile-notif-wrap')
  // Add slide in animation
  newDiv.classList.add("slide-in");
  //Insert div
  var mq = window.matchMedia("(min-width: 53em)");
  if (mq.matches) {
    notifDiv.appendChild(newDiv)
  }
  else {
    mobileDiv.appendChild(newDiv)
  }
  // Fade out
  setTimeout(() => {
    newDiv.style.transition = 'all 2s'
    newDiv.style.opacity = 0
    // Hide
    setTimeout(() => {
      newDiv.style.display = 'none'
    }, 1000)
  }, 3000)
}

function subscribeNotif() {
  // Create div to insert
  let newDiv = document.createElement('div')
  newDiv.className = 'subbed-notif'
  let messageWrap = document.createElement('div')
  newDiv.appendChild(messageWrap).className = 'msg-wrap'
  messageWrap.appendChild(document.createElement('i')).className = 'fab fa-telegram-plane'
  messageWrap.appendChild(document.createElement('p')).innerHTML = 'Thank you for subscribing to the newsletter!'
  // Find location to insert div
  let notifDiv = document.getElementById('notification-wrap');
  let mobileDiv = document.getElementById('mobile-notif-wrap');
  // Add slide in animation
  newDiv.classList.add("slide-in");
  // Insert div
  var mq = window.matchMedia("(min-width: 53em)");
  if (mq.matches) {
    notifDiv.appendChild(newDiv)
  }
  else {
    mobileDiv.appendChild(newDiv)
  }

  // Fade out
  setTimeout(() => {
    newDiv.style.transition = 'all 2s'
    newDiv.style.opacity = 0
    // Hide
    setTimeout(() => {
      newDiv.style.display = 'none'
    }, 1000)
  }, 3000)
}

function projectNotif(callback, status) {
  //Create div to insert
  let newDiv = document.createElement('div')
  newDiv.className = 'project-notif'
  let messageWrap = document.createElement('div')
  newDiv.appendChild(messageWrap).className = 'msg-wrap'
  if (callback === 'success') {
    if (status === 'new') {
      messageWrap.appendChild(document.createElement('i')).className = 'far fa-check-circle'
      messageWrap.appendChild(document.createElement('p')).innerHTML = 'Your new project has been saved.'
    } else if (status === 'edit') {
      messageWrap.appendChild(document.createElement('i')).className = 'far fa-edit'
      messageWrap.appendChild(document.createElement('p')).innerHTML = 'Your newest edits have been saved.'
    } else {
      messageWrap.appendChild(document.createElement('i')).className = 'far fa-trash-alt'
      messageWrap.appendChild(document.createElement('p')).innerHTML = 'Your project has been deleted.'
    }
  } else {
    messageWrap.appendChild(document.createElement('i')).className = 'far fa-times-circle'
    messageWrap.appendChild(document.createElement('p')).innerHTML = 'Oops! Something went wrong, please try again later.'
    newDiv.style.color = 'red'
  }

  //Find location to insert div
  let notifDiv = document.getElementById('notification-wrap')

  //Add slide in animation
  newDiv.classList.add("slide-in");

  //Insert div
  notifDiv.appendChild(newDiv)

  setTimeout(() => {
    // Fade out
    setTimeout(() => {
      newDiv.style.transition = 'all 2s'
      newDiv.style.opacity = 0
      // Hide
      setTimeout(() => {
        newDiv.style.display = 'none'
      }, 1000)
    }, 3000)
  }, 1000)
}

function alreadysubscribedNotif() {
  //Create div to insert
  let newDiv = document.createElement('div')
  newDiv.className = 'alreadysubbed-notif'
  let messageWrap = document.createElement('div')
  newDiv.appendChild(messageWrap).className = 'msg-wrap'
  messageWrap.appendChild(document.createElement('i')).className = 'far fa-times-circle'
  messageWrap.appendChild(document.createElement('p')).innerHTML = 'This email is already subscribed'

  //Find location to insert div
  let notifDiv = document.getElementById('notification-wrap')
  let mobileDiv = document.getElementById('mobile-notif-wrap')

  //Add slide in animation
  newDiv.classList.add("slide-in");

  //Insert div
  var mq = window.matchMedia("(min-width: 53em)");
  if (mq.matches) {
    notifDiv.appendChild(newDiv)
  }
  else {
    mobileDiv.insertAdjacentElement('afterbegin', newDiv)
  }

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
  let data;
  try {
    data = await subscribe(input.value);
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

const textSequence = (i, words, id) => {
  // Cycle through words
  document.getElementById(id).innerHTML = words[i]
  document.getElementById(id).setAttribute('data-text', words[i])
  setTimeout(function () {
    document.getElementById(id).classList.remove("glitch")
    setTimeout(function () {
      document.getElementById(id).classList.add("glitch")
      setTimeout(function () {
        i += 1
        if (i >= words.length) {
          i = 0
        }
        textSequence(i, words, id);
      }, (100 + Math.random() * 100))
    }, (500 + Math.random() * 1500))
  }, (50 + Math.random() * 50))
}

const removeLoader = () => {
  document.querySelector(".full-page-loading").classList.add("hide");
  document.querySelector("nav").classList.remove("hide");
  document.querySelector("#mobile-notif-wrap").classList.remove("hide");
  document.querySelector("#notification-wrap").classList.remove("hide");
  document.querySelector(".main-page").classList.remove("hide");
  document.querySelector(".footer-section").classList.remove("hide");
}

/*=========================================================================================
END
=========================================================================================*/