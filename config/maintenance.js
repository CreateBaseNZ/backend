/*=========================================================================================
EXPORT
=========================================================================================*/

module.exports = async () => {

  /*=======================================================================================
  REQUIRED MODULES
  =======================================================================================*/

  const moment = require("moment-timezone");

  /*=======================================================================================
  MODELS
  =======================================================================================*/

  const Account = require("../model/Account.js");
  const Chunk = require("../model/Chunk.js");
  const Comment = require("../model/Comment.js");
  const Customer = require("../model/Customer.js");
  const Discount = require("../model/Discount.js");
  const File = require("../model/File.js");
  const Image = require("../model/Image.js");
  const Mail = require("../model/Mail.js");
  const Make = require("../model/Make.js");
  const Order = require("../model/Order.js");
  const Project = require("../model/Project.js");
  const Session = require("../model/Session.js");
  const Transaction = require("../model/Transaction.js");

  /*=======================================================================================
  FUNCTIONS
  =======================================================================================*/

  // @func  deleteInactiveSessions
  // @desc  
  const deleteInactiveSessions = async () => {
    console.log("Deleting Inactive Sessions .....");
    let numberOfDeletedSessions = 0;
    let sessions;
    try {
      sessions = await Session.find();
    } catch (error) {
      return console.log(error);
    }
    const today = moment().tz("Pacific/Auckland").format("YYYY-MM-DD");
    const todayMoment = moment(today);
    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i];
      const visitedMoment = moment(session.date.visited);
      const differenceInDays = todayMoment.diff(visitedMoment, "days");
      if ((differenceInDays >= 7 && session.status !== "persistent") ||
        differenceInDays >= 28 && session.status === "persistent") {
        try {
          await Session.deleteOne({ _id: session._id });
        } catch (error) {
          return console.log(error);
        }
        numberOfDeletedSessions++;
      }
    }
    console.log(`Deleted ${numberOfDeletedSessions} Inactive Sessions .....`);
  }

  // @func  deleteDisownedActiveOrders
  // @desc  
  const deleteDisownedActiveOrders = async () => {
    console.log("Deleting Disowned Active Orders .....");
    let numberOfDeletedOrders = 0;
    // FETCH ALL ACCOUNTS, SESSIONS AND ORDERS
    let accounts, sessions, orders;
    const promises = [Account.find(), Session.find(), Order.find({ status: "created" })];
    try {
      [accounts, sessions, orders] = await Promise.all(promises);
    } catch (error) {
      return console.log(error);
    }
    // ITERATE
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const indexAccount = accounts.findIndex((account) => {
        return (String(order.accountId) === String(account._id));
      });
      const indexSession = sessions.findIndex((session) => {
        return (order.sessionId === session.sessionId);
      });
      if (indexAccount === -1 && indexSession === -1) {
        try {
          await Order.deleteOne({ _id: order._id });
        } catch (error) {
          return console.log(error);
        }
        numberOfDeletedOrders++;
      }
    }
    console.log(`Deleted ${numberOfDeletedOrders} Disowned Active Orders .....`);
  }

  // @func  deleteDisownedMakes
  // @desc  
  const deleteDisownedMakes = async () => {
    console.log("Deleting Disowned Makes .....");
    let numberOfDeletedMakes = 0;
    // FETCH ALL ACCOUNTS, SESSIONS AND MAKES
    let accounts, sessions, makes;
    const promises = [Account.find(), Session.find(), Make.find({ status: ["awaitingQuote", "checkout"] })];
    try {
      [accounts, sessions, makes] = await Promise.all(promises);
    } catch (error) {
      return console.log(error);
    }
    // ITERATE
    for (let i = 0; i < makes.length; i++) {
      const make = makes[i];
      const indexAccount = accounts.findIndex((account) => {
        return (String(make.accountId) === String(account._id));
      });
      const indexSession = sessions.findIndex((session) => {
        return (make.sessionId === session.sessionId);
      });
      if (indexAccount === -1 && indexSession === -1) {
        try {
          await Make.deleteOne({ _id: make._id });
        } catch (error) {
          return console.log(error);
        }
        numberOfDeletedMakes++;
      }
    }
    console.log(`Deleted ${numberOfDeletedMakes} Disowned Makes .....`);
  }

  // @func  deleteDisownedCustomerDetails
  // @desc  
  const deleteDisownedCustomerDetails = async () => {
    console.log("Deleting Disowned Customer Details .....");
    let numberOfDeletedCustomerDetails = 0;
    // FETCH ALL ACCOUNTS AND CUSTOMER DETAILS
    let accounts, customers;
    const promises = [Account.find(), Customer.find()];
    try {
      [accounts, customers] = await Promise.all(promises);
    } catch (error) {
      return console.log(error);
    }
    // ITERATE
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      const indexAccount = accounts.findIndex((account) => {
        return (String(customer.accountId) === String(account._id));
      });
      if (indexAccount === -1) {
        try {
          await Customer.deleteOne({ _id: customer._id });
        } catch (error) {
          return console.log(error);
        }
        numberOfDeletedCustomerDetails++;
      }
    }
    console.log(`Deleted ${numberOfDeletedCustomerDetails} Disowned Customer Details .....`);
  }

  // @func  deleteUnusedFiles
  // @desc  
  const deleteUnusedFiles = async () => {
    console.log("Deleting Unused Files .....");
    let numberOfDeletedFiles = 0;
    // FETCH ALL COMMENTS, CUSTOMER DETAILS, IMAGES, MAKES, PROJECTS AND FILES
    let comments, customers, images, makes, projects, files;
    const promises = [Comment.find(), Customer.find(), Image.find(), Make.find(), Project.find(), File.find()];
    try {
      [comments, customers, images, makes, projects, files] = await Promise.all(promises);
    } catch (error) {
      return console.log(error);
    }
    // ITERATE
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // COMMENT: ATTACHMENTS
      const indexComment = comments.findIndex((comment) => {
        const attachments = comment.attachments;
        const indexAttachment = attachments.findIndex((attachment) => {
          return (String(attachment) === String(file._id));
        })
        return (indexAttachment !== -1);
      });
      // CUSTOMER: PICTURE
      const indexCustomer = customers.findIndex((customer) => {
        return (String(customer.picture) === String(file._id));
      });
      // IMAGE: FILE: ID
      const indexImage = images.findIndex((image) => {
        return (String(image.file.id) === String(file._id));
      });
      // MAKE: FILE: ID
      const indexMake = makes.findIndex((make) => {
        return (String(make.file.id) === String(file._id));
      });
      // PROJECT: THUMBNAIL
      const indexProject = projects.findIndex((project) => {
        return (String(project.thumbnail) === String(file._id));
      });
      if (indexComment === -1 && indexCustomer === -1 && indexImage === -1
        && indexMake === -1 && indexProject === -1) {
        try {
          await File.deleteOne({ _id: file._id });
        } catch (error) {
          return console.log(error);
        }
        numberOfDeletedFiles++;
      }
    }
    console.log(`Deleted ${numberOfDeletedFiles} Unused Files .....`);
  }

  // @func  deleteUnusedFileChunks
  // @desc  
  const deleteUnusedFileChunks = async () => {
    console.log("Deleting Unused File Chunks .....");
    let numberOfDeletedFileChunks = 0;
    // FILES AND CHUNKS
    let files, chunks;
    const promises = [File.find(), Chunk.find()];
    try {
      [files, chunks] = await Promise.all(promises);
    } catch (error) {
      return console.log(error);
    }
    // ITERATE
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const index = files.findIndex((file) => {
        return (String(file._id) === String(chunk.files_id));
      });
      if (index === -1) {
        try {
          await Chunk.deleteOne({ files_id: chunk.files_id })
        } catch (error) {
          return console.log(error);
        }
        numberOfDeletedFileChunks++;
      }
    }
    console.log(`Deleted ${numberOfDeletedFileChunks} Unused File Chunks .....`);
  }

  // @func  deleteDisownedProjects
  // @desc  
  const deleteDisownedProjects = async () => {
    console.log("Deleting Disowned Projects .....");
    let numberOfDeletedProjects = 0;
    // FETCH ACCOUNTS AND PROJECTS
    let accounts, projects;
    const promises = [Account.find(), Project.find()];
    try {
      [accounts, projects] = await Promise.all(promises);
    } catch (error) {
      return console.log(error);
    }
    // ITERATE
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      const indexAccount = accounts.findIndex((account) => {
        return (String(project.account) === String(account._id));
      });
      if (indexAccount === -1) {
        try {
          await Project.deleteOne({ _id: project._id });
        } catch (error) {
          return console.log(error);
        }
        numberOfDeletedProjects++;
      }
    }
    console.log(`Deleted ${numberOfDeletedProjects} Disowned Projects .....`);
  }

  /*=======================================================================================
  INITIALISATION
  =======================================================================================*/

  console.log("Running Maintenance .....");
  deleteInactiveSessions();
  deleteDisownedActiveOrders();
  deleteDisownedMakes();
  deleteDisownedCustomerDetails();
  deleteUnusedFiles();
  deleteUnusedFileChunks();
  deleteDisownedProjects();

  /*=======================================================================================
  SET PERIODIC FUNCTION CALLS
  =======================================================================================*/

  const seconds = 0;
  const minutes = 0;
  const hours = 0;
  const days = 1;
  const period = (seconds * 1000) + (60 * minutes * 1000) + (60 * 60 * hours * 1000) + (24 * 60 * 60 * days * 1000);

  setInterval(() => {
    console.log("Running Maintenance .....");
    deleteInactiveSessions();
    deleteDisownedActiveOrders();
    deleteDisownedMakes();
    deleteDisownedCustomerDetails();
    deleteUnusedFiles();
    deleteUnusedFileChunks();
    deleteDisownedProjects();
  }, period);
}

/*=========================================================================================
END
=========================================================================================*/