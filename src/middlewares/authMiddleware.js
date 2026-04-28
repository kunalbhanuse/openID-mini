import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      token = header.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    } else {
      return res.redirect(
        `/o/user/loginPage?redirect=${encodeURIComponent(req.originalUrl)}`,
      );
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODE:-", decode);

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      throw ApiError.unauthorized("User not Found");
    }

    console.log("user:-", user);
    req.user = user;
    next();
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || "Invalid or expired token",
    });
  }
};

export { authMiddleware };
