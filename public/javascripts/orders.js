/* ========================================================================================
VARIABLES
======================================================================================== */

let orders = {
  fetchOrders: undefined,
  postComment: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  orders.fetchOrders
// @desc  
orders.fetchOrders = () => {
  return new Promise(async (resolve, reject) => {
    let data;
    try {
      data = (await axios.get("/order/fetch-orders"))["data"];
    } catch (error) {
      return reject(error);
    }
    return resolve(data);
  });
}

// @func  orders.postComment
// @desc  
orders.postComment = (orderId, message) => {
  return new Promise(async (resolve, reject) => {
    let data;
    try {
      data = (await axios.post("/orders/post-comment", { orderId, message }))["data"];
    } catch (error) {
      return reject(error);
    }
    return resolve(data);
  });
}

/* ========================================================================================
END
======================================================================================== */