import express from 'express';
import upload, { MulterRequest } from '../functions/uploader';
import withAuth from '../functions/withAuth';
import FIleM from '../models/FIleM';
import user from './user';
import Episode from '../models/Episode';

const files = express.Router({ mergeParams: true });

files.post('/upload', withAuth as unknown as express.RequestHandler, upload.single("file"), async (req: MulterRequest, res) => {
    if (!req?.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    const { tmbd_id } = req.body;

    console.log("movie", req.episode);


    const fileData = {
        path: req?.file?.path,
        originalName: req?.file?.originalname,
        user: req.user._id,
        episode: req.episode._id,
    }

    const fileDatabase = await FIleM.create(fileData);
    await Episode.findByIdAndUpdate(req.episode._id, { $push: { sources: { url: fileData.originalName } } });

    res.json(fileData);
});

export default files;