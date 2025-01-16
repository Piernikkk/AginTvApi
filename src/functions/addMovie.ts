import { Response } from "express";
import { TMDB } from "../constants/tmdb"
import Episode from "../models/Episode";
import { Types } from "mongoose";
import Movie from "../models/Movie";
import Genre from "../models/Genre";



export type addMovieProps = {
    movieID: String,
    res: Response<any, Record<string, any>>
}

export type getEpisodeProps ={
    movieID: String,
    tmdbData: any,
}

async function getEpisodes({movieID, tmdbData}: getEpisodeProps){
    const episodeIDs : Types.ObjectId[] = [];

    await Promise.all(tmdbData?.data?.seasons?.map(async (s: any) => {
        const season = await TMDB.get(`/tv/${movieID.substring(1)}/season/${s.season_number}`);
        return await Promise.all(season?.data?.episodes?.map(async (e : any) => {
            const episode = await Episode.findOneAndUpdate({tmdb_movie_id: movieID, season: e.season_number, episode: e?.episode_number}, {
                name: e?.name,
                description: e?.overview,
                air_date: new Date(e?.air_date),
                cover_url: e?.still_path,
                duration: e?.runtime,
            }, { upsert: true, returnDocument: 'after' });
            
            episodeIDs.push(episode._id);
        }));
    }))
    
    return episodeIDs;
    
}

async function getGenres({tmdbData}: any){
    const genres = await Promise.all(tmdbData?.data?.genres?.map(async (g: {id: number, name: String}) => {
        const databaseGenre = await Genre.findOneAndUpdate({tmdb_id: g?.id}, {name: g?.name},  { upsert: true, returnDocument: 'after' });
        return databaseGenre?._id;
    }))

    return genres;    
}

export default async function addMovieFromTMDB({movieID, res}: addMovieProps){
    const isTV = movieID[0] == 't';
    const tmdbData = await TMDB.get(`/${isTV ? 'tv' : 'movie'}/${movieID.substring(1)}`, { params: { append_to_response: 'keywords,images' } }).catch(() => null );

    if(tmdbData == null){
        return res.status(404).json({error: 'Invalid ID'});
    }

    const horizontal_cover_url = 'https://image.tmdb.org/t/p/original' +(tmdbData?.data?.images?.backdrops?.find((b : any) => b.iso_639_1 == 'en')?.file_path || tmdbData?.data?.images?.backdrops?.find((b : any) => b.iso_639_1 == tmdbData?.data?.original_language)?.file_path || tmdbData?.data?.images?.backdrops?.find((b : any) => b.iso_639_1 == null)?.file_path || tmdbData?.data?.images?.backdrops[0]?.file_path)

    const logo_url = 'https://image.tmdb.org/t/p/original' + (tmdbData?.data?.images?.logos?.find((l : any) => l.iso_639_1 == 'en')?.file_path || tmdbData?.data?.images?.logos?.find((l : any) => l.iso_639_1 == tmdbData?.data?.original_language)?.file_path || tmdbData?.data?.images?.logos?.find((l : any) => l.iso_639_1 == null)?.file_path || tmdbData?.data?.images?.logos[0]?.file_path)

    let episodeIDs : Types.ObjectId[] = [];

    const genres = await getGenres({tmdbData});
    
    if(isTV){
        episodeIDs = await getEpisodes({movieID, tmdbData});
    }else{
        const episode = await Episode.findOneAndUpdate({
            season: 0,
            episode: 0,
            tmdb_movie_id: movieID,
        }, {}, { upsert: true, returnDocument: 'after' })
        episodeIDs = [episode._id];
    }

    const movie = await Movie.findOneAndUpdate({tmdb_id: movieID}, {
        name: isTV ? tmdbData?.data?.name : tmdbData?.data?.title,
        original_name: isTV ? tmdbData?.data?.original_name : tmdbData?.data?.original_title,
        description: tmdbData?.data?.overview,
        tv: isTV,
        air_date: isTV ? new Date(tmdbData?.data?.first_air_date) : new Date(tmdbData?.data?.release_date),
        vertical_cover_url: 'https://image.tmdb.org/t/p/original' + tmdbData?.data?.poster_path,
        horizontal_cover_url,
        background_url: 'https://image.tmdb.org/t/p/original' + tmdbData?.data?.backdrop_path,
        logo_url,
        genres,
        seasons: tmdbData?.data?.seasons?.map((s : any) => ({
            season_number: s?.season_number,
            name: s?.name,
            air_date: new Date(s?.air_date),
            description: s?.overview,
            vertical_cover_url: 'https://image.tmdb.org/t/p/original' + s?.poster_path
        })),
        episodes: episodeIDs,
    }, { upsert: true, returnDocument: 'after' }).populate('episodes').populate('genres');

    return res.json(movie);
    
}