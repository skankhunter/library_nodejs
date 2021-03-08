const fs = require("fs");
const os = require("os");

module.exports = (req, res, next) => {
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const { method, url } = req;
  const userAgent = req.get("user-agent");

  let data = `${hour}:${minutes}:${seconds} ${method}: ${url}user-agent: ${userAgent}`;

  fs.appendFile("server.log", data + os.EOL, (err) => {
    if (err) throw err;
  });
  next();
};