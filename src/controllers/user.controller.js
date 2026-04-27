import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
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

export { signUp };
