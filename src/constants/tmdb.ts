import axios from "axios";
import 'dotenv/config'


export const TMDB = axios.create({
        baseURL: `https://api.themoviedb.org/3`,
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_KEY}`
          }
    })