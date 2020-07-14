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
EXTERNAL MODELS
=========================================================================================*/

const File = require("./File.js");
const Chunk = require("./Chunk.js");

/*=========================================================================================
CREATE PROJECT MODEL
=========================================================================================*/

const ProjectSchema = new Schema({
  account: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, default: "" },
  thumbnail: { type: Schema.Types.ObjectId, default: undefined },
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
    console.log(options)
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
    console.log(project);
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
    if (this.thumbnail) {
      try {
        await this.deleteThumbnail();
      } catch (error) {
        return reject(error);
      }
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
      if (property === "thumbnail" && this[property] !== undefined) {
        try {
          await this.deleteThumbnail();
        } catch (error) {
          return reject(error);
        }
      }
      this[property] = updates[property];
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
        await File.deleteOne({ _id: this.thumbnail });
      } catch (error) {
        return reject({ status: "error", content: error });
      }
      try {
        await Chunk.deleteMany({ files_id: this.thumbnail });
      } catch (error) {
        return reject({ status: "error", content: error });
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
