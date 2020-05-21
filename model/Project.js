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
    default: ""
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
  notes: {
    type: String,
    default: ""
  }
});

/*=========================================================================================
STATIC
=========================================================================================*/

ProjectSchema.statics.create = function (account, options) {
  return new Promise(async (resolve, reject) => {
    // INITIALISE NEW PROJECT INSTANCE
    let project = new this();
    // SET PROPERTY VALUES
    // Account and name
    project.account = account;
    // Options
    for (const property in options) {
      project[property] = options[property];
    }
    // Dates
    const date = moment().tz("Pacific/Auckland").format();
    project.date.creation = date;
    project.date.modified = date;
    // SAVE THE NEW PROJECT INSTANCE
    let savedProject;
    try {
      savedProject = await project.save();
    } catch (error) {
      reject(error);
      return;
    }
    let mappedProject = {
      id: savedProject._id,
      name: savedProject.name,
      thumbnail: savedProject.thumbnail,
      bookmark: savedProject.bookmark,
      date: savedProject.date,
      notes: savedProject.notes,
      makes: savedProject.makes
    };
    resolve(mappedProject);
    return;
  })
}

ProjectSchema.statics.retrieve = function (account) {
  return new Promise(async (resolve, reject) => {
    // INITIALISE RETRIEVED PROJECT INSTANCE ARRAY
    let projects;
    try {
      projects = await this.find({ account });
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
        notes: project.notes,
        makes: project.makes
      };
      return mappedProject;
    })
    // RESOLVE AND RETURN THE MAPPED PROJECTS
    resolve(mappedProjects);
    return;
  })
}

ProjectSchema.statics.update = function (account, projectId, updates) {
  return new Promise(async (resolve, reject) => {
    // FETCH THE PROJECT TO BE UPDATED
    let project;
    try {
      project = await this.findOne({ _id: projectId, account });
    } catch (error) {
      reject(error);
      return;
    }
    // VALIDATE THE PROJECT
    if (!project) {
      reject("no project found");
      return;
    }
    // UPDATE THE PROJECT
    for (const property in updates) {
      project[property] = updates[property];
    }
    // Update Modified Date
    const date = moment().tz("Pacific/Auckland").format();
    project.date.modified = date;
    // SAVE THE UPDATES OF THE PROJECT INSTANCE
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
