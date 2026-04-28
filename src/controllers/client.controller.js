import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Client from "../models/client.model.js";
import crypto from "crypto";
const signUp = async (req, res) => {
  try {
    const { name, redirectUris } = req.body;
    const existingUser = await Client.findOne({ name });
    if (existingUser) {
      throw ApiError.badRequest("Client already exits");
    }
    const clientId = crypto.randomBytes(16).toString("hex");
    const clientSecret = crypto.randomBytes(32).toString("hex");

    const client = await Client.create({
      name,
      clientId,
      clientSecret,
      redirectUris,
    });
    return ApiResponse.created(res, "Cleint registerd succefully ", {
      clientId,
      clientSecret,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};
const registerClientPage = (req, res) => {
  res.render("client-register", {
    clientId: null,
    clientSecret: null,
  });
};

export { signUp, registerClientPage };
