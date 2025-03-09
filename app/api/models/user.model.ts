import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String, required: true },
  role: { type: String, enum: ["admin", "user", "elder"], default: "user" },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
