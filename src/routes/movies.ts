import express from 'express';
import Movie from './../models/Movie';
import addMovieFromTMDB from '../functions/addMovie';
import episodes from './episodes';

const movies = express.Router({ mergeParams: true });

export interface MovieParams {
    movieID: string,
}

movies.use('/:movieID/episodes', episodes);

movies.use('/:movieID', (req, res, next) => {
    const { movieID } = req?.params;
    if (['t', 'm'].includes(movieID[0])) return next();
    res.status(400).json({ error: 'ID is invalid' });
});


movies.get('/:movieID', async (req, res) => {
    const { movieID } = req?.params;
    const refresh = req.query?.refresh == 'true';
    if (refresh) {
        await addMovieFromTMDB({ movieID, res });
        return;
    }

    const database = await Movie.findOne({ tmdb_id: movieID }).populate('episodes').populate('genres');

    if (database == null) {
        await addMovieFromTMDB({ movieID, res });
        return;
    }

    res.json(database);
    return;
});

export default movies;