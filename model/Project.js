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
  account: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, default: "" },
  thumbnail: { type: Schema.Types.ObjectId, undefined },
  bookmark: { type: Boolean, default: false },
  makes: { type: [Schema.Types.ObjectId], default: [] },
  date: {
    creation: { type: String, required: true },
    modified: { type: String, required: true }
  },
  notes: { type: String, default: "" }
});

/*=========================================================================================
STATIC
=========================================================================================*/

ProjectSchema.statics.create = function (account, options) {
  return new Promise(async (resolve, reject) => {
    // INITIALISE NEW PROJECT INSTANCE
    let project = new this();
    // SET PROPERTY VALUES
    // Account
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

/* ========================================================================================
METHOD
======================================================================================== */

/* ----------------------------------------------------------------------------------------
UPDATE
---------------------------------------------------------------------------------------- */

ProjectSchema.methods.updateThumbnail = function (thumbnail) {
  return new Promise(async (resolve, reject) => {
    // Delete Current Thumbnail
    try {
      await this.deleteThumbnail();
    } catch (error) {
      return reject(error);
    }
    // Update Thumbnail
    this.thumbnail = thumbnail;
    return resolve();
  })
}

ProjectSchema.methods.update = function (updates) {
  return new Promise(async (resolve, reject) => {
    // UPDATE THE PROJECT
    for (const property in updates) {
      if (property === "thumbnail") {
        if (updates[property] === undefined) {
          try {
            await this.deleteThumbnail();
          } catch (error) {
            return reject(error);
          }
        }
      } else {
        this[property] = updates[property];
      }
    }
    // Update Modified Date
    const date = moment().tz("Pacific/Auckland").format();
    this.date.modified = date;
    // SAVE THE UPDATES OF THE PROJECT INSTANCE
    return resolve();
  })
}

/* ----------------------------------------------------------------------------------------
DELETE
---------------------------------------------------------------------------------------- */

ProjectSchema.methods.deleteThumbnail = function () {
  return new Promise(async (resolve, reject) => {
    if (this.thumbnail) {
      try {
        await GridFS.remove({ _id: customer.picture, root: "fs" });
      } catch (error) {
        return reject(error);
      }
    }
    this.thumbnail = undefined;
    return resolve();
  })
}

/*=========================================================================================
EXPORT ACCOUNT MODEL
=========================================================================================*/

module.exports = Project = mongoose.model("projects", ProjectSchema);

/*=========================================================================================
END
=========================================================================================*/
