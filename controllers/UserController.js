const User = require('../models/User')
exports.HOME = (req, res, next) => {
  const pointsData = [
    {
      ICON: "AiOutlineEnvironment",
      TITLE: "Live Tracking",
      DESC: "Real time location tracking of endangered animals.",
    },
    {
      ICON: "BiBarChartSquare",
      TITLE: "Data & Insights",
      DESC: "Comprehensive data analysis for informed conservation efforts.",
    },
    {
      ICON: "AiOutlineSafety",
      TITLE: "Secure Monitoring",
      DESC: "Advanced security measures to protect animal data and locations.",
    },
  ];

  res.json({ pointsData });
}

exports.PROFILE = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId})
  const UserData ={
    profileImage: user.profileImage,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    isVerified: user.isVerified,
  }
  res.json({ UserData });
};

