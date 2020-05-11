/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");
const moment = require("moment-timezone");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;

/*=========================================================================================
CREATE PROJECT MODEL
=========================================================================================*/

const ProjectSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  thumbnail: {
    type: Schema.Types.ObjectId
  },
  bookmark: {
    type: Boolean,
    default: false
  },
  makes: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  date: {
    creation: {
      type: String,
      required: true
    },
    modified: {
      type: String,
      required: true
    }
  },
  note: {
    type: String,
    default: ""
  }
});

/*=========================================================================================
STATIC
=========================================================================================*/

ProjectSchema.statics.create = function (account, name, options) {
  return new Promise(async (resolve, reject) => {
    // INITIALISE NEW PROJECT INSTANCE
    let project = new this();
    // SET PROPERTY VALUES
    // Account and name
    project.account = account;
    project.name = name;
    // Options
    for (const property in options) {
      project[property] = options[property];
    }
    // Dates
    const date = moment().tz("Pacific/Auckland").format();
    project.date.creation = date;
    project.date.modified = date;
    // SAVE THE NEW PROJECT INSTANCE
    try {
      await project.save();
    } catch (error) {
      reject(error);
      return;
    }
    resolve("success");
    return;
  })
}

ProjectSchema.statics.retrieve = function (account) {
  return new Promise(async (resolve, reject) => {
    // INITIALISE RETRIEVED PROJECT INSTANCE ARRAY
    let projects;
    try {
      projects = this.find({ account });
    } catch (error) {
      reject(error);
      return;
    }
    // RECREATE PROJECTS REMOVING SENSITIVE PROPERTIES
    const mappedProjects = projects.map((project) => {
      let mappedProject = {
        id: project._id,
        name: project.name,
        thumbnail: project.thumbnail,
        bookmark: project.bookmark,
        date: project.date,
        note: project.note
      };
      return mappedProject;
    })
    // RESOLVE AND RETURN THE MAPPED PROJECTS
    resolve(mappedProjects);
    return;
  })
}

/*=========================================================================================
METHOD
=========================================================================================*/

/*=========================================================================================
EXPORT ACCOUNT MODEL
=========================================================================================*/

module.exports = Project = mongoose.model("projects", ProjectSchema);

/*=========================================================================================
END
=========================================================================================*/
