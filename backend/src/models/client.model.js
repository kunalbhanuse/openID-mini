import mongoose from "mongoose";
import bcrypt from "bcrypt";
const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      unique: true,
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    redirectUris: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

clientSchema.pre("save", async function () {
  if (!this.isModified("clientSecret")) return;
  this.clientSecret = await bcrypt.hash(this.clientSecret, 10);
});

export default mongoose.model("Client", clientSchema);
