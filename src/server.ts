import express from "express";
import dotenv from "dotenv";
import fileRoutes from "./routes/fileRoutes"; // 2. Import our file routes
import { connectDB } from "./db/db";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// });

app.use("/api/files", fileRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
