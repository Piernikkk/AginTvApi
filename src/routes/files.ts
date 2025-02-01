import express from 'express';
import upload, { MulterRequest } from '../functions/uploader';
import withAuth from '../functions/withAuth';
import FIleM from '../models/FIleM';
import Episode from '../models/Episode';
import Movie from '../models/Movie';
import Collections from '../models/Collections';
import fs from 'fs';

const files = express.Router({ mergeParams: true });

files.post('/upload', withAuth as unknown as express.RequestHandler, upload.single("file"), async (req: MulterRequest, res) => {
    if (!req?.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    const { is_public } = req.body;

    const fileData = {
        path: req?.file?.path,
        original_name: req?.file?.originalname,
        user: req.user._id,
        episode: req.episode._id,
        is_public: is_public === 'true',
    }

    const fileDatabase = await FIleM.create(fileData);
    const movie = await Movie.findOne({ tmdb_id: req.episode.tmdb_movie_id });
    await Episode.findByIdAndUpdate(req.episode._id, { $push: { sources: fileDatabase._id } });
    await Collections.findOneAndUpdate({ user: req.user._id, system_collection: 'library' }, { $addToSet: { movies: movie?._id } }, { upsert: true });

    res.json(fileData);
});

files.delete('/delete/:fileID', withAuth as unknown as express.RequestHandler, async (req, res) => {
    const file = await FIleM.findById(req.params.fileID);
    if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
    }

    if (file.user?._id?.toString() !== req.user._id.toString()) {
        res.status(403).json({ error: 'You don\'t have permissions to modify this files' });
        return;
    }

    // if (file.user != req.user._id) {
    //     res.status(403).json({ error: 'You don\'t have permissions to modify this files' });
    //     return;
    // }

    try {
        if (file.path) {
            fs.unlinkSync(file.path);
        } else {
            res.status(400).json({ error: 'File path is invalid' });
            return;
        }
    } catch (error) {
        console.log('Error deleting file', error);

    }

    await Episode.findByIdAndUpdate(file.episode?._id, { $pull: { sources: file._id } }, { returnDocument: 'after' });
    await Collections.findOneAndUpdate({ user: req.user._id, system_collection: 'library' }, { $pull: { movies: file.movie?._id } });
    await FIleM.findByIdAndDelete(file._id);
    res.sendStatus(204);
});

files.get('/stream/:fileID', async (req, res) => {
    try {
        const fileDoc = await FIleM.findById(req.params.fileID);
        if (!fileDoc) {
            res.status(404).json({ error: 'File not found' });
            return;
        }

        const filePath = fileDoc.path;
        if (!filePath) return;

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;

        const range = req.headers.range;
        if (!range) {
            res.status(416).send('Requires Range header');
            return;
        }

        const parts = range?.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        });

        const fileStream = fs.createReadStream(filePath, { start, end });
        fileStream.pipe(res);

    } catch (error) {
        res.status(500).json({ error: 'Error streaming file' });
    }
});

export default files;