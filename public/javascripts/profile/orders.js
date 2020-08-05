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
  createStatusProgress: undefined,
  createStatusLabel: undefined,
  createSummary: undefined,
  createPreview: undefined,
  createComments: undefined,
  formatMakeName: undefined,
  addMake: undefined,
  // TRACKING SECTION
  generateCheckedout: undefined,
  generateValidated: undefined,
  generateBuilt: undefined,
  generateShipped: undefined,
  generateArrived: undefined,
  generateReviewed: undefined,
  generateCompleted: undefined,
  // COMMENT
  addComment: undefined,
  postComment: undefined,
  collectComment: undefined,
  submitComment: undefined,
  formatDateComment: undefined,
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
  let fetchedOrders
  try {
    fetchedOrders = await orders.fetchOrders()
  } catch (error) {
    return
  }
  // POPULATE ORDERS
  orders.populateOrders(fetchedOrders)
  dashboard.processOrders(fetchedOrders)
  // SUCCESS HANDLER
  return;
}

// @func  orders.errorHandler
// @desc  
orders.errorHandler = (error) => {
  // TO DO .....
  // ERROR HANDLER
  // TO DO .....
  console.log(error) // TEMPORARY
  return
}

// @func  orders.formatDate
// @desc  
orders.formatDate = (date) => {
  const day = moment(date).format("DD")
  const month = moment(date).format("MMM")
  const year = moment(date).format("YYYY")
  return (`${day} ${month} ${year}`)
}

/* ----------------------------------------------------------------------------------------
ORDERS
---------------------------------------------------------------------------------------- */

// @func  orders.selectOrder
// @desc  
orders.selectOrder = (orderId) => {
  if (orders.selectedOrder === orderId) {
    return orders.deselectOrder(orders.selectedOrder)
  }
  // UPDATE CSS
  if (orders.selectedOrder) orders.deselectOrder(orders.selectedOrder)
  document.querySelector(`#order-summary-${orderId}`).classList.add("active-item")
  document.querySelector(`#order-detail-${orderId}`).classList.remove("hide")
  return orders.selectedOrder = orderId // UPDATE SELECTED ORDER
}

// @func  orders.deselectOrder
// @desc  
orders.deselectOrder = (orderId) => {
  document.querySelector(`#order-summary-${orderId}`).classList.remove("active-item")
  document.querySelector(`#order-detail-${orderId}`).classList.add("hide")
  orders.selectedOrder = undefined // UPDATE SELECTED ORDER
}

// @func  orders.fetchOrders
// @desc  
orders.fetchOrders = () => {
  return new Promise(async (resolve, reject) => {
    let data
    try {
      data = (await axios.get("/orders/fetch-orders"))["data"]
    } catch (error) {
      data = { status: "error", content: error }
    }
    if (data.status === "error") {
      orders.errorHandler(data.content)
      return reject()
    } else if (data.status === "failed") {
      // TO DO .....
      // FAILED HANDLER
      // TO DO .....
      console.log(data.content)
      return reject()
    }
    return resolve(data.content)
  })
}

// @func  orders.populateOrders
// @desc  
orders.populateOrders = (fetchedOrders = []) => {
  if (!fetchedOrders.length) {
    // TO DO .....
    // EMPTY ORDERS HANDLER
    // TO DO .....
    return
  }
  for (let i = 0; i < fetchedOrders.length; i++) {
    const order = fetchedOrders[i]
    orders.addOrder(order)
  }
  return
}

// @func  orders.addOrder
// @desc  
orders.addOrder = (order) => {
  // CREATE SUMMARY
  orders.addSummary(order)
  // CREATE EXPANDED
  orders.addDetailed(order)
  // POPULATE MAKES
  for (let i = 0; i < order.makes.checkout.length; i++) {
    const make = order.makes.checkout[i]
    orders.addMake(order, make)
  }
  // POPULATE COMMENTS
  for (let i = 0; i < order.comments.length; i++) {
    const comment = order.comments[i]
    orders.addComment(order, comment)
  }
  return
}

// @func  orders.addSummary
// @desc  
orders.addSummary = (order) => {
  // CONTAINER ONE
  const orderNumber = `<p class="order-name">Order #${order.number}</p>`
  let notification = `<div id="order-summary-notification-${order._id}"></div>` // TEMPORARY NO NOTIFICATION
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
  `
  const containerOne = `<div class="order-title-container">${orderNumber + notification}</div>`
  // CONTAINER TWO
  let status
  switch (order.status) {
    case "checkedout": status = "Validating Payment"; break;
    case "validated": status = "Building Order"; break;
    case "built": status = "Packaging Order"; break;
    case "reviewed": status = "Order Reviewed"; break;
    case "completed": status = "Order Completed"; break;
    case "cancelled": status = "Refunding Order"; break;
    case "refunded": status = "Order Refunded"; break;
    default: break;
  }
  if (order.shipping.method === "pickup") {
    switch (order.status) {
      case "shipped": status = "Ready for Pickup"; break;
      case "arrived": status = "Package Picked Up"; break;
      default: break;
    }
  } else {
    switch (order.status) {
      case "shipped": status = "Package Shipped"; break;
      case "arrived": status = "Package Arrived"; break;
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
  const containerThree = orders.createPreview(order);
  const containerFour = orders.createComments(order);
  // DETAILED
  const detailed = `
  <div id="order-detail-${order._id}" class="order-detail-wrap hide">
    <p class="orderdetails" id="order-details-title">Order Details</p>
    <div class="order-detail-container">
      <div class="exit-icon" onclick="orders.deselectOrder('${order._id}');">
        <img src="/public/images/user-x.png" alt="X">
      </div>
      ${containerOne + divider + containerTwo + divider + containerThree + divider + containerFour}
    </div>
  </div>
  `;
  // INSERT
  document.querySelector("#orders-area").insertAdjacentHTML("beforeend", detailed);
}

// @func  orders.createTracking
// @desc  
orders.createTracking = (order) => {
  // ORDER HEADING
  const heading = `<p id="order-details-name">Order #${order.number}</p>`;
  // TRACKING
  let statusTitle;
  let statusDetail;
  let statusProgress;
  let statusLabel;
  let shippedProgress;
  let arrivedProgress;
  if (order.shipping.method === "pickup") {
    shippedProgress = "Ready for Pickup";
    arrivedProgress = "Package Picked up";
  } else {
    shippedProgress = "Package Shipped";
    arrivedProgress = "Packaged Arrived";
  }
  switch (order.status) {
    case "checkedout":
      [statusTitle, statusDetail, statusProgress, statusLabel] = orders.generateCheckedout(order, shippedProgress, arrivedProgress);
      break;
    case "validated":
      [statusTitle, statusDetail, statusProgress, statusLabel] = orders.generateValidated(order, shippedProgress, arrivedProgress);
      break;
    case "built":
      [statusTitle, statusDetail, statusProgress, statusLabel] = orders.generateBuilt(order, shippedProgress, arrivedProgress);
      break;
    case "shipped":
      [statusTitle, statusDetail, statusProgress, statusLabel] = orders.generateShipped(order, shippedProgress, arrivedProgress);
      break;
    case "arrived":
      [statusTitle, statusDetail, statusProgress, statusLabel] = orders.generateArrived(order, shippedProgress, arrivedProgress);
      break;
    case "reviewed":
      [statusTitle, statusDetail, statusProgress, statusLabel] = orders.generateReviewed(order, shippedProgress, arrivedProgress);
      break;
    case "completed":
      [statusTitle, statusDetail, statusProgress, statusLabel] = orders.generateCompleted(order, shippedProgress, arrivedProgress);
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
  <div class="order-tracking-container">${heading + statusProgress + statusLabel + statusContainer}</div>
  `;
  return container;
}

// @func  orders.createStatusProgress
// @desc  
orders.createStatusProgress = (progresses = [], classesOne = [], classesTwo = []) => {
  let html = `<div class="progress-bar-container">`;
  for (let i = 0; i < progresses.length; i++) {
    const progress = progresses[i];
    const otherClassOne = classesOne[i];
    const otherClassTwo = classesTwo[i];
    if (progress === "completed") {
      html += `
      <div class="progress-container ${otherClassOne}">
        <div class="status-circle"></div>
        <div class="status-line"></div>
      </div>
      `;
      if (i !== progresses.length - 1) {
        html += `
        <div class="progress-bar ${otherClassTwo}"></div>
        `;
      }
    } else if (progress === "on-progress") {
      html += `
      <div class="progress-container ${otherClassOne}">
        <div class="status-circle status-circle-current">
          <div class="status-circle-current-inner"></div>
        </div>
        <div class="status-line ${otherClassTwo}"></div>
      </div>
      `;
      if (i !== progresses.length - 1) {
        html += `
        <div class="progress-bar next-progress"></div>
        `;
      }
    } else if (progress === "incomplete") {
      html += `
      <div class="progress-container ${otherClassOne}">
        <div class="status-circle next-circle"></div>
        <div class="status-line"></div>
      </div>
      `;
      if (i !== progresses.length - 1) {
        html += `
        <div class="progress-bar next-progress ${otherClassTwo}"></div>
        `;
      }
    }
  }
  html += `</div>`;
  return html;
}

// @func  orders.createStatusLabel
// @desc  
orders.createStatusLabel = (labels = [], classes = []) => {
  let html = `<div class="progress-caption-container">`;
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    let otherClass = classes[i];
    html += `
    <div class="status-label-container ${otherClass}">
      <p class="status-label">${label}</p>
    </div>
    `;
  }
  html += `</div>`;
  return html;
}

// @func  orders.createSummary
// @desc  
orders.createSummary = (order) => {
  // INFO
  let status;
  switch (order.status) {
    case "checkedout": status = "Validating Payment"; break;
    case "validated": status = "Building Order"; break;
    case "built": status = "Packaging Order"; break;
    case "reviewed": status = "Order Reviewed"; break;
    case "completed": status = "Order Completed"; break;
    case "cancelled": status = "Refunding Order"; break;
    case "refunded": status = "Order Refunded"; break;
    default: break;
  }
  if (order.shipping.method === "pickup") {
    switch (order.status) {
      case "shipped": status = "Ready for Pickup"; break;
      case "arrived": status = "Package Picked Up"; break;
      default: break;
    }
  } else {
    switch (order.status) {
      case "shipped": status = "Package Shipped"; break;
      case "arrived": status = "Package Arrived"; break;
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
    <div class="order-detail-content-container">
      ${info + makes + price}
    </div>
  </div>
  `;
  return container;
}

// @func  orders.createPreview
// @desc  
orders.createPreview = (order) => {
  const container = `
  <div class="order-preview">
    <p class="preview-title">Preview</p>
    <div id="order-preview-${order._id}" class="preview-photo-container"></div>
  </div>
  `;
  return container;
}

// @func  orders.createComments
// @desc  
orders.createComments = (order) => {
  const orderObject = JSON.stringify(order);
  const form = `
  <div class="comment-form-container">
      <button id="attach-comment" class="submit-comment-container rmv-btn-css" onclick=''>
      <?xml version="1.0" encoding="iso-8859-1"?>
      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 471.641 471.641"
        style="enable-background:new 0 0 471.641 471.641;" xml:space="preserve">
        <g>
          <path d="M431.666,49.412c-51.692-50.578-134.33-50.567-186.009,0.025L28.911,266.184c-39.192,40.116-38.443,104.407,1.673,143.599
          c39.456,38.548,102.47,38.548,141.926,0l196.267-196.267c25.515-25.515,25.515-66.884,0-92.399
          c-25.515-25.515-66.884-25.515-92.399,0L88.644,308.85c-6.548,6.78-6.36,17.584,0.42,24.132c6.614,6.388,17.099,6.388,23.713,0
          L300.51,145.249c12.449-11.926,32.209-11.501,44.134,0.948c11.565,12.073,11.565,31.114,0,43.187L148.378,385.65
          c-26.514,26.137-69.197,25.831-95.334-0.683c-25.873-26.246-25.873-68.405,0-94.651L269.79,73.569
          c38.608-38.622,101.214-38.633,139.836-0.026c38.622,38.607,38.633,101.214,0.026,139.836L192.905,430.126
          c-7.159,6.131-7.993,16.905-1.862,24.064c6.131,7.159,16.905,7.993,24.064,1.862c0.668-0.572,1.29-1.194,1.862-1.862
          l216.747-216.747C485.073,184.954,484.156,100.769,431.666,49.412z" />
        </g>
      </svg>
    </button>
    <input type="text" class="messageSubmit" id="order-comment-${order._id}" placeholder="Post a comment...">
    <button id="post-comment-${order._id}" class="submit-comment-container rmv-btn-css" onclick='orders.postComment(${orderObject});'>
      <?xml version="1.0" encoding="iso-8859-1"?>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
      <style type="text/css">
        .st0{fill:#FFFFFF;}
      </style>
      <g id="Layer_1">
      </g>
      <g id="Layer_2">
        <polygon class="st0" points="6.6,34.2 497.3,247.8 7,459.7 7,296 360.1,246.9 7.4,200.3 	"/>
      </g>
      </svg>
    </button>
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

// @func  orders.formatMakeName
// @desc  
orders.formatMakeName = (filename = "") => {
  const filenameArray = filename.split(".");
  const name = filenameArray.slice(0, filenameArray.length - 1).join();
  const length = name.length;
  let displayName = { first: undefined, middle: undefined, last: undefined };
  if (length > 12) {
    displayName = { first: name.slice(0, 4), middle: " ... ", last: name.slice(length - 4) };
  } else {
    displayName = { first: name, middle: "", last: "" };
  }
  return displayName.first + displayName.middle + displayName.last;
}

// @func  orders.addMake
// @desc  
orders.addMake = (order, make) => {
  // CREATE MAKE
  const html = `
  <div class="order-item-detailed">
    <div id="order-make-viewer-${make.id}" class="item-img-container"></div>
    <div class="item-name-container">${orders.formatMakeName(make.file.name)}</div>
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
  document.querySelector(`#order-makes-${order._id}`).insertAdjacentHTML("beforeend", html);
  // VIEWER
  orders.viewerFetch(`/files/stl/fetch/${make.file.id}`, `order-make-viewer-${make.id}`);
  // ADD COMMENT
  if (make.comment) orders.addComment(order, make.comment);
  // SUCCESS HANDLER
  return;
}

/* ----------------------------------------------------------------------------------------
TRACKING DETAILS
---------------------------------------------------------------------------------------- */

// @func  orders.generateCheckedout
// @desc  
orders.generateCheckedout = (order = {}, shippedProgress, arrivedProgress) => {
  // CREATE TRACKING DETAILS
  const statusTitle = "Validating payment";
  const statusDetail = "We are currently validating your payment. Thank you for your patience.";
  const statusProgress = orders.createStatusProgress(["on-progress", "incomplete", "incomplete", "incomplete", "incomplete"], ["", "", "", "full-tracking", "full-tracking"], ["", "", "full-tracking", "full-tracking", ""]);
  const statusLabel = orders.createStatusLabel(["Validating Payment", "Building Order", "Packaging Order", shippedProgress, arrivedProgress], ["", "", "", "full-tracking", "full-tracking"]);
  // SUCCESS HANDLER
  return [statusTitle, statusDetail, statusProgress, statusLabel];
}

// @func  orders.generateValidated
// @desc  
orders.generateValidated = (order = {}, shippedProgress, arrivedProgress) => {
  // CREATE TRACKING DETAILS
  const statusTitle = "Building order";
  const statusProgress = orders.createStatusProgress(["completed", "on-progress", "incomplete", "incomplete", "incomplete"], ["", "", "", "full-tracking", "full-tracking"], ["", "", "full-tracking", "full-tracking", ""]);
  const statusLabel = orders.createStatusLabel(["Validating Payment", "Building Order", "Packaging Order", shippedProgress, arrivedProgress], ["", "", "", "full-tracking", "full-tracking"]);
  // build the message
  let message;
  let duration;
  if (order.manufacturingSpeed === "normal") {
    duration = 3;
  } else if (order.manufacturingSpeed === "urgent") {
    duration = 1;
  } else {
    // ERROR HANDLER
    const error = "Invalid manufacturing option";
    console.log(error); // TEMPORARY
  }
  const date = moment(order.date.validated).add(duration, "days");
  const now = moment();
  const difference = {
    days: date.diff(now, "days", true), hours: date.diff(now, "hours", true),
    minutes: date.diff(now, "minutes", true)
  }
  // check if overdue
  if (difference.minutes < 0) {
    message = "We are prioritising the completion of your order";
  } else {
    if (Math.floor(difference.days) > 0) {
      const estimate = Math.round(difference.days);
      if (estimate > 1) {
        message = `The estimated time to completion is ${estimate} days`;
      } else {
        message = `The estimated time to completion is ${estimate} day`;
      }
    } else if (Math.floor(difference.hours) > 0) {
      const estimate = Math.round(difference.hours);
      if (estimate > 1) {
        message = `The estimated time to completion is ${estimate} hours`;
      } else {
        message = `The estimated time to completion is ${estimate} hour`;
      }
    } else {
      const estimate = Math.round(difference.minutes);
      if (estimate > 1) {
        message = `The estimated time to completion is ${estimate} minutes`;
      } else if (estimate == 1) {
        message = `The estimated time to completion is 1 minute`;
      } else {
        message = `The estimated time to completion is less than a minute`;
      }
    }
  }
  const statusDetail = `We are currently building your order. ${message}. Thank you for your patience.`;
  // SUCCESS HANDLER
  return [statusTitle, statusDetail, statusProgress, statusLabel];
}

// @func  orders.generateBuilt
// @desc  
orders.generateBuilt = (order = {}, shippedProgress, arrivedProgress) => {
  // CREATE TRACKING DETAILS
  let statusTitle;
  let statusDetail = "We are currently packaging your order. ";
  // next workday
  const nextWorkingDate = global.nextWorkingDay(order.date.built);
  const nextWorkingDateFormatted = moment(nextWorkingDate).format("ddd, DD MMM YYYY");
  if (order.shipping.method === "pickup") {
    statusTitle = "Packaging order";
    statusDetail += `It will be ready for pickup next working day (${nextWorkingDateFormatted}). `;
  } else {
    statusTitle = "Packaging order";
    statusDetail += `It will be sent for shipping next working day (${nextWorkingDateFormatted}). `;
  }
  statusDetail += "Thank you for your patience.";
  const statusProgress = orders.createStatusProgress(["completed", "completed", "on-progress", "incomplete", "incomplete"], ["full-tracking", "", "", "", "full-tracking"], ["full-tracking", "", "", "full-tracking", ""]);
  const statusLabel = orders.createStatusLabel(["Validating Payment", "Building Order", "Packaging Order", shippedProgress, arrivedProgress], ["full-tracking", "", "", "", "full-tracking"]);
  // SUCCESS HANDLER
  return [statusTitle, statusDetail, statusProgress, statusLabel];
}

// @func  orders.generateShipped
// @desc  
orders.generateShipped = (order = {}, shippedProgress, arrivedProgress) => {
  // CREATE TRACKING DETAILS
  let statusTitle;
  let statusDetail;
  if (order.shipping.method === "pickup") {
    statusTitle = "Ready for pickup";
    statusDetail = "You can now pickup your package. Pick it up at 16 Dapple Place, Flat Bush, Auckland, 2019, New Zealand";
  } else {
    let numberOfWorkingDays;
    if (order.shipping.method === "tracked") {
      numberOfWorkingDays = 3;
    } else if (order.shipping.method === "courier") {
      numberOfWorkingDays = 1;
    }
    const deliveryDate = global.calculateWorkingDay(order.date.shipped);
    const deliveryDateFormatted = moment(deliveryDate).format("ddd, DD MMM YYYY");
    statusTitle = "Package shipped";
    statusDetail = `Your package is now on its way to your doorstep. Its estimated arrival date is ${deliveryDateFormatted}. Track your order <a href="https://www.nzpost.co.nz/tools/tracking/item/${order.shipping.tracking}">here</a>.`;
  }
  const statusProgress = orders.createStatusProgress(["completed", "completed", "on-progress", "incomplete", "incomplete"], ["full-tracking", "", "", "", "full-tracking"], ["full-tracking", "", "", "full-tracking", ""]);
  const statusLabel = orders.createStatusLabel(["Validating Payment", "Building Order", shippedProgress, arrivedProgress, "Order Reviewed"], ["full-tracking", "", "", "", "full-tracking"]);
  // SUCCESS HANDLER
  return [statusTitle, statusDetail, statusProgress, statusLabel];
}

// @func  orders.generateArrived
// @desc  
orders.generateArrived = (order = {}, shippedProgress, arrivedProgress) => {
  // CREATE TRACKING DETAILS
  let statusTitle;
  let statusDetail;
  if (order.shipping.method === "pickup") {
    statusTitle = "Package picked up";
    statusDetail = "You have now picked up your package. Thank you for using CreateBase. Please leave us a review.";
  } else {
    statusTitle = "Packaged arrived";
    statusDetail = "Your package has arrived to your doorstep. Thank you for using CreateBase. Please leave us a review.";
  }
  const statusProgress = orders.createStatusProgress(["completed", "completed", "on-progress", "incomplete", "incomplete"], ["full-tracking", "", "", "", "full-tracking"], ["full-tracking", "", "", "full-tracking", ""]);
  const statusLabel = orders.createStatusLabel(["Validating Payment", shippedProgress, arrivedProgress, "Order Reviewed", "Order Completed"], ["full-tracking", "", "", "", "full-tracking"]);
  // SUCCESS HANDLER
  return [statusTitle, statusDetail, statusProgress, statusLabel];
}

// @func  orders.generateReviewed
// @desc  
orders.generateReviewed = (order = {}, shippedProgress, arrivedProgress) => {
  // CREATE TRACKING DETAILS
  const statusTitle = "Order reviewed";
  const statusDetail = "Thank you for leaving us a review.";
  const statusProgress = orders.createStatusProgress(["completed", "completed", "completed", "on-progress", "incomplete"], ["full-tracking", "full-tracking", "", "", ""], ["full-tracking", "full-tracking", "", "", ""]);
  const statusLabel = orders.createStatusLabel(["Validating Payment", shippedProgress, arrivedProgress, "Order Reviewed", "Order Completed"], ["full-tracking", "full-tracking", "", "", ""]);
  // SUCCESS HANDLER
  return [statusTitle, statusDetail, statusProgress, statusLabel];
}

// @func  orders.generateCompleted
// @desc  
orders.generateCompleted = (order = {}, shippedProgress, arrivedProgress) => {
  // CREATE TRACKING DETAILS
  const statusTitle = "Order completed";
  const statusDetail = "Your order has been completed. Thank you for using CreateBase.";
  const statusProgress = orders.createStatusProgress(["completed", "completed", "completed", "completed", "on-progress"], ["full-tracking", "full-tracking", "", "", ""], ["full-tracking", "full-tracking", "", "", ""]);
  const statusLabel = orders.createStatusLabel(["Validating Payment", shippedProgress, arrivedProgress, "Order Reviewed", "Order Completed"], ["full-tracking", "full-tracking", "", "", ""]);
  // SUCCESS HANDLER
  return [statusTitle, statusDetail, statusProgress, statusLabel];
}

/* ----------------------------------------------------------------------------------------
COMMENT
---------------------------------------------------------------------------------------- */

// @func  orders.addComment
// @desc  
orders.addComment = (order, comment) => {
  // CREATE HTML
  let commentClass;
  if ((order.accountId + "") === (comment.author.id + "")) {
    commentClass = "admin-comment";
  } else {
    commentClass = "customer-comment";
  }
  const html = `
  <div class="${commentClass}">
    <div class="profile-pic-container">
      <img decoding="async" src="/file/display-picture/${comment.author.picture}">
    </div>
    <div class="message">
      <div class="msg-date-container">${orders.formatDateComment(comment.date.modified)}</div>
      <div class="msg-container">${comment.message}</div>
    </div>
  </div>
  `;
  // INSERT
  document.querySelector(`#order-comments-${order._id}`).insertAdjacentHTML("beforeend", html);
  return;
}

// @func  orders.postComment
// @desc  
orders.postComment = async (order) => {
  // LOADER
  document.querySelector(`#post-comment-${order._id}`).setAttribute("disabled", "");
  // COLLECT
  const form = orders.collectComment(order._id);
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
  orders.addComment(order, data.content);
  // SUCCESS HANDLER
  document.querySelector(`#post-comment-${order._id}`).removeAttribute("disabled");
  document.querySelector(`#order-comment-${order._id}`).value = "";
  return;
}

// @func  orders.collectComment
// @desc  
orders.collectComment = (orderId) => {
  let comment = {
    orderId,
    message: document.querySelector(`#order-comment-${orderId}`).value
  }
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

// @func  orders.formatDateComment
// @desc  
orders.formatDateComment = (date) => {
  const hour = moment(date).format("hh");
  const minute = moment(date).format("mm");
  const post = moment(date).format("a");
  const day = moment(date).format("DD");
  const month = moment(date).format("MMM");
  const year = moment(date).format("YYYY");
  return (`${hour}:${minute}${post} ${day} ${month} ${year}`);
}

/* ----------------------------------------------------------------------------------------
VIEWER
---------------------------------------------------------------------------------------- */

// @func  orders.viewerFetch
// @desc  
orders.viewerFetch = async (url, id) => {
  var element = document.getElementById(id);
  let length = document.documentElement.clientHeight > document.documentElement.clientWidth ?
    document.documentElement.clientHeight : document.documentElement.clientWidth;
  let dimension = length * 0.02 + 20;
  var camera = new THREE.PerspectiveCamera(70, dimension / dimension, 1, 1000);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(dimension, dimension);
  element.appendChild(renderer.domElement);

  element.addEventListener('resize', function () {
    let length = document.documentElement.clientHeight > document.documentElement.clientWidth ?
      document.documentElement.clientHeight : document.documentElement.clientWidth;
    let dimension = length * 0.02 + 20;
    renderer.setSize(dimension, dimension);
    camera.aspect = dimension / dimension;
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