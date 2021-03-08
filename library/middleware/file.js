const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (imageTypes.includes(file.mimetype)) {
      cb(null, 'public/imgFiles');

    } else {
      cb(null, 'public/booksFiles');
    }
  },
  filename(req, file, cb) {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`)
  }
});

const imageTypes = ['image/png', 'image/jpg', 'image/jpeg'];
const bookTypes = ['application/pdf'];
const allowedTypes = bookTypes.concat(imageTypes);

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
};

module.exports = multer({
  storage, fileFilter
});