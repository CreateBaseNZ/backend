/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

const Make = require("./../model/Make.js");
const Purchase = require("./../model/Item.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const restrictedPages = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};

/*=========================================================================================
GRIDFS
=========================================================================================*/

const gridFsStream = require("gridfs-stream");

let GridFS;

mongoose.createConnection(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  },
  (error, client) => {
    if (error) throw error;

    GridFS = gridFsStream(client.db, mongoose.mongo);
    GridFS.collection("fs");
  }
);

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     GET /customer/orders/print/awaiting-quote
// @desc      Get customer's 3D print orders that are awaiting quotation
// @access    Private
router.post(
  "/customer/orders/print/awaiting-quote",
  restrictedPages,
  async (req, res) => {
    let accountId = req.user._id;
    let orders;
    try {
      orders = await getMakeOrders(accountId, "awaiting quote");
    } catch {
      throw error;
    }
    return res.send(orders);
  }
);

// @route     GET /customer/orders/print/checkout
// @desc      Get customer's 3D print orders that are ready for checkout
// @access    Private
router.post(
  "/customer/orders/print/checkout",
  restrictedPages,
  async (req, res) => {
    let accountId = req.user._id;
    let orders;
    try {
      orders = await getMakeOrders(accountId, "checkout");
    } catch {
      throw error;
    }
    return res.send(orders);
  }
);

// @route     GET /customer/orders/marketplace/checkout
// @desc      Get customer's Marketplace orders that are ready for checkout
// @access    Private
router.post(
  "/customer/orders/marketplace/checkout",
  restrictedPages,
  async (req, res) => {
    let accountId = req.user._id;
    let orders;
    try {
      orders = await getPurchaseOrders(accountId, "checkout");
    } catch {
      throw error;
    }
    return res.send(orders);
  }
);

// @route     GET /orders/print/update
// @desc      Update the quantity of the 3D print order
// @access    Private
router.post("/orders/print/update", restrictedPages, async (req, res) => {
  let printId = mongoose.Types.ObjectId(req.body.printId);
  let printQuantity = req.body.quantity;
  let order;
  try {
    order = (
      await updateMakeOrder(printId, "quantity", printQuantity)
    ).toJSON();
  } catch (error) {
    return res.send(error);
  }
  let fileName;
  try {
    fileName = await getFileName(order.fileId);
  } catch (error) {
    return res.send(error);
  }
  let revisedOrder = { ...order, ...{ fileName } };
  return res.send(revisedOrder);
});

// @route     GET /orders/print/delete
// @desc      Delete the 3D print order from the database
// @access    Private
router.post("/orders/print/delete", restrictedPages, async (req, res) => {
  // Declare variables
  const printId = mongoose.Types.ObjectId(req.body.printId);
  let deletedPrint;
  let fileId;
  // Delete the Make
  try {
    deletedPrint = await deleteMakeOrder(printId);
  } catch (error) {
    return res.send({ status: "failed", contents: error });
  }
  fileId = mongoose.Types.ObjectId(deletedPrint.file.id);
  // Delete the file
  try {
    await deleteFile(fileId);
  } catch (error) {
    // If error was encountered, send a failed status
    return res.send({ status: "failed", contents: error });
  }
  // Send back a success status
  return res.send({ status: "success", contents: "" });
});

// @route     POST /checkout/order
// @desc
// @access    Private
router.post("/checkout/order", restrictedPages, async (req, res) => {});

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

// THE FUNCTION TO FETCH THE ARRAY OF 3D PRINT ORDERS DEPENDING ON THE STATUS

const getMakeOrders = (accountId, status) => {
  return new Promise(async (resolve, reject) => {
    let orders;
    // If status is provided, return the array of orders containing the given status
    if (status) {
      try {
        orders = await Make.find({ accountId, status });
      } catch (error) {
        reject(error);
      }
    } else {
      try {
        orders = await Make.find({ accountId });
      } catch (error) {
        reject(error);
      }
    }
    let revisedOrders = [];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i].toJSON();
      let fileName;
      try {
        fileName = await getFileName(order.fileId);
      } catch (error) {
        reject(error);
      }
      revisedOrders[i] = { ...order, ...{ fileName } };
    }
    resolve(revisedOrders);
  });
};

// THE FUNCTION TO FETCH THE ARRAY OF MARKETPLACE ORDERS DEPENDING ON THE STATUS

const getPurchaseOrders = (accountId, status) => {
  return new Promise(async (resolve, reject) => {
    let orders;
    // If status is provided, return the array of orders containing the given status
    if (status) {
      try {
        orders = await Purchase.find({ accountId, status });
      } catch (error) {
        reject(error);
      }
    } else {
      try {
        orders = await Purchase.find({ accountId });
      } catch (error) {
        reject(error);
      }
    }
    resolve(orders);
  });
};

// THE FUNCTION TO FETCH THE NAME OF THE FILE

const getFileName = _id => {
  return new Promise(async (resolve, reject) => {
    let fileName;
    try {
      fileName = (await GridFS.files.findOne({ _id }))["filename"];
    } catch (error) {
      reject(error);
    }
    resolve(fileName);
  });
};

// THE FUNCTION TO UPDATE A PROPERTY OF A 3D PRINT ORDER

const updateMakeOrder = (_id, property, value) => {
  return new Promise(async (resolve, reject) => {
    let order;
    try {
      order = await Make.findById(_id);
    } catch (error) {
      reject(error);
    }
    order[property] = value;
    let savedOrder;
    try {
      savedOrder = await order.save();
    } catch (error) {
      reject(error);
    }
    resolve(savedOrder);
  });
};

// @FUNC  deleteMakeOrder
// @TYPE  PROMISE
// @DESC  This function deletes the make order
// @ARGU
const deleteMakeOrder = _id => {
  return new Promise(async (resolve, reject) => {
    let print;
    let deletedPrint;

    try {
      print = await Make.findById(_id);
    } catch (error) {
      reject(error);
    }

    try {
      deletedPrint = await print.deleteOne();
    } catch (error) {
      reject(error);
    }

    resolve(deletedPrint);
  });
};

// @FUNC  deleteFile
// @TYPE  PROMISE
// @DESC  This function deletes a file based on the id
// @ARGU
const deleteFile = _id => {
  return new Promise(async (resolve, reject) => {
    let gridStore;
    try {
      gridStore = await GridFS.remove({ _id, root: "fs" });
    } catch (error) {
      reject(error);
    }

    resolve(gridStore);
  });
};

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
