/* ========================================================================================
VARIABLES
======================================================================================== */

let orders = {
  // VARIABLES
  selectedOrder: undefined,
  // FUNCTIONS
  initialise: undefined,
  errorHandler: undefined,
  formatDate: undefined,
  // ORDERS
  selectOrder: undefined,
  deselectOrder: undefined,
  fetchOrders: undefined,
  populateOrders: undefined,
  addOrder: undefined,
  addSummary: undefined,
  addDetailed: undefined,
  createTracking: undefined,
  createSummary: undefined,
  createComments: undefined,
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

// @func  orders.formatDate
// @desc  
orders.formatDate = (date) => {
  const day = moment(date).format("DD")
  const month = moment(date).format("MMM");
  const year = moment(date).format("YYYY");
  return (`${day} ${month} ${year}`);
}

/* ----------------------------------------------------------------------------------------
ORDERS
---------------------------------------------------------------------------------------- */

// @func  orders.selectOrder
// @desc  
orders.selectOrder = (orderId) => {
  if (orders.selectedOrder === orderId) return;
  // UPDATE CSS
  if (orders.selectedOrder) orders.deselectOrder(orders.selectedOrder);
  document.querySelector(`#order-summary-${orderId}`).classList.add("active-item");
  orders.selectedOrder = orderId; // UPDATE SELECTED ORDER
}

// @func  orders.deselectOrder
// @desc  
orders.deselectOrder = (orderId) => {
  document.querySelector(`#order-summary-${orderId}`).classList.remove("active-item");
  orders.selectedOrder = undefined; // UPDATE SELECTED ORDER
}

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
  // CREATE SUMMARY
  orders.addSummary(order);
  // CREATE EXPANDED
  orders.addDetailed(order);
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

// @func  orders.addSummary
// @desc  
orders.addSummary = (order) => {
  // CONTAINER ONE
  const orderNumber = `<p class="order-name">Order #${order.number}</p>`;
  let notification = `<div id="order-summary-notification-${order._id}"></div>`; // TEMPORARY NO NOTIFICATION
  const logo = `
  <div class="expand-logo">
    <?xml version="1.0" encoding="utf-8"?>
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 300 300" style="enable-background:new 0 0 300 300;" xml:space="preserve">
      <rect x="145.9" y="-29.7" transform="matrix(-5.439820e-011 -1 1 -5.439820e-011 120.3603 196.6731)" width="25.3" height="135.8" />
      <rect x="201.1" y="42.9" width="25.3" height="135.8" />
      <rect x="133.2" y="190.3" transform="matrix(1.442240e-010 1 -1 1.442240e-010 404.0674 112.3467)" width="25.3" height="135.8" />
      <rect x="78" y="122.4" transform="matrix(-1 1.891366e-010 -1.891366e-010 -1 181.2541 380.6348)" width="25.3" height="135.8" />
    </svg>
  </div>
  `;
  const containerOne = `<div class="order-title-container">${orderNumber + notification + logo}</div>`;
  // CONTAINER TWO
  let status;
  switch (order.status) {
    case "checkedout": status = "Validating your Payment"; break;
    case "validated": status = "Building your Order"; break;
    case "built": status = "Packaging your Order"; break;
    case "reviewed": status = "You have Reviewed This Order"; break;
    case "completed": status = "Your Order is now Complete"; break;
    case "cancelled": status = "Your Order has been Cancelled"; break;
    case "refunded": status = "Your Order has been Refunded"; break;
    default: break;
  }
  if (order.shipping.method === "pickup") {
    switch (order.status) {
      case "shipped": status = "Your Order is Ready for Pickup"; break;
      case "arrived": status = "Your Order has been Picked Up"; break;
      default: break;
    }
  } else {
    switch (order.status) {
      case "shipped": status = "Shipping your Order"; break;
      case "arrived": status = "Your Order has Arrived"; break;
      default: break;
    }
  }
  const tracking = `
  <div class="transit-container order-info">
    <i class="fas fa-truck"></i>
    <p class="order-info-text">${status}</p>
  </div>
  `;
  const date = `
  <div class="payment-container order-info">
    <i class="fa fa-calendar-o"></i>
    <p class="order-info-text">${orders.formatDate(order.date[order.status])}</p>
  </div>
  `;
  let address;
  switch (order.shipping.address.option) {
    case "new":
      address = `${order.shipping.address.new.city}, ${order.shipping.address.new.country}`;
      break;
    case "saved":
      address = `${order.shipping.address.saved.city}, ${order.shipping.address.saved.country}`;
      break;
    default: break;
  }
  const location = `
  <div class="location-container order-info">
    <i class="fas fa-map-marker-alt"></i>
    <p class="order-info-text">${address}</p>
  </div>
  `;
  const amount = `<p class="order-total">$${global.priceFormatter(order.payment.amount.total.total)}</p>`;
  const containerTwo = `
  <div id="order-content-container">
    <div class="order-info-wrap">${tracking + date + location}</div>
    <div class="order-total"><p class="total-title">Total</p>${amount}</div>
  </div>
  `;
  // SUMMARY
  const summary = `
  <div id="order-summary-${order._id}" class="order-item"
    onclick="orders.selectOrder('${order._id}')">
      ${containerOne + containerTwo}
      <div class="active-div"></div>
  </div>
  `;
  // INSERT
  document.querySelector("#order-container").insertAdjacentHTML("beforeend", summary);
}

// @func  orders.addDetailed
// @desc  
orders.addDetailed = (order) => {
  // DIVIDER
  const divider = `<div class="divider-container"><div class="divider"></div></div>`;
  // TRACKING CONTAINER
  const containerOne = orders.createTracking(order);
  const containerTwo = orders.createSummary(order);
  const containerThree = orders.createComments(order);
  // DETAILED
  const detailed = `
  <div id="order-detail-${order._id}" class="order-detail-wrap">
    <p class="orderdetails" id="order-details-title">Order Details</p>
    <div class="order-detail-container">
      <div class="exit-icon"><img src="/public/images/user-x.png" alt="X"></div>
      ${containerOne + divider + containerTwo + containerThree}
    </div>
  </div>
  `;
  // INSERT

}

// @func  orders.createTracking
// @desc  
orders.createTracking = (order) => {
  // ORDER HEADING
  const heading = `<p id="order-details-name">Order #${order.number}</p>`;
  // TRACKING
  let statusTitle;
  let statusDetail;
  switch (order.status) {
    case "checkedout":
      statusTitle = "Validating payment";
      statusDetail = "We are currently validating your payment. Thank you for your patience.";
      break;
    case "validated":
      statusTitle = "Building order";
      statusDetail = "We are currently building your order. Thank you for your patience.";
      break;
    case "built":
      statusTitle = "Packaging order";
      statusDetail = "We are currently packaging your order. Thank you for your patience.";
      break;
    case "reviewed":
      statusTitle = "Order reviewed";
      statusDetail = "Thank you for leaving us a review.";
      break;
    case "completed":
      statusTitle = "Order completed";
      statusDetail = "Your order has been completed. Thank you for using CreateBase.";
      break;
    case "cancelled":
      statusTitle = "Refunding order";
      statusDetail = "We are not processing your refund.";
      break;
    case "refunded":
      statusTitle = "Order refunded";
      statusDetail = "Refunds have been processed. Your order is no longer active.";
      break;
    default: break;
  }
  if (order.shipping.method === "pickup") {
    switch (order.status) {
      case "shipped":
        statusTitle = "Ready for pickup";
        statusDetail = "You can now pickup your package. Pick your package at 16 Dapple Place, Flat Bush, Auckland, 2019, New Zealand";
        break;
      case "arrived":
        statusTitle = "Package picked up";
        statusDetail = "You have now picked up your package. Thank you for using CreateBase. Please leave us a review.";
        break;
      default: break;
    }
  } else {
    switch (order.status) {
      case "shipped":
        statusTitle = "Package shipped";
        statusDetail = "Your package is now on its way to your doorstep.";
        break;
      case "arrived":
        statusTitle = "Packaged arrived";
        statusDetail = "Your package has arrived to your doorstep. Thank you for using CreateBase. Please leave us a review.";
        break;
      default: break;
    }
  }
  // progress
  // details
  const statusContainer = `
  <div class="status-detail-container">
    <p class="status-detail-title">Tracking Details</p>
    <div class="status-container"><p class="status-text">${statusTitle}</p></div>
    <div class="status-description-container"><p class="status-description">${statusDetail}</p></div>
  </div>
  `;
  // TRACKING CONTAINER
  const container = `
  <div class="order-tracking-container">${heading + statusContainer}</div>
  `;
  return container;
}

// @func  orders.createSummary
// @desc  
orders.createSummary = (order) => {
  // INFO
  let status;
  switch (order.status) {
    case "checkedout": status = "Validating your Payment"; break;
    case "validated": status = "Building your Order"; break;
    case "built": status = "Packaging your Order"; break;
    case "reviewed": status = "You have Reviewed This Order"; break;
    case "completed": status = "Your Order is now Complete"; break;
    case "cancelled": status = "Your Order has been Cancelled"; break;
    case "refunded": status = "Your Order has been Refunded"; break;
    default: break;
  }
  if (order.shipping.method === "pickup") {
    switch (order.status) {
      case "shipped": status = "Your Order is Ready for Pickup"; break;
      case "arrived": status = "Your Order has been Picked Up"; break;
      default: break;
    }
  } else {
    switch (order.status) {
      case "shipped": status = "Shipping your Order"; break;
      case "arrived": status = "Your Order has Arrived"; break;
      default: break;
    }
  }
  let address;
  switch (order.shipping.address.option) {
    case "new":
      address = `${order.shipping.address.new.city}, ${order.shipping.address.new.country}`;
      break;
    case "saved":
      address = `${order.shipping.address.saved.city}, ${order.shipping.address.saved.country}`;
      break;
    default: break;
  }
  const info = `
  <div class="order-info-wrap">
    <div class="transit-container order-info">
      <i class="fas fa-truck"></i>
      <p class="order-info-text">${status}</p>
    </div>
    <div class="payment-container order-info">
      <i class="fa fa-calendar-o"></i>
      <p class="order-info-text">${orders.formatDate(order.date[order.status])}</p>
    </div>
    <div class="location-container order-info">
      <i class="fas fa-map-marker-alt"></i>
      <p class="order-info-text">${address}</p>
    </div>
    <div class="change-location">Change location</div>
  </div>
  `;
  // MAKE CONTAINERS
  const makes = `
  <div id="order-makes-${order._id}" class="order-item-list-container"></div>
  `;
  // PRICE CONTAINER
  const subtotal = order.payment.amount.makes.total + order.payment.amount.manufacturing.total;
  const discount = order.payment.amount.discount.total;
  const rate = order.payment.amount.discount.rate;
  const gst = order.payment.amount.gst.total;
  const shipping = order.payment.amount.shipping.total;
  const total = order.payment.amount.total.total;
  const price = `
  <div class="price-breakdown-container">
    <div class="divider-container">
      <div class="divider-subtotal"></div>
    </div>
    <div class="price-breakdown">
      <div class="subtotal-container">
        <div class="subtotal-title">Sub-total</div>
        <div class="subtotal-price">$${global.priceFormatter(subtotal)}</div>
      </div>
      <div class="subtotal-container">
        <div class="subtotal-title">Discount</div>
        <div class="subtotal-price"><span>(${rate * 100}%)</span> -$${global.priceFormatter(discount)}</div>
      </div>
      <div class="subtotal-container">
        <div class="subtotal-title">GST</div>
        <div class="subtotal-price">$${global.priceFormatter(gst)}</div>
      </div>
      <div class="subtotal-container">
        <div class="subtotal-title">Shipping</div>
        <div class="subtotal-price">$${global.priceFormatter(shipping)}</div>
      </div>
      <div class="divider-container2">
        <div class="divider-subtotal totalprice"></div>
      </div>
      <div class="order-detail-total">
        <p class="subtotal-title">Total</p>
        <p class="detail-order-total">$${global.priceFormatter(total)}</p>
      </div>
    </div>
  </div>
  `;
  // SUMMARY CONTAINER
  const container = `
  <div class="order-summary">
    <p class="order-summary-title">Order Summary</p>
    <div id="order-detail-content-container">
      ${info + makes + price}
    </div>
    <div class="divider"></div>
  </div>
  `;
  return container;
}

// @func  orders.createComments
// @desc  
orders.createComments = (order) => {
  const form = `
  <div class="comment-form-container">
    <input type="text" id="comment-input-${order._id}" placeholder="Post a comment...">
    <div id="order-post-comment-${order._id}" class="submit-comment-container" onclick="orders.postComment('${order._id}');">+</div>
  </div>
  `;
  // COMMENTS CONTAINER
  const container = `
  <div class="comment-wrap">
    <p class="comment-title">Comments</p>
    <div id="order-comments-${order._id}" class="comment-container"></div>
    ${form}
  </div>
  `;
  return container;
}

// @func  orders.addMake
// @desc  
orders.addMake = (orderId, make) => {
  // CREATE MAKE
  const make = `
  <div class="order-item-detailed">
    <div id="order-make-viewer-${make.id}" class="item-img-container"></div>
    <div class="item-name-container">${make.file.name}</div>
    <div class="item-type-list-container">
      ${make.material}, ${make.quality}, ${make.strength}, ${make.colour}
    </div>
    <div class="item-quantity-container">
      <p class="qty-title">Qty</p>
      <div class="order-item-quantity">${make.quantity.built}/${make.quantity.ordered}</div>
    </div>
    <div class="order-item-price">$${global.priceFormatter(make.quantity.ordered * make.price)}</div>
  </div>
  `;
  // INSERT
  //document.querySelector(`#`).insertAdjacentHTML("beforeend", make);
  // VIEWER
  //orders.viewerFetch(`/files/stl/fetch/${make.file.id}`, `order-make-viewer-${make.id}`);
  // SUCCESS HANDLER
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