/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const mongoAtlasURI = require("./database.js").mongoAtlasURI;

/*=========================================================================================
SETUP UPLOAD
=========================================================================================*/

const storage = new GridFsStorage({
  url: mongoAtlasURI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  file: (req, file) => {
    return {
      filename: file.originalname,
      contentType: file.mimetype,
      metadata: {
        encoding: file.encoding
      }
    };
  }
});

const upload = multer({ storage });

/*=========================================================================================
EXPORT UPLOAD
=========================================================================================*/

module.exports = upload;

/*=========================================================================================
END
=========================================================================================*/