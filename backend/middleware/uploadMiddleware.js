const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, `resume-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

function checkFileType(file, cb) {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Please upload a valid document (PDF, DOC, DOCX)!');
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, 
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('resume'); 

module.exports = upload;