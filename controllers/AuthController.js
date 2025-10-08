const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const SendVerificationEmail = require("../utils/SendEmail");
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
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
    // generate token
    const token = jwt.sign(
      { userId: user._id, role: user.Role },
      process.env.JWT_SECRETE,
      {
        expiresIn: "3h",
      },
    );
    res.json({
      message: "Login Successful",
      token,
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

/*exports.VERIFY = async (req, res, next) => {
  console.log(req.user);
  const user = await User.findOne({_id:req.user.userId});
  if(!user){
    return res.json({message:"User not found"})
  }
  console.log(user)
  const Email = user.email;
  const VerifyToken = crypto.randomBytes(32).toString("hex");
  user.VerifyToken = VerifyToken;
  user.TokenExpires = Date.now() + 1000 * 60 * 15;
  await user.save();

  const VerifyLink = `https://cdf5daf2-f3e3-4480-b69a-69923b47b49f-00-1usnewrxec5v9.sisko.replit.dev:3002/email-verification/${VerifyToken}`;
  await SendVerificationEmail(Email, VerifyLink);
  res.json({ message: "Verification Email Sent"});
};*/

exports.VERIFY = async (req, res, next) => {
  try {
    // Find user by ID
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const Email = user.email;
    // Generate verification token
    const VerifyToken = crypto.randomBytes(32).toString("hex");
    // Hash the token for added security
    user.VerifyToken = crypto
      .createHash("sha256")
      .update(VerifyToken)
      .digest("hex");
    user.TokenExpires = Date.now() + 1000 * 60 * 15; // Token expiration time (15 minutes)

    // Save the user with the updated token and expiration time
    await user.save();

    // Construct the verification link
    const VerifyLink = `${process.env.BASE_URL}/email-verification/${VerifyToken}`;

    // Send the verification email
    await SendVerificationEmail(Email, VerifyLink);

    // Send a response to the client
    res.json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Error during verification process:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.EMAIL_VERIFICATION = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }

    // Hash the received token (same method used when storing it)
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token and not expired
    const user = await User.findOne({
      VerifyToken: hashedToken,
      TokenExpires: { $gt: Date.now() }, // token not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.VerifyToken = undefined;
    user.TokenExpires = undefined;

    await user.save();

    return res.status(200).json({  message: "Email verified successfully!" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({  message: "Internal server error" });
  }
};
