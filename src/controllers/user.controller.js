import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.utils.js";
const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw ApiError.badRequest("All fields are required !");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.badRequest("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    return ApiResponse.created(res, "User register Succefully ", user);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw ApiError.badRequest("Email and password are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound("User does not exits with this email");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw ApiError.badRequest("Invalid email or password");
  }

  const token = await generateToken(user);

  return ApiResponse.ok(res, "Login Succefull ", { token });
};
export { signUp, login };
