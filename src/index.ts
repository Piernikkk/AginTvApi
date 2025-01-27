import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import movies from './routes/movies';
import home from './routes/home';
import user from './routes/user';

const app = express();

const httpServer = createServer(app);

mongoose.connect('mongodb://localhost/aginTV');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Adjust port as needed
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});


app.get('/', async (req, res) => {
    res.json({ name: 'AginTvApi', version: '0.0.1' });
});

app.use('/movies', movies);

app.use('/home', home);

app.use('/user', user);

httpServer.listen(42070);