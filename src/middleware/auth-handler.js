// const jwt = require("jsonwebtoken");

// module.exports = (roles = []) => {
//   return (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader)
//       return res.status(401).json({ message: "No token provided" });

//     const token = authHeader.split(" ")[1];

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       if (roles.length && !roles.includes(decoded.role)) {
//         return res.status(403).json({ message: "Forbidden" });
//       }
//       req.user = decoded;
//       next();
//     } catch (err) {
//       return res.status(401).json({ message: "Invalid token" });
//     }
//   };
// };

//above code contain same logic but the code below is more clean

const jwt = require("jsonwebtoken");

module.exports = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (roles.length && !roles.includes(decoded.role))
      return res.status(403).json({ message: "Forbidden" });

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
