const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const logRequestToFile = require("./middlewares/logger.middleware");
const authenticateUser = require("./middlewares/auth.middleware");
const handleErrors = require("./middlewares/error.middleware");
const enableCORS = require("./middlewares/cors.middleware");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const morgan = require("morgan");
const passport = require("passport");
dotenv.config();
const session = require("express-session");
const blogPostRoutes = require("./routes/blog.routes");
const app = express();

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.use(enableCORS);
app.use(cookieParser());

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
app.get("/", (req, res) => {
  res.send("ok");
});

app.use(
  session({
    secret: "yourSessionSecret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.get(
  "/auth/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.use("/users", userRoutes);
app.use("/api/auth/user", authRoutes);

app.use("/blog", authenticateUser.authenticateToken, blogPostRoutes);

app.use(handleErrors);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
