import { TMDB } from "../constants/tmdb"

export type addMovieProps = {
    movieID: String,
    refresh?: Boolean,
}

export default async function addMovie({movieID, refresh}: addMovieProps){
    const isTV = movieID[0] == 't';

    // const tmdbData = await TMDB.get(`/${isTV ? 'tv' : 'movie'}/${movieID.substring(1)}`);
    // console.log(tmdbData);

    console.log(process.env.TMDB_KEY);
    
    
}