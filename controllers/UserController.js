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