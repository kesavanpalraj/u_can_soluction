import mongoose from "mongoose";
import readline from "readline";
import Admin from "../models/Admin.js";
import dotenv from "dotenv";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function resetPassword() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const admin = await Admin.findOne();
  if (!admin) {
    console.log("No admin found in database.");
    await mongoose.disconnect();
    rl.close();
    return;
  }

  console.log(`Current admin email: ${admin.email}`);
  const confirm = await ask(
    "Do you want to reset the password for this account? (y/N): "
  );
  if (confirm.toLowerCase() !== "y") {
    console.log("Reset cancelled.");
    await mongoose.disconnect();
    rl.close();
    return;
  }

  const password = await ask("Enter new admin password (min 6 chars): ");
  if (password.length < 6) {
    console.log("Password must be at least 6 characters.");
    await mongoose.disconnect();
    rl.close();
    return;
  }

  admin.password = password;
  await admin.save();
  console.log("Password reset successfully. You can now login with the new password.");

  await mongoose.disconnect();
  rl.close();
}

resetPassword().catch((err) => {
  console.error("Reset failed:", err);
  process.exit(1);
});
