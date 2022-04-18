const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (Object.keys(MIME_TYPES).indexOf(file.mimetype) == -1) {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
}).single("image");
