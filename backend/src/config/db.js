import mongoose from "mongoose";

async function connectDB() {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `mongodb connected succefully at :- ${mongoose.connection.name}`,
    );
    return db;
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
}

export default connectDB;
