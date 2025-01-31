import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import movies from './routes/movies';
import home from './routes/home';
import user from './routes/user';
import files from './routes/files';
import collections from './routes/collections';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const httpServer = createServer(app);

mongoose.connect(process.env.DATABASE_URI ?? 'mongodb://localhost/aginTV');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.options('*', (req, res) => {
    res.sendStatus(200);
});

app.get('/', async (req, res) => {
    res.json({ name: 'AginTvApi', version: '0.0.1' });
});

app.use('/movies', movies);

app.use('/home', home);

app.use('/user', user);

app.use('/files', files);

app.use('/collections', collections);



httpServer.listen(process.env.PORT ?? 42070);