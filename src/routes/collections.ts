import express from 'express';
import Collections from '../models/Collections';
import withAuth, { withAuthParams } from '../functions/withAuth';
import Movie from '../models/Movie';
import { after } from 'node:test';

const collections = express.Router({ mergeParams: true });

export interface CollectionParams extends withAuthParams {
    collectionID: string,
}

collections.get('/system/:collectionID', withAuth, async (req: express.Request<CollectionParams>, res) => {
    const collection_id = req.params.collectionID;

    if (!collection_id) {
        res.status(400).json({ message: 'collection_id is required' });
        return;
    }

    const collection = await Collections.findOne({ system_collection: collection_id, user: req.user._id }).populate({ path: 'movies', populate: { path: 'genres', model: 'Genre' } });

    res.json(collection?.movies);
});

collections.patch('/system/:collectionID', withAuth, async (req: express.Request<CollectionParams>, res) => {
    const collection_id = req.params.collectionID;
    const { movie_id } = req.body;

    if (!collection_id || !movie_id) {
        res.status(400).json({ message: 'collection_id and movie_id is required' });
        return;
    }

    const movie = await Movie.findOne({ tmdb_id: movie_id });

    if (!movie) {
        res.status(404).json({ message: 'Movie not found' });
        return;
    }

    const collection = await Collections.findOneAndUpdate({ system_collection: collection_id, user: req.user._id }, { $addToSet: { movies: movie?._id } }, { upsert: true, returnDocument: 'after' }).populate({ path: 'movies', populate: { path: 'genres', model: 'Genre' } });
    console.log(collection);

    res.sendStatus(200);
});

export default collections;