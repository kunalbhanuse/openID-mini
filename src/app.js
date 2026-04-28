import express from "express";
const app = express();
import userRout from "./route/user.route.js";
import clientRoute from "./route/client.route.js";
import authRoute from "./route/auth.route.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import cookieParser from "cookie-parser";

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

app.use("/o/user", userRout);
app.use("/o/client", clientRoute);
app.use("/", authRoute);

app.get("/health", (req, res) => {
  console.log("Health is ✅");
  res.json({ health: "ok" });
});
export { app };
