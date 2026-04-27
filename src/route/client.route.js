import * as controller from "../controllers/client.controller.js";
import { Router } from "express";
const clientRoute = Router();

clientRoute.post("/signUp", controller.signUp);

export default clientRoute;
