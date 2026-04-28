import * as controller from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Router } from "express";
const authRoute = Router();

authRoute.get("/authorize", authMiddleware, controller.authorize);
authRoute.post("/consent", authMiddleware, controller.consent);
authRoute.post("/token", authMiddleware, controller.token);

export default authRoute;
