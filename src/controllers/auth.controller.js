import Client from "../models/client.model.js";
import ApiError from "../utils/ApiError.js";
import crypto from "crypto";
import AuthCode from "../models/auth.model.js";
import bcrypt from "bcrypt";
import { generateIdToken, generateToken } from "../utils/jwt.utils.js";

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
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const consentUrl = new URL("/consent", frontendUrl);
    consentUrl.searchParams.set("client_id", client_id);
    consentUrl.searchParams.set("redirect_uri", redirect_uri);
    consentUrl.searchParams.set("client_name", existingClient.name);
    consentUrl.searchParams.set("user_name", user.name);
    consentUrl.searchParams.set("scope", scopes.join(" "));
    if (state) consentUrl.searchParams.set("state", state);

    return res.redirect(consentUrl.toString());
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

    const existingClient = await Client.findOne({ clientId: client_id });
    if (!existingClient) {
      throw ApiError.unauthorized("Invalid client");
    }

    if (!existingClient.redirectUris.includes(redirect_uri)) {
      throw ApiError.unauthorized("Invalid redirect URI");
    }

    const url = new URL(redirect_uri);
    if (state) url.searchParams.append("state", state);

    if (decision !== "allow") {
      url.searchParams.append("error", "access_denied");
      return res.redirect(url.toString());
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

    url.searchParams.append("code", code);

    return res.redirect(url.toString());
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

const token = async (req, res) => {
  try {
    const { code, client_id, client_secret, redirect_uri } = req.body;

    if (!code || !client_id || !client_secret || !redirect_uri) {
      throw ApiError.badRequest("code, client_id, client_secret and redirect_uri are required");
    }

    const validCode = await AuthCode.findOne({ code }).populate("userId");

    if (!validCode) {
      throw ApiError.badRequest("Invalid code");
    }

    if (validCode.expiresAt < new Date()) {
      await AuthCode.deleteOne({ code });
      throw ApiError.badRequest("Authorization code expired");
    }

    if (validCode.clientId !== client_id) {
      throw ApiError.unauthorized("Client mismatch");
    }

    if (validCode.redirectUri !== redirect_uri) {
      throw ApiError.unauthorized("Redirect URI mismatch");
    }

    const client = await Client.findOne({ clientId: client_id });
    if (!client) {
      throw ApiError.unauthorized("Invalid client");
    }

    const secretMatches = await bcrypt.compare(client_secret, client.clientSecret);
    if (!secretMatches) {
      throw ApiError.unauthorized("Invalid client secret");
    }

    const accessToken = await generateToken(validCode.userId);
    const idToken = generateIdToken({ user: validCode.userId, clientId: client_id });

    await AuthCode.deleteOne({ code });

    return res.json({
      access_token: accessToken,
      id_token: idToken,
      token_type: "Bearer",
      expires_in: 3600,
      scope: validCode.scope,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

const userInfo = (req, res) => {
  return res.json({
    sub: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
};

export { authorize, consent, token, userInfo };
