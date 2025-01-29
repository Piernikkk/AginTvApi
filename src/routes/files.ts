import express from 'express';
import upload from '../functions/uploader';
import withAuth from '../functions/withAuth';
import FIleM from '../models/FIleM';

const files = express.Router({ mergeParams: true });

files.post('/upload', withAuth as unknown as express.RequestHandler, upload.single("file"), async (req, res) => {
    if (!req?.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    const fileData = {
        path: req?.file?.path,
        originalName: req?.file?.originalname,
    }

    FIleM.create(fileData);

    res.json(fileData);
});

export default files;