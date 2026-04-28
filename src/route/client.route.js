import * as controller from "../controllers/client.controller.js";
import { Router } from "express";
const clientRoute = Router();

clientRoute.post("/signUp", controller.signUp);
clientRoute.get("/register", controller.registerClientPage);

export default clientRoute;
