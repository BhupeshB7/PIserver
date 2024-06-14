// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//   // Get token from header
//   const token = req.header("x-auth-token");

//   // Check if token is missing
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Set user id from token in request object
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };
// const jwt = require("jsonwebtoken");

// const auth = (req, res, next) => {
//   // Get token from header
//   const token = req.header("Authorization");

//   // Check if token is missing
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

//     // Set user id from token in request object
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };
//Auth code
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if token is missing
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

    // Set user id from token in request object
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
