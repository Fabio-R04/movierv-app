import { Request, Response } from "express";
import MovieM, { FavoriteMovieM, IFavoriteMovie, IMovie, IMovieStat, MovieVideo } from "../models/movieModel";
import axios from "axios";
import { IUser } from "../models/authModel";
import exp from "constants";

// TMDb
const accessToken: string = `${process.env.TMDB_ACCESS_TOKEN}`;
const config = {
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
}

// GET
export const getGenres = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/genre/movie/list`,
            config
        );

        const genres = response.data.genres;
        res.status(200).json(genres);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch genres."
        });
    }
}

export const getTrendingSeries = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await axios.get(
            "https://api.themoviedb.org/3/trending/tv/day",
            config
        );

        const series = response.data.results;
        res.status(200).json(series);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch trending series."
        });
    }
}

export const getLatestMovies = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await axios.get(
            "https://api.themoviedb.org/3/movie/now_playing",
            config
        );

        const movies = response.data.results;
        res.status(200).json(movies);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch trending movies."
        });
    }
}

export const getPopularPeople = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await axios.get(
            "https://api.themoviedb.org/3/person/popular",
            config
        );

        const people = response.data.results;
        res.status(200).json(people);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch popular people."
        });
    }
}

export const getMovieDetails = async (req: Request, res: Response): Promise<void> => {
    const movieId: number = Number(req.params.movieId);

    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
                append_to_response: "credits,similar,watch/providers"
            },
            ...config
        }
        );

        const movieDetails = response.data;
        const director = response.data.credits.crew.filter((p: any) => p.job === "Director")[0];
        movieDetails["director"] = director ? director : null;
        res.status(200).json(movieDetails);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch movie details."
        });
    }
}

export const getMovieStats = async (req: Request, res: Response): Promise<void> => {
    const movieId: number = Number(req.params.movieId);

    if (!movieId) {
        res.status(400).json({
            error: "Movie ID not found"
        });
        return;
    }

    const controller: AbortController = new AbortController();
    const signal: AbortSignal = controller.signal;

    req.on("close", () => {
        controller.abort();
    });

    try {
        let movie: IMovieStat | null = await MovieM.findOne({ movieId });

        if (!movie) {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
                signal,
                ...config
            });

            if (signal.aborted) {
                return;
            }

            const videos: MovieVideo[] = response.data.results;
            const trailer: MovieVideo | undefined = videos.find((v: MovieVideo) => {
                if (v.name === "Official Trailer") {
                    return v;
                } else {
                    if (v.type === "Trailer") {
                        return v;
                    }
                }
            });

            movie = await MovieM.create({
                movieId,
                trailer: trailer ? trailer.key : "Not Found"
            });
        }

        movie.views++;
        await movie.save();
        res.status(200).json(movie);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch movie stats."
        });
    }
}

export const getMovies = async (req: Request, res: Response): Promise<void> => {
    const page: number = Number(req.params.page);

    if (!page) {
        res.status(400).json({
            error: "Page number not provided."
        });
        return;
    }

    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/now_playing`,
            {
                params: {
                    language: "en-US",
                    page
                },
                ...config
            }
        );

        const movies = response.data;
        res.status(200).json(movies);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch movies."
        });
    }
}

export const search = async (req: Request, res: Response): Promise<void> => {
    const page: number = Number(req.params.page);
    const query: string = req.params.query;

    if (!page || !query) {
        res.status(400).json({
            error: "Page or query not provided."
        });
        return;
    }

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
            params: {
                language: "en-US",
                query,
                page
            },
            ...config
        });

        const searchResults = response.data;
        res.status(200).json(searchResults);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch search results."
        });
    }
}

export const getFavoriteMovies = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: IUser = req.user;
        const favoriteMovies: IFavoriteMovie[] = await FavoriteMovieM.find({
            user: user.id
        });
        res.status(200).json(favoriteMovies);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch favorite movies."
        }); 
    }
}

export const getMoviesByGenre = async (req: Request, res: Response): Promise<void> => {
    const genreId: number = Number(req.params.genreId);
    const page: number = Number(req.params.page);

    if (!genreId || !page) {
        res.status(400).json({
            error: "Genre ID or Page not found."
        });
        return;
    }

    try {
        const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
            params: {
                page,
                with_genres: genreId
            },
            ...config
        });

        const movies = response.data;
        res.status(200).json(movies);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch movies by genre."
        });
    }
}

export const getMoviesByYear = async (req: Request, res: Response): Promise<void> => {
    const year: number = Number(req.params.year);
    const page: number = Number(req.params.page);

    if (!page || !year) {
        res.status(400).json({
            error: "Page or Year not found."
        });
        return;
    }

    try {
        const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
            params: {
                page,
                primary_release_year: year
            },
            ...config
        });

        const movies = response.data;
        res.status(200).json(movies);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch movies by year."
        });
    }
}

// PUT
export const likeMovie = async (req: Request, res: Response): Promise<void> => {
    const movieId: number = Number(req.params.movieId);
    const userId: string = req.user._id;

    if (movieId.toString().trim() === "") {
        res.status(400).json({
            error: "Movie ID not found."
        });
        return;
    }

    try {
        const movieStats: IMovieStat | null = await MovieM.findOne({ movieId });

        if (movieStats) {
            const alreadyLiked: boolean = movieStats.likes?.some((u: string): boolean => {
                if (u.toString() === userId.toString()) {
                    return true;
                }
                return false;
            });

            switch (alreadyLiked) {
                case true:
                    const filteredLikes: string[] = movieStats.likes?.filter((u: string) => {
                        if (u.toString() !== userId.toString()) {
                            return u;
                        }
                    });
                    movieStats.likes = filteredLikes;
                    break;
                case false:
                    movieStats.likes.push(userId);
                    break;
                default:
                    break;
            }

            await movieStats.save();
            res.status(200).json(movieStats.likes);
            return;
        }
    } catch (error) {
        res.status(400).json({
            error: "Failed to like movie."
        });
    }
}

export const favoriteMovie = async (req: Request, res: Response): Promise<void> => {
    const movieData: IMovie = req.body;
    
    if (!movieData) {
        res.status(400).json({
            error: "Movie data not found."
        });
        return;
    }

    try {
        const user: IUser = req.user;
        const movie: IFavoriteMovie | null = await FavoriteMovieM.findOne({
            user: user._id,
            "movie.id": movieData.id
        });

        if (movie) {
            await movie.deleteOne();
            res.status(200).json({
                message: "Movie Deleted",
                data: movieData.id
            });
            return;
        }

        const newMovie: IFavoriteMovie = await FavoriteMovieM.create({
            user: user._id,
            movie: movieData
        });
        res.status(200).json({
            message: "Movie Added",
            data: newMovie
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to favorite movie."
        });
    }
}