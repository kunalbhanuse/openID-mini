import "dotenv/config";
import http from "node:http";
import { app } from "./src/app.js";
import connectDB from "./src/config/db.js";
async function main() {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(process.env.PORT, () => {
      console.log(`Server is runnig in http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

main();
