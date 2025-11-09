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

// --- CORS Configuration ---
// Define the exact URLs of your client applications (frontend)
const allowedOrigins = [
  'http://localhost:5173', // Vite default dev server
  'http://localhost:3000', // Alternative local dev port
  'https://file-upload-i85r.vercel.app' // Your deployed frontend URL
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Important if you use cookies/sessions/authorization headers
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/files", fileRoutes);
app.use("/api/annotations", annotationRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
