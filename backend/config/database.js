const mongoose = require("mongoose");

const connectDB = async () => {
  // Retry Atlas connection up to 3 times before falling back
  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return; // success — exit
    } catch (err) {
      console.warn(`⚠️ Atlas attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 2000)); // wait 2s before retry
      }
    }
  }

  // Atlas exhausted — try local fallback once
  try {
    const localConn = await mongoose.connect("mongodb://127.0.0.1:27017/FamilyCafeKingDB", {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ Local MongoDB Connected: ${localConn.connection.host}`);
  } catch (localErr) {
    console.error(`❌ All database connections failed. Server cannot start without a database.`);
    throw new Error("Unable to connect to any MongoDB instance");
  }
};

module.exports = connectDB;