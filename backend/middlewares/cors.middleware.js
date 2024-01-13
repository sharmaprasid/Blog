const enableCORS = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
};

module.exports = enableCORS;
