import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export const upload = multer({ 
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});