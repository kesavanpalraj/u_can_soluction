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

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const existing = await Admin.findOne();
  if (existing) {
    const overwrite = await ask(
      `Admin already exists (${existing.email}). Overwrite? (y/N): `
    );
    if (overwrite.toLowerCase() !== "y") {
      console.log("Seed cancelled.");
      await mongoose.disconnect();
      rl.close();
      return;
    }
    await Admin.deleteMany({});
    console.log("Existing admin removed.");
  }

  const email = await ask("Enter admin email: ");
  const password = await ask("Enter admin password (min 6 chars): ");

  if (password.length < 6) {
    console.log("Password must be at least 6 characters.");
    await mongoose.disconnect();
    rl.close();
    return;
  }

  await Admin.create({ email, password });
  console.log(`Admin created: ${email}`);
  await mongoose.disconnect();
  rl.close();
}

seedAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
