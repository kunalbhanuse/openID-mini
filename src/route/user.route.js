import { Router } from "express";
const userRout = Router();
import * as controller from "../controllers/user.controller.js";

userRout.post("/signUp", controller.signUp);

export default userRout;
