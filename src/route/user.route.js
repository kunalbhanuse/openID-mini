import { Router } from "express";
const userRout = Router();
import * as controller from "../controllers/user.controller.js";

userRout.post("/signUp", controller.signUp);
userRout.post("/login", controller.login);
userRout.get("/loginPage", controller.loginPage);

export default userRout;
