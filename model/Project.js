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

const Make = require("./Make.js");
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
    creation: { type: String, default: "" },
    modified: { type: String, default: "" }
  },
  notes: { type: String, default: "" }
});

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

ProjectSchema.pre("save", async function (next) {
  const date = moment().tz("Pacific/Auckland").format();
  // update the date modified property
  if (this.isModified()) this.date.modified = date;
  return next();
});

/*=========================================================================================
STATIC
=========================================================================================*/

// @FUNC  build
// @TYPE  STATICS
// @DESC  
ProjectSchema.statics.build = function (object = {}, withMakes = false, save = true) {
  return new Promise(async (resolve, reject) => {
    // CREATE THE PROJECT INSTANCE
    let project = new this(object);
    // SET PROPERTIES
    const date = moment().tz("Pacific/Auckland").format();
    project.date.creation = date;
    // SAVE PROJECT
    if (save) {
      try {
        project = await project.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    let formattedProject = project.toObject();
    // FETCH MAKES
    if (withMakes) {
      let makes = [];
      try {
        makes = await Make.fetch({ _id: formattedProject.makes });
      } catch (error) {
        return reject(error);
      }
      formattedProject.makes = makes;
    }
    // FILTER PROJECT
    let filteredProject = {
      id: formattedProject._id, name: formattedProject.name, thumbnail: formattedProject.thumbnail,
      bookmark: formattedProject.bookmark, date: formattedProject.date, makes: formattedProject.makes,
      notes: formattedProject.notes
    };
    // SUCCESS HANDLER
    return resolve(filteredProject);
  });
}

// @FUNC  fetch
// @TYPE  STATICS
// @DESC  
ProjectSchema.statics.fetch = function (query = {}, withMakes = false) {
  return new Promise(async (resolve, reject) => {
    // FETCH PROJECTS
    let projects;
    try {
      projects = await this.find(query);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    if (!projects.length) return resolve(projects);
    // CONVERT PROJECTS TO AN OBJECT
    let formattedProjects = [];
    for (let i = 0; i < projects.length; i++) formattedProjects[i] = projects[i].toObject();
    // FETCH MAKES
    if (withMakes) {
      let promises = [];
      for (let i = 0; i < formattedProjects.length; i++) {
        const project = formattedProjects[i];
        promises.push(Make.fetch({ _id: project.makes }));
      }
      let makesArray = [];
      try {
        makesArray = await Promise.all(promises);
      } catch (error) {
        return reject(error);
      }
      for (let j = 0; j < makesArray.length; j++) {
        const makes = makesArray[j];
        formattedProjects[j].makes = makes;
      }
    }
    // FILTER PROJECTS
    const filteredProjects = formattedProjects.map((project) => {
      let filteredProject = {
        id: project._id, name: project.name, thumbnail: project.thumbnail,
        bookmark: project.bookmark, date: project.date, notes: project.notes,
        makes: project.makes
      };
      return filteredProject;
    });
    // SUCCESS HANDLER
    return resolve(filteredProjects);
  });
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
