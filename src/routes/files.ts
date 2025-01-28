import express from 'express';
import upload from '../functions/uploader';
import multer from 'multer';
import fs from 'fs';

const files = express.Router({ mergeParams: true });

files.post('/upload', upload.single("file"), async (req, res) => {
    console.log('jjao');


    const fileData = {
        path: req?.file?.path,
        originalName: req?.file?.originalname,
    }

    res.json(fileData);
});

export default files;