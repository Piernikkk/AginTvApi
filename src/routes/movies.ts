import express from 'express';
import Movie from './../models/Movie';
import addMovieFromTMDB from '../functions/addMovie';
import episodes from './episodes';
import withAuth, { withAuthParams } from '../functions/withAuth';

const movies = express.Router({ mergeParams: true });

export interface MovieParams extends withAuthParams {
    movieID: string,
}

movies.use('/:movieID/episodes', episodes);

movies.use('/:movieID', withAuth, (req: express.Request<MovieParams>, res, next) => {
    const { movieID } = req?.params;
    if (['t', 'm'].includes(movieID[0])) return next();
    res.status(400).json({ error: 'ID is invalid' });
});


movies.get('/:movieID', withAuth, async (req: express.Request<MovieParams>, res) => {
    const { movieID } = req?.params;
    const sources = req.query?.sources == 'true';
    const refresh = req.query?.refresh == 'true';
    if (refresh) {
        await addMovieFromTMDB({ movieID, res });
        return;
    }

    const database = sources ? await Movie.findOne({ tmdb_id: movieID }).populate({ path: 'episodes', populate: { path: 'sources', model: 'File' } }).populate('genres') : await Movie.findOne({ tmdb_id: movieID }).populate('episodes').populate('genres')

    if (database == null) {
        await addMovieFromTMDB({ movieID, res });
        return;
    }

    res.json(database);
    return;
});

export default movies;