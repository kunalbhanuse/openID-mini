import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  const token = jwt.sign({ userId: payload._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

const generateIdToken = ({ user, clientId }) => {
  return jwt.sign(
    {
      iss: process.env.ISSUER || "http://localhost:8000",
      sub: user._id.toString(),
      aud: clientId,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ID_TOKEN_EXPIRY || "1h",
    },
  );
};

export { generateToken, generateIdToken };
