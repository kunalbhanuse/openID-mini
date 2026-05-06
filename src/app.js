import express from "express";
const app = express();
import userRout from "./route/user.route.js";
import clientRoute from "./route/client.route.js";
import authRoute from "./route/auth.route.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import cookieParser from "cookie-parser";

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", frontendUrl);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

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
