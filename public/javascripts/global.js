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
END
=========================================================================================*/