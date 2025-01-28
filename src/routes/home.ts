import Movie from '../models/Movie';
import express from 'express';
import Slide from '../models/Slide';
import withAuth from '../functions/withAuth';
import Position from '../models/Position';
import Episode from '../models/Episode';

const home = express.Router({ mergeParams: true });

home.get('/', withAuth, async (req, res) => {
    const homeMovies = await Slide.find().populate({ path: 'movie', model: Movie });

    const carousel = homeMovies.map((hm) => {
        return {
            tmdb_id: hm.movie?.tmdb_id,
            name: hm.movie?.name,
            background_url: hm.movie?.background_url,
            description: hm.movie?.description,
            logo_url: hm.movie?.logo_url
        }
    });

    const user = req?.user;

    const continueWatching = await Position.find({ user: user?._id })
        .populate({ path: 'episode', model: Episode, select: '-__v -description -duration -_id -air_date' })
        .select('-__v -_id -user');

    res.json({ carousel, continueWatching });
    return;
});

export default home;