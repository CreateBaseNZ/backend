/* ========================================================================================
VARIABLES
======================================================================================== */

let orders = {
  initialise: undefined,
  fetchOrders: undefined,
  populateOrders: undefined,
  insertOrder: undefined,
  insertMake: undefined,
  insertComment: undefined,
  postComment: undefined,
  collectComment: undefined,
  submitComment: undefined,
  errorHandler: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  orders.initialise
// @desc  
orders.initialise = async () => {
  // FETCH ORDERS
  let data;
  try {
    data = await orders.fetchOrders();
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
  // POPULATE ORDERS
  orders.populateOrders(data.content);
  // SUCCESS HANDLER
  return;
}

// @func  orders.fetchOrders
// @desc  
orders.fetchOrders = () => {
  return new Promise(async (resolve, reject) => {
    let data;
    try {
      data = (await axios.get("/orders/fetch-orders"))["data"];
    } catch (error) {
      return reject(error);
    }
    if (data.status === "error") return reject(data.content);
    return resolve(data);
  });
}

// @func  orders.populateOrders
// @desc  
orders.populateOrders = (fetchedOrders) => {
  if (!fetchedOrders.length) {
    // TO DO .....
    // EMPTY ORDERS HANDLER
    // TO DO .....
    return;
  }
  for (let i = 0; i < fetchedOrders.length; i++) {
    const order = fetchedOrders[i];
    orders.insertOrder(order);
  }
  return;
}

// @func  orders.insertOrder
// @desc  
orders.insertOrder = (order) => {
  console.log(order); // TEMPORARY
  // TO DO .....
  // CREATE SUMMARY
  // CREATE EXPANDED
  // TO DO .....
  // POPULATE MAKES
  for (let i = 0; i < order.makes.checkout.length; i++) {
    const make = order.makes.checkout[i];
    orders.insertMake(order._id, make);
  }
  // POPULATE COMMENTS
  for (let i = 0; i < order.comments.length; i++) {
    const comment = order.comments[i];
    orders.insertComment(order._id, comment);
  }
  return;
}

// @func  orders.insertMake
// @desc  
orders.insertMake = (orderId, make) => {
  console.log(make); // TEMPORARY
  // TO DO .....
  // CREATE MAKE
  // TO DO .....
  return;
}

// @func  orders.insertComment
// @desc  
orders.insertComment = (orderId, comment) => {
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
  orders.insertComment(orderId, data.content);
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

// @func  orders.errorHandler
// @desc  
orders.errorHandler = (error) => {
  // TO DO .....
  // ERROR HANDLER
  // TO DO .....
  console.log(error); // TEMPORARY
  return;
}

/* ========================================================================================
END
======================================================================================== */