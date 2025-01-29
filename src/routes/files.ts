import express from 'express';
import upload, { MulterRequest } from '../functions/uploader';
import withAuth from '../functions/withAuth';
import FIleM from '../models/FIleM';
import Episode from '../models/Episode';
import Movie from '../models/Movie';
import Collections from '../models/Collections';

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
    await Collections.findOneAndUpdate({ user: req.user._id, system_collection: 'files_library' }, { $push: { movies: movie?._id } }, { upsert: true });


    res.json(fileData);
});

export default files;