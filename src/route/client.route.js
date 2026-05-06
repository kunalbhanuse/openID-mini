import * as controller from "../controllers/client.controller.js";
import { Router } from "express";
const clientRoute = Router();

clientRoute.post("/signUp", controller.signUp);
clientRoute.get("/register", (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  return res.redirect(`${frontendUrl}/clients`);
});

export default clientRoute;
