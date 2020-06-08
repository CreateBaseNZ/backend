/* ========================================================================================
VARIABLES
======================================================================================== */

let orders = {
  fetchOrders: undefined,
  updateOrderStatus: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  orders.fetchOrders
// @desc  
orders.fetchOrders = () => {
  return new Promise(async (resolve, reject) => {
    // FETCH REQUEST
    let data;
    try {
      data = (await axios.get("/admin/orders/fetch-orders"))["data"];
    } catch (error) {
      return reject(error);
    }
    // SUCCESS HANDLER
    return resolve(data);
  });
}

// @func  orders.updateOrderStatus
// @desc  
orders.updateOrderStatus = (orderId, status) => {
  return new Promise(async (resolve, reject) => {
    // UPDATE REQUEST
    let data;
    try {
      data = (await axios.post("/admin/orders/update-order-status", { orderId, status }))["data"];
    } catch (error) {
      return reject(error);
    }
    // SUCCESS HANDLER
    return resolve(data);
  });
}

/* ========================================================================================
END
======================================================================================== */