import express from "express";
const app = express();
import userRout from "./route/user.route.js";

app.use(express.json());

app.use("/api/user", userRout);

app.get("/health", (req, res) => {
  console.log("Health is ✅");
  res.json({ health: "ok" });
});
export { app };
