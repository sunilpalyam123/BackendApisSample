const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/profilePic"); // <-- save location
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName =
      "CLT@" +
      "_" +
      Date.now() +
      "_" +
      Math.round(Math.random() * 1e9) +
      ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;


// const multer = require("multer");
// const path = require("path");

// // Storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/images/profilePic"); // files save avvadam
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + "-" + uniqueName + path.extname(file.originalname));
//   }
// });

// // File filter (only images allowed)
// function fileFilter(req, file, cb) {
//   const allowedTypes = /jpeg|jpg|png|pdf/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images and pdfs are allowed"));
//   }
// }

// // Export multer instance
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
//   fileFilter: fileFilter
// });

// module.exports = upload;
