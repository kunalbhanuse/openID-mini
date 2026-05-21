import jwt from "jsonwebtoken";
import { getIssuer, getKeyId, getPrivateKey } from "./oidc.utils.js";

const generateToken = (payload) => {
  const token = jwt.sign({ userId: payload._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

const generateIdToken = ({ user, clientId }) => {
  return jwt.sign(
    {
      iss: getIssuer(),
      sub: user._id.toString(),
      aud: clientId,
      email: user.email,
      name: user.name,
    },
    getPrivateKey(),
    {
      algorithm: "RS256",
      expiresIn: process.env.ID_TOKEN_EXPIRY || "1h",
      keyid: getKeyId(),
    },
  );
};

export { generateToken, generateIdToken };
