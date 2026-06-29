import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));

  if (collections.some(c => c.name === "admins")) {
    const admins = await db.collection("admins").find().toArray();
    console.log("\nAdmins collection:");
    admins.forEach(a => {
      console.log({
        email: a.email,
        password: a.password ? a.password.substring(0, 20) + "..." : "MISSING",
        _id: a._id.toString()
      });
    });
  } else {
    console.log("\nNo 'admins' collection found");
  }

  await mongoose.disconnect();
}
check().catch(e => { console.error(e); process.exit(1); });
