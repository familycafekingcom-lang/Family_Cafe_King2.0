const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri && typeof mongoUri === "string" && mongoUri.trim().length > 0) {
    const MAX_RETRIES = 2;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 4000,
        });
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.warn(`⚠️ Atlas attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`);
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }
  }

  // Atlas exhausted or missing URI — try local fallback once
  try {
    const localConn = await mongoose.connect("mongodb://127.0.0.1:27017/FamilyCafeKingDB", {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ Local MongoDB Connected: ${localConn.connection.host}`);
  } catch {
    console.warn(`ℹ️ Database offline — Server running in hybrid memory/fallback mode for Admin API.`);
  }
};

module.exports = connectDB;