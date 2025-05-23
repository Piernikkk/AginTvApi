import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Movie from '../models/Movie';
import { Request } from 'express';
import Episode from '../models/Episode';
import addMovieFromTMDB from './addMovie';

export interface MulterRequest extends Request {
    episode?: any;
}

// TODO: change to actually supported file types
const allowedExtensions = ['.mp4', '.m4a', '.jpg', '.jpeg', '.png', '.gif', '.webp'];

const isMovieValid = (movieId: string): boolean => {
    return /^[a-zA-Z0-9_-]+$/.test(movieId);
};

const sanitizeFilename = (filename: string): string => {
    return filename
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
};

const isEpisodeInDatabase = async (movie_id: string, episode: number, season: number, cb: multer.FileFilterCallback) => {
    const data = await Episode.findOne({ tmdb_movie_id: movie_id, season, episode });

    return data;
}

const storage = multer.diskStorage({
    destination: async (req: MulterRequest, file, cb) => {
        const { movie_id, episode, season } = req.body;



        const baseUploadPath = path.resolve('uploads');
        const targetDir = path.join(baseUploadPath, movie_id);

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

const fileFilter = async (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const { movie_id, episode, season } = req.body;

    if (!movie_id || !isMovieValid(movie_id) || !episode || !season) {
        cb(new Error('Invalid movie or episode ID'));
        return;
    }

    let data = await isEpisodeInDatabase(movie_id, episode, season, cb);
    if (!data) {
        console.log(movie_id);

        await addMovieFromTMDB({ movieID: movie_id });
        data = await isEpisodeInDatabase(movie_id, episode, season, cb);
        if (!data) {
            cb(new Error('Episode not found'));
            return;
        }
    }
    req.episode = data;

    if (!file.mimetype.startsWith('video/')) {
        cb(new Error('Invalid file type'));
        return;
    }

    // const ext = path.extname(file.originalname).toLowerCase();
    // if (!allowedExtensions.includes(ext)) {
    //     cb(new Error('Invalid file type'));
    //     return;
    // }

    req.on('aborted', () => {
        file.stream.on('end', () => {
            console.log('Cancel the upload')
            cb(new Error('Cancel.'));
        });
        file.stream.emit('end');
    })
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        files: 1
    },

});

export default upload;