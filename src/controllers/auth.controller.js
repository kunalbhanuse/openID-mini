import Client from "../models/client.model.js";
import ApiError from "../utils/ApiError.js";

const authorize = async (req, res) => {
  try {
    const { client_id, redirect_uri, scope, state } = req.query;
    if (!client_id || !redirect_uri) {
      throw ApiError.badRequest("Missing required parameters");
    }
    const existingClient = await Client.findOne({ clientId: client_id });
    if (!existingClient) {
      throw ApiError.unauthorized("Invalid client");
    }

    if (!existingClient.redirectUris.includes(redirect_uri)) {
      throw ApiError.unauthorized("Invalid redirect URI");
    }

    const user = req.user;

    const scopes = scope?.split(" ") || [];
    return res.render("consent", {
      userName: user.name,
      clientName: existingClient.name,
      scopes,
      client_id,
      redirect_uri,
      state,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export { authorize };
