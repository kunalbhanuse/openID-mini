import Client from "../models/client.model.js";
import ApiError from "../utils/ApiError.js";
import crypto from "crypto";
import AuthCode from "../models/auth.model.js";
import { generateToken } from "../utils/jwt.utils.js";

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

const consent = async (req, res) => {
  try {
    const { decision, client_id, redirect_uri, state, scope } = req.body;
    const user = req.user;

    if (decision !== "allow") {
      return res.redirect(redirect_uri);
    }
    const code = crypto.randomBytes(16).toString("hex");

    const authCode = await AuthCode.create({
      code,
      clientId: client_id,
      userId: user._id,
      scope,
      redirectUri: redirect_uri,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
    console.log(authCode);

    const url = new URL(redirect_uri);
    url.searchParams.append("code", code);
    url.searchParams.append("state", state);

    return res.redirect(url.toString());
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

const token = async (req, res) => {
  const { code, client_id, client_secret, redirect_uri } = req.body;

  // 1. find code
  const validCode = await AuthCode.findOne({ code }).populate("userId");

  if (!validCode) {
    throw ApiError.badRequest("Invalid code");
  }

  // 2. check expiry

  // 3. validate client + redirect
  if (validCode.clientId !== client_id) {
    throw ApiError.unauthorized("Client mismatch");
  }

  if (validCode.redirectUri !== redirect_uri) {
    throw ApiError.unauthorized("Redirect URI mismatch");
  }

  // 4. (optional but important) validate client_secret
  // const client = await Client.findOne({ clientId: client_id })
  // compare secret here

  // 5. generate access token
  const accessToken = await generateToken(validCode.userId);

  // 6. delete code (single use)
  await AuthCode.deleteOne({ code });

  // 7. respond
  return res.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
  });
};

export { authorize, consent, token };
