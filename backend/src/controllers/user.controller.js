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
    const safeUser = user.toObject();
    delete safeUser.password;
    return ApiResponse.created(res, "User registered successfully", safeUser);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, redirect } = req.body;
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    if (redirect) {
      return res.redirect(redirect);
    }
    return ApiResponse.ok(res, "Login successful", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).send(error.message);
  }
};
const me = (req, res) => {
  return ApiResponse.ok(res, "Current user", req.user);
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return ApiResponse.ok(res, "Logged out successfully");
};

export { signUp, login, me, logout };
