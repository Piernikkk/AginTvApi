import express from 'express';
import upload from '../functions/uploader';

const files = express.Router({ mergeParams: true });

files.post('/upload', upload.single("file"), async (req, res) => {
    if (!req?.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    const fileData = {
        path: req?.file?.path,
        originalName: req?.file?.originalname,
    }

    res.json(fileData);
});

export default files;