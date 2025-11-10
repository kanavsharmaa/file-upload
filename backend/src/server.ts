// @ts-nocheck
import express from "express";
import dotenv from "dotenv";
import fileRoutes from "./routes/fileRoutes";
import annotationRoutes from "./routes/annotationRoutes";
import cors from "cors";
import { connectDB } from "./db/db";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// --- CORS Configuration for Vercel ---
app.use(cors({ 
  origin: "*",
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Role'],
  credentials: true
}));

// Manual CORS headers for Vercel serverless functions
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

app.use("/api/files", fileRoutes);
app.use("/api/annotations", annotationRoutes);

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

export default app;