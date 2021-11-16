// MODULES ==================================================

// VARIABLES ================================================

// MODELS ===================================================

const Account = require("../model/Account.js");
const Class = require("../model/Class.js");
const Group = require("../model/Group.js");
const Job = require("../model/Job.js");
const License = require("../model/License.js");
const Mail = require("../model/Mail.js");
const Profile = require("../model/Profile.js");

// EXPORT ===================================================

module.exports = function (agenda) {
  require("./emails.js")(agenda);
};

// FUNCTIONS ================================================

// END ======================================================
