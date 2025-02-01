import Episode, { TEpisode } from '../models/Episode';
import express, { Request } from 'express';
import { MovieParams } from './movies';
import withAuth from '../functions/withAuth';
import Position from '../models/Position';

const episodes = express.Router({ mergeParams: true });

export interface EpisodeParams extends MovieParams {
    episodeID: string,
}

episodes.use('/:episodeID', withAuth, async (req: Request<EpisodeParams>, res, next) => {
    const { movieID, episodeID } = req?.params;

    const tmp = episodeID.split(',');
    const season = tmp[0];
    const episode = tmp[1];

    if (!season || !episode) {
        res.status(400).json({ error: 'Invalid episode ID' });
        return;
    }

    const episodeData = await Episode.findOne({ tmdb_movie_id: movieID, episode, season }).populate({ path: 'sources', populate: { path: 'user', model: 'User', select: 'username' } });

    if (episodeData == null || episodeData == undefined) {
        res.status(404).json({ error: `Episode not found or doesn't exist in the database` });
        return;
    }

    req.episode = episodeData as unknown as TEpisode; episode

    next();
});

episodes.get('/:episodeID', withAuth, async (req: Request<EpisodeParams>, res) => {
    res.json(req.episode);
    return;
});

episodes.patch('/:episodeID/position', async (req: Request<EpisodeParams>, res) => {
    const { position, duration, link } = req?.body;

    if (position == null || duration == null || link == null) {
        res.status(400).json({ error: 'Missing required information' });
        return;
    }

    //TODO: add link validation

    const episode = req.episode;
    const user = req.user;

    await Position.findOneAndUpdate({ episode: episode?._id, user: user?._id }, { position, duration, link }, { upsert: true, returnDocument: 'after' })

    res.sendStatus(200);
    return;
});

episodes.get('/:episodeID/position', async (req: Request<EpisodeParams>, res) => {
    const episode = req.episode;
    const user = req.user;

    const position = await Position.findOne({ episode: episode?._id, user: user?._id });

    res.json(position);
    return;
});

export default episodes;