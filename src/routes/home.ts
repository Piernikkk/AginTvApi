import Movie from '../models/Movie';
import express from 'express';

const home = express.Router({ mergeParams: true });

const homeMovies = [
    '67885fe9f317cdffc81adb40',
    '67886468f317cdffc81add03',
    '67886ed5f317cdffc81add04'
]

home.get('/', async (req, res) => {
    const carousel = await Promise.all(homeMovies.map(async (hm) => {
        const movie = await Movie.findById({ _id: hm })
        return { tmdv_id: movie?.tmdb_id, name: movie?.name, background_url: movie?.background_url, description: movie?.description, logo_url: movie?.logo_url }
    }));

    res.json({ carousel });
    return;
});

export default home;