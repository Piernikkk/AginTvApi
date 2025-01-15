import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import movies from './routes/movies';

const app = express();

const httpServer = createServer(app);

mongoose.connect('mongodb://localhost/aginTV');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
    res.json({name: 'AginTvApi', version: '0.0.1'});
});

app.use('/movies', movies);



httpServer.listen(42070);