/* ========================================================================================
VARIABLES
======================================================================================== */

let orders = {
  initialise: undefined,
  errorHandler: undefined,
  // ORDERS
  fetchOrders: undefined,
  populateOrders: undefined,
  addOrder: undefined,
  addSummary: undefined,
  addDetailed: undefined,
  addMake: undefined,
  // COMMENT
  addComment: undefined,
  postComment: undefined,
  collectComment: undefined,
  submitComment: undefined,
  // VIEWER
  viewerFetch: undefined,
  viewerProcess: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  orders.initialise
// @desc  
orders.initialise = async () => {
  // FETCH ORDERS
  let fetchedOrders;
  try {
    fetchedOrders = await orders.fetchOrders();
  } catch (error) {
    return;
  }
  // POPULATE ORDERS
  orders.populateOrders(fetchedOrders);
  // SUCCESS HANDLER
  return;
}

// @func  orders.errorHandler
// @desc  
orders.errorHandler = (error) => {
  // TO DO .....
  // ERROR HANDLER
  // TO DO .....
  console.log(error); // TEMPORARY
  return;
}

/* ----------------------------------------------------------------------------------------
ORDERS
---------------------------------------------------------------------------------------- */

// @func  orders.fetchOrders
// @desc  
orders.fetchOrders = () => {
  return new Promise(async (resolve, reject) => {
    let data;
    try {
      data = (await axios.get("/orders/fetch-orders"))["data"];
    } catch (error) {
      data = { status: "error", content: error };
    }
    if (data.status === "error") {
      orders.errorHandler(data.content);
      return reject();
    } else if (data.status === "failed") {
      // TO DO .....
      // FAILED HANDLER
      // TO DO .....
      console.log(data.content);
      return reject();
    }
    return resolve(data.content);
  });
}

// @func  orders.populateOrders
// @desc  
orders.populateOrders = (fetchedOrders = []) => {
  if (!fetchedOrders.length) {
    // TO DO .....
    // EMPTY ORDERS HANDLER
    // TO DO .....
    return;
  }
  for (let i = 0; i < fetchedOrders.length; i++) {
    const order = fetchedOrders[i];
    orders.addOrder(order);
  }
  return;
}

// @func  orders.addOrder
// @desc  
orders.addOrder = (order) => {
  console.log(order); // TEMPORARY
  // TO DO .....
  // CREATE SUMMARY
  // CREATE EXPANDED
  // TO DO .....
  // POPULATE MAKES
  for (let i = 0; i < order.makes.checkout.length; i++) {
    const make = order.makes.checkout[i];
    orders.addMake(order._id, make);
  }
  // POPULATE COMMENTS
  for (let i = 0; i < order.comments.length; i++) {
    const comment = order.comments[i];
    orders.addComment(order._id, comment);
  }
  return;
}

// @func  orders.addMake
// @desc  
orders.addMake = (orderId, make) => {
  console.log(make); // TEMPORARY
  // TO DO .....
  // CREATE MAKE
  // TO DO .....
  return;
}

/* ----------------------------------------------------------------------------------------
COMMENT
---------------------------------------------------------------------------------------- */

// @func  orders.addComment
// @desc  
orders.addComment = (orderId, comment) => {
  console.log(comment); // TEMPORARY
  // TO DO .....
  // CREATE COMMENT
  // TO DO .....
  return;
}

// @func  orders.postComment
// @desc  
orders.postComment = async (orderId) => {
  // LOADER

  // COLLECT
  const form = orders.collectComment(orderId);
  // VALIDATE

  // SUBMIT
  let data;
  try {
    data = await orders.submitComment(form)
  } catch (error) {
    return orders.errorHandler(error);
  }
  if (data.status === "failed") {
    // TO DO .....
    // FAILED HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return;
  }
  // INSERT
  orders.addComment(orderId, data.content);
  // SUCCESS HANDLER
  // remove loader

}

// @func  orders.collectComment
// @desc  
orders.collectComment = (orderId) => {
  let comment;
  return comment;
}

// @func  orders.submitComment
// @desc  
orders.submitComment = (form) => {
  return new Promise(async (resolve, reject) => {
    let data;
    try {
      data = (await axios.post("/orders/post-comment", form))["data"];
    } catch (error) {
      return reject(error);
    }
    if (data.status === "error") return reject(data.content);
    return resolve(data);
  });
}

/* ----------------------------------------------------------------------------------------
VIEWER
---------------------------------------------------------------------------------------- */

// @func  orders.viewerFetch
// @desc  
orders.viewerFetch = async (url, id) => {
  var element = document.getElementById(id);

  var camera = new THREE.PerspectiveCamera(70, element.clientWidth / element.clientHeight, 1, 1000);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(element.clientWidth, element.clientHeight);
  element.appendChild(renderer.domElement);

  window.addEventListener('resize', function () {
    renderer.setSize(element.clientWidth, element.clientHeight);
    camera.aspect = element.clientWidth / element.clientHeight;
    camera.updateProjectionMatrix();
  }, false);

  var scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x787878, 0.8));

  const loader = new THREE.STLLoader();
  loader.load(url, (geometry) => {
    orders.viewerProcess(camera, renderer, scene, geometry);
  });
}

// @func  orders.viewerProcess
// @desc  
orders.viewerProcess = (camera, renderer, scene, geometry) => {
  var material = new THREE.MeshPhongMaterial({
    color: 0xf0f0f0, specular: 0xf8f8f8, shininess: 0, reflectivity: 0
  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  var middle = new THREE.Vector3();
  geometry.computeBoundingBox();
  geometry.boundingBox.getCenter(middle);
  mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
    -middle.x, -middle.y, -middle.z));
  mesh.geometry.rotateY(-Math.PI / 5);

  var largestDimension = Math.max(geometry.boundingBox.max.x,
    geometry.boundingBox.max.y, geometry.boundingBox.max.z);
  camera.position.z = largestDimension * 2.5;

  var animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();
}

/* ========================================================================================
END
======================================================================================== */