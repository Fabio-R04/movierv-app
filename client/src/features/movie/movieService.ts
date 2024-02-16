import axios from "axios";
import { IFavoriteMovie, IMovie, IMovieDetails, IMovieGenre, IMovieStats, ISerieH, MovieResults, SearchData, SearchResults, SortMovieResults } from "./movieInterfaces";
import { URL, getConfig } from "../../reuseable";
import { IPerson } from "../people/peopleInterfaces";

// GET
const getMovieGenres = async (): Promise<IMovieGenre[]> => {
    const response = await axios.get(`${URL}/movie/genres`);
    return response.data;
}

const getTrendingSeries = async (): Promise<ISerieH[]> => {
    const response = await axios.get(`${URL}/movie/trending-series`);
    return response.data;
}

const getLatestMovies = async (): Promise<IMovie[]> => {
    const response = await axios.get(`${URL}/movie/latest-movies`);
    return response.data;
}

const getPopularPeople = async (): Promise<IPerson[]> => {
    const response = await axios.get(`${URL}/movie/popular-people`);
    return response.data;
}

const getMovieDetails = async (movieId: string): Promise<IMovieDetails> => {
    const response = await axios.get(`${URL}/movie/movie-details/${movieId}`);
    return response.data;
}

const getMovieStats = async (movieId: string, signal: AbortSignal): Promise<IMovieStats> => {
    const response = await axios.get(`${URL}/movie/movie-stats/${movieId}`, {
        signal
    });
    return response.data;
}

const getMovies = async (page: number): Promise<MovieResults> => {
    const response = await axios.get(`${URL}/movie/movies/${page}`);
    return response.data;
}

const search = async (data: SearchData): Promise<SearchResults> => {
    const response = await axios.get(`${URL}/movie/search/${data.query}/${data.page}`);
    return response.data;
}

const getFavoriteMovies = async (token: string | null): Promise<IFavoriteMovie[]> => {
    const response = await axios.get(
        `${URL}/movie/favorite-movies`,
        getConfig(token)
    );

    return response.data;
}

const getMoviesByGenre = async (data: { page: number; genreId: number; }): Promise<SortMovieResults> => {
    const { genreId, page } = data;
    const response = await axios.get(`${URL}/movie/genre-movies/${genreId}/${page}`);
    return response.data;
}

const getMoviesByYear = async (data: { page: number; year: number; }): Promise<SortMovieResults> => {
    const { year, page } = data;
    const response = await axios.get(`${URL}/movie/year-movies/${year}/${page}`);
    return response.data;
}

// PUT
const likeMovie = async (movieId: string, token: string | null): Promise<string[]> => {
    const response = await axios.put(
        `${URL}/movie/like/${movieId}`,
        undefined,
        getConfig(token)
    );

    return response.data;
}

const favoriteMovie = async (data: IMovie, token: string | null): Promise<{
    message: string;
    data: IFavoriteMovie | string;
}> => {
    const response = await axios.put(
        `${URL}/movie/favorite`,
        data,
        getConfig(token)
    );

    return response.data;
}

const movieService = {
    getMovieGenres,
    getTrendingSeries,
    getLatestMovies,
    getPopularPeople,
    getMovieDetails,
    getMovieStats,
    likeMovie,
    getMovies,
    search,
    favoriteMovie,
    getFavoriteMovies,
    getMoviesByGenre,
    getMoviesByYear
}

export default movieService;