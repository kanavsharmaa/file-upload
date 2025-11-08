import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  uploadFile,
  uploadMultipleFiles,
  getAllFiles,
  getFileById,
} from "../controllers/fileController";

import { isAdmin, isUser } from "../middlewares/auth";

const router = Router();

router.get("/", isUser, getAllFiles);
router.get("/:fileId", isUser, getFileById);

router.post("/upload", isAdmin, upload.single("pdfFile"), uploadFile);

router.post(
  "/upload-bulk",
  isAdmin,
  upload.array("pdfFiles", 10),
  uploadMultipleFiles
);

export default router;
