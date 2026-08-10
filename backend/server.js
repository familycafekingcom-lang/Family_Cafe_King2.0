const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

connectDB().catch((err) => {
  console.warn("Notice: Initial DB connection attempt encountered issues:", err.message);
});


