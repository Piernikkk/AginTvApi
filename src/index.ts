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
import withAuth from './functions/withAuth';
import { TMDB } from './constants/tmdb';


dotenv.config();

const app = express();

const httpServer = createServer(app);

mongoose.connect(process.env.DATABASE_URI ?? 'mongodb://localhost:27017/aginTV');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Replace with your frontend URL
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
//     credentials: true
// }));

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: false
}));

// app.options('*', cors());

app.get('/', async (req, res) => {
    res.json({ name: 'AginTvApi', version: '0.0.1' });
});

app.use('/movies', movies);

app.use('/home', home);

app.use('/user', user);

app.use('/files', files);

app.use('/collections', collections);


app.get('/search', withAuth, async (req, res): Promise<void> => {
    const { query } = req?.query;
    if (!query) {
        res.status(400).json({ error: 'Query is missing' });
        return;
    }
    const search = await TMDB.get(`https://api.themoviedb.org/3/search/multi`, { params: { query } });
    const response = search.data?.results?.map((d: any) => {
        return ({
            tv: d?.media_type == 'tv',
            name: d?.media_type == 'tv' ? d?.name : d?.title,
            original_name: d?.original_name,
            description: d?.overview,
            vertical_cover_url: 'https://image.tmdb.org/t/p/original' + d?.poster_path,
            horizontal_cover_url: 'https://image.tmdb.org/t/p/original' + d?.backdrop_path,
            tmdb_id: `${d?.media_type == 'tv' ? 't' : 'm'}${d?.id}`

        })
    })
    res.json(response);
});



httpServer.listen(process.env.PORT ?? 42070);