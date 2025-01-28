import multer from 'multer';
import fs from 'fs';
import path from 'path';

const allowedExtensions = ['.mp4', '.m4a', '.jpg', '.jpeg', '.png', '.gif', '.webp'];

const isMovieValid = (movieId: string): boolean => {
    return /^[a-zA-Z0-9_-]+$/.test(movieId);
};

const sanitizeFilename = (filename: string): string => {
    return filename
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const movieId = req.body.movie_id;

        console.log('movieId', movieId);

        if (!movieId || !isMovieValid(movieId)) {
            cb(new Error('Invalid project ID'), '');
            return;
        }

        const baseUploadPath = path.resolve('uploads');
        const targetDir = path.join(baseUploadPath, movieId);

        if (!targetDir.startsWith(baseUploadPath)) {
            cb(new Error('Invalid upload path'), '');
            return;
        }

        try {
            fs.mkdirSync(targetDir, { recursive: true });
            cb(null, targetDir);
        } catch (error) {
            console.error('Failed to create upload directory:', error);
            cb(new Error('Failed to create upload directory'), '');
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            cb(new Error('Invalid file type'), '');
            return;
        }

        const sanitizedName = sanitizeFilename(path.parse(file.originalname).name);
        const filename = `${sanitizedName}_${Date.now()}${ext}`;
        cb(null, filename);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    console.log('File filter called');

    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        cb(new Error('Invalid file type'));
        return;
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        files: 1
    }
});

export default upload;