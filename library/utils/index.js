const fs = require("fs");
const path = require("path")

function getFileData(files, fileType) {
   const file = files[fileType] && files[fileType][0];

   return file
      ? {
           data: fs.readFileSync(
              path.join(__dirname, `/../public/${fileType}/`, file.filename)
           ),
           contentType: file.mimetype,
        }
      : {};
}

module.exports = { getFileData };
