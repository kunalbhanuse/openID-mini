import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Client from "../models/client.model.js";
import crypto from "crypto";
const signUp = async (req, res) => {
  try {
    const { name } = req.body;
    const redirectUris = Array.isArray(req.body.redirectUris)
      ? req.body.redirectUris
      : [req.body.redirectUris].filter(Boolean);

    if (!name || redirectUris.length === 0) {
      throw ApiError.badRequest("Client name and at least one redirect URI are required");
    }

    const existingUser = await Client.findOne({ name });
    if (existingUser) {
      throw ApiError.badRequest("Client already exits");
    }
    const clientId = crypto.randomBytes(16).toString("hex");
    const clientSecret = crypto.randomBytes(32).toString("hex");

    await Client.create({
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
export { signUp };
