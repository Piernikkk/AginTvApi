import Movie from '../models/Movie';
import express from 'express';
import Slide from '../models/Slide';
import withAuth from '../functions/withAuth';
import Position, { TPosition } from '../models/Position';
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
            logo_url: hm.movie?.logo_url,
        }
    });

    const user = req?.user;

    const continueWatching = await Position.aggregate([
        // Match positions for the current user
        { $match: { user: user?._id } },
        // Sort by updatedAt descending
        // Lookup the Episode document
        {
            $lookup: {
                from: 'episodes',
                localField: 'episode',
                foreignField: '_id',
                as: 'episode'
            }
        },
        // Unwind the array to get a single Episode
        { $unwind: '$episode' },
        // Group by episode.tmdb_movie_id to ensure uniqueness
        {
            $group: {
                _id: '$episode.tmdb_movie_id',
                latestUpdate: { $max: "$updatedAt" }, // unique key
                doc: { $first: '$$ROOT' }       // take the latest (already sorted)
            }
        },
        { $sort: { latestUpdate: -1 } },
        // Replace root with the grouped doc
        { $replaceRoot: { newRoot: '$doc' } }
    ]);

    res.json({ carousel, continueWatching });
    return;
});

export default home;