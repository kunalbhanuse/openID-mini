import * as controller from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Router } from "express";
const authRoute = Router();

authRoute.get("/authorize", authMiddleware, controller.authorize);

export default authRoute;
