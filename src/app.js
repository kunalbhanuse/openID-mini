import express from "express";
const app = express();
import userRout from "./route/user.route.js";
import clientRoute from "./route/client.route.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

app.use(express.json());
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

app.use("/o/user", userRout);
app.use("/o/client", clientRoute);

app.get("/health", (req, res) => {
  console.log("Health is ✅");
  res.json({ health: "ok" });
});
export { app };
