const validateRequest = (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return res
      .status(400)
      .json({ message: "Bad Request: Missing required fields" });
  }

  next();
};

module.exports = validateRequest;
