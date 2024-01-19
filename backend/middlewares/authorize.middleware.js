const User = require("../models/user.model");

const authorize = () => {
  return async (req, res, next) => {
    const { username } = req.user;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(403).json({ message: "Forbidden: User not found" });
      }

      const userRole = user.role;
      console.log(userRole);

      if (userRole == "admin") {
        return res.redirect("/users/admin-profile");
      } else if (userRole == "author") {
        return res.redirect("/users/author-profile");
      } else {
        return res.redirect("/users/profile");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = authorize;
