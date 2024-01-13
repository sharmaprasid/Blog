const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "../logs");
const logFilePath = path.join(logDirectory, "app.log");


if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logRequestToFile = (req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;


  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });

  next();
};

module.exports = logRequestToFile;
