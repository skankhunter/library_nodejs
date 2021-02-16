const multer = require('multer')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log('123123')
    cb(null, 'public/booksFiles')
  },
  filename(req, file, cb) {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}${file.mimetype}`)
  }
});

const allowedTypes = ['application/pdf'];

const fileFilter = (req, file, cb) => {
    console.log(file)
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
};

module.exports = multer({
  storage, fileFilter
});