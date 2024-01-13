s;
const handleErrors = (err, req, res, next) => {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ message: "Internal Server Error" });
};

module.exports = handleErrors;
