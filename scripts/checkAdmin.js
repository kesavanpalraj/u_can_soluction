import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import dotenv from "dotenv";
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const admin = await Admin.findOne();
  if (admin) {
    console.log("Admin exists:", admin.email);
  } else {
    console.log("No admin found. Run `node scripts/seedAdmin.js` to create one.");
  }
  await mongoose.disconnect();
}
check().catch((e) => { console.error(e); process.exit(1); });
