import Movie from '../models/Movie';
import express from 'express';
import Slide from '../models/Slide';

const home = express.Router({ mergeParams: true });





home.get('/', async (req, res) => {
    const homeMovies = await Slide.find().populate({ path: 'movie', model: Movie });

    const carousel = homeMovies.map((hm) => {
        return {
            tmdb_id: hm.movie?.tmdb_id,
            name: hm.movie?.name,
            background_url: hm.movie?.background_url,
            description: hm.movie?.description,
            logo_url: hm.movie?.logo_url
        }
    })

    // const carousel = await Promise.all(homeMovies.map(async (hm) => {
    //     const movie = await Movie.findById({ _id: hm })
    //     return { tmdb_id: movie?.tmdb_id, name: movie?.name, background_url: movie?.background_url, description: movie?.description, logo_url: movie?.logo_url }
    // }));

    res.json({ carousel });
    return;
});

export default home;