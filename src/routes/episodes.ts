import Episode, { EpisodeType } from '../models/Episode';
import express, { Request } from 'express';
import { MovieParams } from './movies';
import withAuth, { withAuthParams } from '@/functions/withAuth';

const episodes = express.Router({ mergeParams: true });

export interface EpisodeParams extends MovieParams {
    episodeID: string,
}

episodes.use('/:episodeID', withAuth, async (req: Request<EpisodeParams>, res, next) => {
    const { movieID, episodeID } = req?.params;

    const tmp = episodeID.split(',');
    const season = tmp[0];
    const episode = tmp[1];

    const episodeData = await Episode.findOne({ tmdb_movie_id: movieID, episode, season })

    if (episodeData == null || episodeData == undefined) {
        res.status(404).json({ error: `Episode not found or doesn't exist in the database` });
        return;
    }

    req.episode = episodeData as unknown as EpisodeType;
});

episodes.get('/:episodeID', withAuth, async (req: Request<EpisodeParams>, res) => {
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

episodes.patch('/:episodeID/position', async (req: Request<EpisodeParams>, res) => {
    const { movieID, } = req?.params;

});

export default episodes;