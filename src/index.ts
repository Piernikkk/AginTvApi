import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import movies from './routes/movies';
import home from './routes/home';
import user from './routes/user';
import files from './routes/files';
import collections from './routes/collections';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();

const httpServer = createServer(app);

mongoose.connect(process.env.DATABASE_URI ?? 'mongodb://localhost/aginTV');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*', // Allow all origins. Change this to your frontend's origin in production.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true // Allow credentials if needed
}));
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