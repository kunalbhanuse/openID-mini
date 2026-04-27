import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Access Token Missing, Please Login First");
    }
    const token = header.split(" ")[1];
    if (!token) {
      throw ApiError.unauthorized("Access Token Missing");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODE:-", decode);

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      throw ApiError.unauthorized("User not Found");
    }
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
