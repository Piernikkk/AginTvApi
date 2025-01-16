import Episode from '../models/Episode';
import express, { Request } from 'express';
import { MovieParams } from './movies';

const episodes = express.Router({ mergeParams: true });

export interface EpisodeParams extends MovieParams {
    episodeID: string,
}

episodes.get('/:episodeID', async (req: Request<EpisodeParams>, res) => {
    const { movieID, episodeID } = req?.params;

    const tmp = episodeID.split(',');
    const season = tmp[0];
    const episode = tmp[1];

    const episodeData = await Episode.findOne({ tmdb_movie_id: movieID, episode, season })

    if (episodeData == null) {
        res.status(404).json({ error: `Episode not found or doesn't exist in the database` });
        return;
    }

    res.json(episodeData);
    return;
});

export default episodes;