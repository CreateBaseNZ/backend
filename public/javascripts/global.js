/* ========================================================================================
VARIABLES
======================================================================================== */

let global = {
  initialise: undefined,
  passwordValidity: undefined,
  priceFormatter: undefined,
  compressImage: undefined,
  readImage: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

global.initialise = (userMenu = true, footerPresent = true, login = undefined) => {
  return new Promise(async (resolve, reject) => {
    if (login === undefined) {
      // FETCH LOGIN STATUS
      let data;
      try {
        data = (await axios.get("/login-status"))["data"];
      } catch (error) {
        reject(error);
      }
      login = data.status;
    }
    // NAVIGATION
    try {
      await navigation.initialise(login, userMenu);
    } catch (error) {
      reject(error);
    }
    // FOOTER
    if (footerPresent) footer.initialise(login);
    // SUCCESS
    resolve();
  });
}

// @func  global.passwordValidity
// @desc  
global.passwordValidity = (password) => {
  var score = 0;
  // Award every unique letter until 5 repetitions
  var letters = new Object();
  for (var i = 0; i < password.length; i++) {
    letters[password[i]] = (letters[password[i]] || 0) + 1;
    score += 5.0 / letters[password[i]];
  }
  // Bonus points for mixing it up
  var variations = {
    digits: /\d/.test(password),
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    nonWords: /\W/.test(password),
  }

  variationCount = 0;
  for (var check in variations) {
    variationCount += (variations[check] == true) ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  if (score > 40) {
    return true
  } else {
    return false
  }
}

// @func  global.priceFormatter
// @desc  
global.priceFormatter = value => {
  const roundedValue = (Math.round(Number(value) * 100)) / 100;
  const stringValue = String(roundedValue);
  // Evaluate the number of decimal places
  const pointIndex = stringValue.indexOf(".");
  const stringLength = stringValue.length;
  let formattedValue;
  if (pointIndex === -1) {
    formattedValue = stringValue + ".00";
  } else if ((stringLength - pointIndex) === 2) {
    formattedValue = stringValue + "0";
  } else if ((stringLength - pointIndex) === 3) {
    formattedValue = stringValue;
  }
  return formattedValue;
}

// @func  global.compressImage
// @desc  
global.compressImage = async (formId = "", name = "", compressSize = 300) => {
  // COLLECT IMAGES
  const formElement = document.getElementById(`${formId}`);
  let input = new FormData(formElement);
  const files = input.getAll(name);
  // COMPRESS IMAGES
  let newFiles = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let canvas = await global.readImage(file, compressSize);
    let blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.92);
    });
    let newFile = new File([blob], file.name, {
      type: "image/jpeg", lastModified: Date.now()
    });
    newFiles.push(newFile);
  }
  input.set(name, newFiles[0]);
  return input;
}

// @func  global.readImage
// @desc  
global.readImage = async (file, compressSize) => {
  let canvas = document.createElement("canvas");
  let img = document.createElement("img");

  // create img element from File object
  img.src = await new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => resolve(event.target.result);
  });

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // set height and width
  let height;
  let width;
  let scaleFactor;
  if (img.height >= img.width && img.height > compressSize) {
    scaleFactor = compressSize / img.height;
    height = compressSize;
    width = img.width * scaleFactor;
  } else if (img.height < img.width && img.width > compressSize) {
    scaleFactor = compressSize / img.width;
    width = compressSize;
    height = img.height * scaleFactor;
  } else {
    width = img.width;
    height = img.height;
  }

  // draw image in canvas
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(img, 0, 0, width, height);

  return canvas;
}

/* ----------------------------------------------------------------------------------------
ASYNCHRONOUS IMAGE LOADER
---------------------------------------------------------------------------------------- */

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
Global notifs
=========================================================================================*/

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
  if (callback === 'succeeded') {
    if (status === 'new') {
      messageWrap.appendChild(document.createElement('i')).className = 'far fa-check-circle'
      messageWrap.appendChild(document.createElement('p')).innerHTML = 'Your new project has been added.'
    } else if (status === 'edit') {
      messageWrap.appendChild(document.createElement('i')).className = 'far fa-edit'
      messageWrap.appendChild(document.createElement('p')).innerHTML = 'Your changes have been saved.'
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

const removeLoader = (footer = true) => {
  document.querySelector(".full-page-loading").classList.add("hide");
  document.querySelector("nav").classList.remove("hide");
  document.querySelector("#mobile-notif-wrap").classList.remove("hide");
  document.querySelector("#notification-wrap").classList.remove("hide");
  document.querySelector(".main-page").classList.remove("hide");
  if (footer) document.querySelector(".footer-section").classList.remove("hide");
  return;
}

const showLoader = (footer = true) => {
  document.querySelector(".full-page-loading").classList.remove("hide");
  document.querySelector("nav").classList.add("hide");
  document.querySelector("#mobile-notif-wrap").classList.add("hide");
  document.querySelector("#notification-wrap").classList.add("hide");
  document.querySelector(".main-page").classList.add("hide");
  if (footer) document.querySelector(".footer-section").classList.add("hide");
  return;
}

const priceNormaliser = price => Math.round(price * 100) / 100;

function passTab(el) {
  var tab = el.getAttribute("data-tab");
  localStorage.setItem("tab", tab);
}

const updateSessionPage = () => {
  const url = window.location.href.toString();
  const urlArray = url.split("/"); // split url
  const page = "/" + urlArray.slice(3).join("/");
  window.sessionStorage.page = page;
}

/*=========================================================================================
END
=========================================================================================*/