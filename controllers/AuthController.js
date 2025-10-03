const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");
const User = require("../models/User");
exports.LOGIN = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // user find karo by username OR email
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user) {
      return res.json({ message: "Invalid Login Credentials", User: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Invalid Login Credentials", User: false });
    }

    // password return na karo
    const { password: pwd, ...userData } = user._doc;

    res.json({
      message: "Login Successful",
      User: userData,
      isLoggedIn: true,
      Role: userData.Role,
    });
  } catch (error) {
    next(error);
  }
};
exports.REGISTER = [
  check("profileImage").isURL().withMessage("Profile image submit error"),
  check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long")
    .isAlpha()
    .withMessage("First name must be alphabetic"),
  check("lastName").isAlpha().withMessage("Last name must be alphabetic"),
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Username must not contain special characters"),
  check("email")
    .isEmail()
    .withMessage("Wrong email format")
    .notEmpty()
    .withMessage("Email is Required"),
  check("phone")
    .isMobilePhone()
    .withMessage("Wrong phone number format")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits long"),
  check("DateOfBirth").isDate().withMessage("Wrong date format"),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
    )
    .notEmpty()
    .withMessage("Password is required "),
  check("Terms")
    .custom((value) => value === true || value === "true")
    .withMessage("Terms and conditions must be accepted")
    .notEmpty()
    .withMessage("Terms and conditions must be accepted"),
  (req, res, next) => {
    const {
      profileImage,
      firstName,
      lastName,
      username,
      email,
      phone,
      DateOfBirth,
      password,
      Terms,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        message: "Validation Error",
        errorMessages: errors.array().map((error) => error.msg),
        oldInput: {
          profileImage,
          firstName,
          lastName,
          username,
          email,
          phone,
          DateOfBirth,
          password,
          Terms,
        },
      });
    }
    bcrypt
      .hash(password, 12)
      .then((hasedPassword) => {
        const user = new User({
          profileImage,
          firstName,
          lastName,
          username,
          email,
          phone,
          DateOfBirth,
          password: hasedPassword,
          Terms,
        });
        return user.save();
      })
      .then(() => {
        res.json({ message: "User Created Successfully" });
      })
      .catch((error) => {
        res.json({ message: "User Creation Failed", error: error.message });
      });
  },
];

exports.LOGOUT = (req, res, next) => {
  console.log(req.body);
  res.json({ message: "Logout" });
};

exports.FORGET_PASSWORD = (req, res, next) => {
  console.log(req.body);
  res.json({ message: "Logout" });
};
