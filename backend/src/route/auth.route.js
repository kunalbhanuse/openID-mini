import * as controller from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Router } from "express";
const authRoute = Router();

authRoute.get("/.well-known/openid-configuration", controller.openIdConfiguration);
authRoute.get("/.well-known/jwks.json", controller.jwks);
authRoute.get("/authorize", authMiddleware, controller.authorize);
authRoute.post("/consent", authMiddleware, controller.consent);
authRoute.post("/token", controller.token);
authRoute.get("/userinfo", authMiddleware, controller.userInfo);

export default authRoute;
