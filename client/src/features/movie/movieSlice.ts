import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import movieService from "./movieService";
import { IFavoriteMovie, IMovie, IMovieDetails, IMovieGenre, IMovieStats, ISerieH, MovieResults, MovieState, SearchData, SearchResults, SortMovieResults } from "./movieInterfaces";
import { toast } from "react-hot-toast";
import { checkTokenValidity } from "../../reuseable";
import { logout } from "../auth/authSlice";
import { IPerson } from "../people/peopleInterfaces";
import { RootState } from "../../app/store";

const initialState: MovieState = {
    movieDetails: null,
    movieStats: null,
    movies: null,
    searchResults: null,
    moviesByGenre: null,
    moviesByYear: null,
    favoriteMovies: [],
    trendingSeries: [],
    latestMovies: [],
    popularPeople: [],
    movieGenres: [],
    loadingMovieGenres: false,
    loadingMovieSeries: false,
    loadingMovieMovies: false,
    loadingMoviePeople: false,
    loadingMovieDetailsM: false,
    loadingMovieStats: false,
    loadingMovieLike: false,
    loadingMovieSearch: false,
    loadingMovieFavorite: false,
    loadingMovieFavoriteAll: false,
    loadingMovieSort: false,
    successMovie: false,
    errorMovie: false,
    messageMovie: ""
}

// GET
export const getMovieGenres = createAsyncThunk("movie/genres", async (_: void, thunkAPI: any) => {
    try {
        return await movieService.getMovieGenres();
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getTrendingSeries = createAsyncThunk("movie/trending-series", async (_: void, thunkAPI: any) => {
    try {
        return await movieService.getTrendingSeries();
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getLatestMovies = createAsyncThunk("movie/latest-movies", async (_: void, thunkAPI: any) => {
    try {
        return await movieService.getLatestMovies();
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getPopularPeople = createAsyncThunk("movie/popular-people", async (_: void, thunkAPI: any) => {
    try {
        return await movieService.getPopularPeople();
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getMovieDetails = createAsyncThunk("movie/movie-details", async (movieId: string, thunkAPI: any) => {
    try {
        return await movieService.getMovieDetails(movieId);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getMovieStats = createAsyncThunk("movie/movie-stats", async (movieId: string, thunkAPI) => {
    try {
        return await movieService.getMovieStats(movieId, thunkAPI.signal);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getMovies = createAsyncThunk("movie/movies", async (page: number, thunkAPI) => {
    try {
        return await movieService.getMovies(page);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const search = createAsyncThunk("movie/search", async (data: SearchData, thunkAPI) => {
    try {
        return await movieService.search(data);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getFavoriteMovies = createAsyncThunk("movie/favorites", async (_: void, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await movieService.getFavoriteMovies(token); 
    } catch (error: any) {
        const message: string = error.responsed.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }

        return thunkAPI.rejectWithValue(message);
    }
});

export const getMoviesByGenre = createAsyncThunk("movie/genre-movies", async (data: { page: number; genreId: number; }, thunkAPI) => {
    try {
        return await movieService.getMoviesByGenre(data);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getMoviesByYear = createAsyncThunk("movie/year-movies", async (data: { page: number; year: number; }, thunkAPI) => {
    try {
        return await movieService.getMoviesByYear(data);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

// PUT
export const likeMovie = createAsyncThunk("movie/like-movie", async (movieId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await movieService.likeMovie(movieId, token);
    } catch (error: any) {
        console.log(error);
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }

        return thunkAPI.rejectWithValue(message);
    }
});

export const favoriteMovie = createAsyncThunk("movie/favorite", async (data: IMovie, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await movieService.favoriteMovie(data, token);
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }

        return thunkAPI.rejectWithValue(message);
    }
});

const movieSlice = createSlice({
    name: "movie",
    initialState,
    reducers: {
        resetMovie: (state) => {
            state.successMovie = false;
            state.errorMovie = false;
            state.messageMovie = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMovieGenres.pending, (state) => {
                state.loadingMovieGenres = true;
            })
            .addCase(getMovieGenres.fulfilled, (state, action: PayloadAction<IMovieGenre[]>) => {
                state.loadingMovieGenres = false;
                state.movieGenres = action.payload;
            })
            .addCase(getTrendingSeries.pending, (state) => {
                state.loadingMovieSeries = true;
            })
            .addCase(getTrendingSeries.fulfilled, (state, action: PayloadAction<ISerieH[]>) => {
                state.loadingMovieSeries = false;
                state.trendingSeries = action.payload;
            })
            .addCase(getLatestMovies.pending, (state) => {
                state.loadingMovieMovies = true;
            })
            .addCase(getLatestMovies.fulfilled, (state, action: PayloadAction<IMovie[]>) => {
                state.loadingMovieMovies = false;
                state.latestMovies = action.payload;
            })
            .addCase(getPopularPeople.pending, (state) => {
                state.loadingMoviePeople = true;
            })
            .addCase(getPopularPeople.fulfilled, (state, action: PayloadAction<IPerson[]>) => {
                state.loadingMoviePeople = false;
                state.popularPeople = action.payload;
            })
            .addCase(getMovieDetails.pending, (state) => {
                state.loadingMovieDetailsM = true;
            })
            .addCase(getMovieDetails.fulfilled, (state, action: PayloadAction<IMovieDetails>) => {
                state.loadingMovieDetailsM = false;
                state.movieDetails = action.payload;
            })
            .addCase(getMovieStats.pending, (state) => {
                state.loadingMovieStats = true;
            })
            .addCase(getMovieStats.fulfilled, (state, action: PayloadAction<IMovieStats>) => {
                state.loadingMovieStats = false;
                state.movieStats = action.payload;
            })
            .addCase(likeMovie.pending, (state) => {
                state.loadingMovieLike = true;
            })
            .addCase(likeMovie.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.loadingMovieLike = false;
                if (state.movieStats) {
                    state.movieStats.likes = action.payload;
                }
            })
            .addCase(likeMovie.rejected, (state, action: PayloadAction<any>) => {
                state.loadingMovieLike = false;
                if (action.payload !== "Not Authorized") {
                    toast.error(action.payload);
                }
            })
            .addCase(getMovies.pending, (state) => {
                state.loadingMovieMovies = true;
            })
            .addCase(getMovies.fulfilled, (state, action: PayloadAction<MovieResults>) => {
                state.loadingMovieMovies = false;
                state.movies = action.payload;
            })
            .addCase(search.pending, (state) => {
                state.loadingMovieSearch = true;
            })
            .addCase(search.fulfilled, (state, action: PayloadAction<SearchResults>) => {
                state.loadingMovieSearch = false;
                state.searchResults = action.payload;
            })
            .addCase(favoriteMovie.pending, (state) => {
                state.loadingMovieFavorite = true;
            })
            .addCase(favoriteMovie.fulfilled, (state, action: PayloadAction<{
                message: string;
                data: IFavoriteMovie | string;
            }>) => {
                state.loadingMovieFavorite = false;

                switch (action.payload.message) {
                    case "Movie Deleted":
                        const updatedFavorites: IFavoriteMovie[] = state.favoriteMovies.filter((favorite: IFavoriteMovie) => {
                            if (favorite.movie.id !== Number(action.payload.data)) {
                                return favorite;
                            }
                        });
                        state.favoriteMovies = updatedFavorites;
                        break;
                    case "Movie Added":
                        state.favoriteMovies.unshift((action.payload.data as IFavoriteMovie));
                        break;
                    default:
                        toast.error("Something went wrong.");
                }
            })
            .addCase(favoriteMovie.rejected, (state, action: PayloadAction<any>) => {
                state.loadingMovieFavorite = false;
                toast.error(action.payload);
            })
            .addCase(getFavoriteMovies.pending, (state) => {
                state.loadingMovieFavoriteAll = true;
            })
            .addCase(getFavoriteMovies.fulfilled, (state, action: PayloadAction<IFavoriteMovie[]>) => {
                state.loadingMovieFavoriteAll = false;
                state.favoriteMovies = action.payload;
            })
            .addCase(getMoviesByGenre.pending, (state) => {
                state.loadingMovieSort = true
            })
            .addCase(getMoviesByGenre.fulfilled, (state, action: PayloadAction<SortMovieResults>) => {
                state.loadingMovieSort = false;
                state.moviesByGenre = action.payload;
            })
            .addCase(getMoviesByYear.pending, (state) => {
                state.loadingMovieSort = true;
            })
            .addCase(getMoviesByYear.fulfilled, (state, action: PayloadAction<SortMovieResults>) => {
                state.loadingMovieSort = false;
                state.moviesByYear = action.payload;
            })
    }
});

export const { resetMovie } = movieSlice.actions;
export default movieSlice.reducer;