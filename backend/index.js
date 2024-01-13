const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const logRequestToFile = require("./middlewares/logger.middleware");
const authenticateUser = require("./middlewares/auth.middleware");
const handleErrors = require("./middlewares/error.middleware");
const enableCORS = require("./middlewares/cors.middleware");
const validateRequest = require("./middlewares/validation.middleware");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(enableCORS);
app.use(logRequestToFile);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const userRoutes = require("./routes/user.routes");
const blogPostRoutes = require("./routes/blogpost.routes");

app.use("/users", userRoutes);
app.use("/blogposts", authenticateUser, validateRequest, blogPostRoutes);

app.use(handleErrors);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
