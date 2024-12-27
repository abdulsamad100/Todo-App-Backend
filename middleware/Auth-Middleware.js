const jwt = require("jsonwebtoken");
const { getFileData } = require("../utils/helper");

const authMiddleware = (req, res, next) => {
  try {  
    
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ message: "Token not found!" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const allUsers = getFileData("../files/user.json");
    
    const foundUser = allUsers.data.find((u) => u.id === payload.id);
    if (!foundUser) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    delete foundUser.password;
    req.user = foundUser;
    next();
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid token signature" });
    } else if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
    } else {
      res.status(400).json({ message: "An error occurred" }); // Generic error for other cases
    }
  }
};

module.exports=authMiddleware