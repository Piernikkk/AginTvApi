import express from 'express';
import upload from '../functions/uploader';

const files = express.Router({ mergeParams: true });

files.post('/upload', upload.single("file"), async (req, res) => {
    const fileData = {
        path: req?.file?.path,
        originalName: req?.file?.originalname,
    }

    res.json(fileData);
});

export default files;