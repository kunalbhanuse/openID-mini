import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  const token = jwt.sign({ userId: payload._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

export { generateToken };
