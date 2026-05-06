import { Router } from "express";
const userRout = Router();
import * as controller from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

userRout.post("/signUp", controller.signUp);
userRout.post("/login", controller.login);
userRout.post("/logout", controller.logout);
userRout.get("/me", authMiddleware, controller.me);
userRout.get("/loginPage", (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const redirect = req.query.redirect ? `?redirect=${encodeURIComponent(req.query.redirect)}` : "";
  return res.redirect(`${frontendUrl}/login${redirect}`);
});

export default userRout;
