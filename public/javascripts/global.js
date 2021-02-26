let global = {
  init: {
    init: undefined,
  },

  compressImage: undefined,
  readImage: undefined,
  
  subscribe: undefined,
  textGlitch: undefined,
  validateEmail: undefined
}

// ==================================================================
// FUNCTIONS
// ==================================================================

global.init.init = () => {
  nav.init.init()
  if (document.querySelector('footer')) footer.init.init()
}

global.subscribe = (email) => {
  return new Promise(async (resolve, reject) => {
    // SUBMIT
    let data;
    try {
      data = (await axios.post("/notification/subscribe-email", { email }))["data"];
    } catch (error) {
      data = { status: "error", content: error };
    }
    if (data.status === "error") {
      notification.generate('subscribe', 'error')
      return reject();
    } else if (data.status === "failed") {
      notification.generate('subscribe', 'error')
      return reject();
    } else if (data.status === "succeeded") {
      if (data.content === "already") {
        notification.generate('subscribe', 'already')
      } else {
        notification.generate('subscribe', 'success')
      }
      return resolve();
    }
  });
}

global.textGlitch = (i, words, el) => {
  // Cycle through words
  el.innerHTML = words[i]
  el.setAttribute('data-text', words[i])
  setTimeout(function () {
    el.classList.remove("glitch")
    setTimeout(function () {
      el.classList.add("glitch")
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

global.validateEmail = (input) => {
  const emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (input === "") {
    return 'empty'
  } else if (!emailRE.test(String(input).toLowerCase())) {
    return 'invalid'
  } else {
    return 'valid'
  }
}

// ==================================================================
// VERSION 1
// ==================================================================

// @func  global.compressImage
// @desc  
global.compressImage = async (formId = "", name = "", compressSize = 300) => {
  // COLLECT IMAGES
  const formElement = document.getElementById(`${formId}`);
  let input = new FormData(formElement);
  // TEMPORARY TEST START
  for (let key of input.keys()) {
    const value = input.getAll(key);
    console.log(key);
    console.log(value);
  }
  // TEMPORARY TEST END
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
  // TEMPORARY TEST START
  for (let key of input.keys()) {
    const value = input.getAll(key);
    console.log(key);
    console.log(value);
  }
  // TEMPORARY TEST END
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

const updateSessionPage = () => {
  const url = window.location.href.toString();
  const urlArray = url.split("/"); // split url
  const page = "/" + urlArray.slice(3).join("/");
  window.sessionStorage.page = page;
}