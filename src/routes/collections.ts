import express from 'express';
import Collections from '../models/Collections';
import withAuth, { withAuthParams } from '../functions/withAuth';

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

export default collections;