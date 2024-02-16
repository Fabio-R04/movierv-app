import { createSlice, createAsyncThunk, PayloadAction, AsyncThunkAction } from "@reduxjs/toolkit";
import serieService from "./serieService";
import { IFavoriteSerie, ISerie, ISerieStats, SerieResults, SerieState } from "./serieInterfaces";
import { RootState } from "../../app/store";
import { AuthState } from "../auth/authInterfaces";
import { checkTokenValidity } from "../../reuseable";
import { logout } from "../auth/authSlice";
import { ISerieH } from "../movie/movieInterfaces";
import { toast } from "react-hot-toast";

const initialState: SerieState = {
    serieDetails: null,
    serieStats: null,
    series: null,
    favoriteSeries: [],
    loadingSerieDetails: false,
    loadingSerieStats: false,
    loadingSerieLike: false,
    loadingSerieSeries: false,
    loadingSerieFavorite: false,
    loadingSerieFavoriteAll: false,
    successSerie: false,
    errorSerie: false,
    messageSerie: ""
}

// GET
export const getSerieDetails = createAsyncThunk("serie/details", async (serieId: string, thunkAPI) => {
    try {
        return await serieService.getSerieDetails(serieId, thunkAPI.signal);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getSerieStats = createAsyncThunk("serie/stats", async (serieId: string, thunkAPI) => {
    try {
        return await serieService.getSerieStats(serieId, thunkAPI.signal);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getSeries = createAsyncThunk("serie/series", async (page: number, thunkAPI) => {
    try {
        return await serieService.getSeries(page);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getFavoriteSeries = createAsyncThunk("serie/favorites", async (_: void, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await serieService.getFavoriteSeries(token);
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }

        return thunkAPI.rejectWithValue(message);
    }
});

// PUT
export const likeSerie = createAsyncThunk("serie/like", async (serieId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await serieService.likeSerie(serieId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }

        return thunkAPI.rejectWithValue(message);
    }
});

export const favoriteSerie = createAsyncThunk("serie/favorite", async (data: ISerieH, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await serieService.favoriteSerie(data, token);
    } catch (error: any) {
        const message: any = error.responsed.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }

        return thunkAPI.rejectWithValue(message);
    }
});

const serieSlice = createSlice({
    name: "serie",
    initialState,
    reducers: {
        resetSerie: (state) => {
            state.successSerie = false;
            state.errorSerie = false;
            state.messageSerie = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSerieDetails.pending, (state) => {
                state.loadingSerieDetails = true;
            })
            .addCase(getSerieDetails.fulfilled, (state, action: PayloadAction<ISerie>) => {
                state.loadingSerieDetails = false;
                state.serieDetails = action.payload;
            })
            .addCase(getSerieStats.pending, (state) => {
                state.loadingSerieStats = true;
            })
            .addCase(getSerieStats.fulfilled, (state, action: PayloadAction<ISerieStats>) => {
                state.loadingSerieStats = false;
                state.serieStats = action.payload;
            })
            .addCase(likeSerie.pending, (state) => {
                state.loadingSerieLike = true;
            })
            .addCase(likeSerie.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.loadingSerieLike = false;
                if (state.serieStats) {
                    state.serieStats.likes = action.payload;
                }
            })
            .addCase(getSeries.pending, (state) => {
                state.loadingSerieSeries = true;
            })
            .addCase(getSeries.fulfilled, (state, action: PayloadAction<SerieResults>) => {
                state.loadingSerieSeries = false;
                state.series = action.payload;
            })
            .addCase(favoriteSerie.pending, (state) => {
                state.loadingSerieFavorite = true;
            })
            .addCase(favoriteSerie.fulfilled, (state, action: PayloadAction<{
                message: string;
                data: IFavoriteSerie | string;
            }>) => {
                state.loadingSerieFavorite = false;

                switch (action.payload.message) {
                    case "Serie Deleted":
                        const updatedFavorites: IFavoriteSerie[] = state.favoriteSeries.filter((favorite: IFavoriteSerie) => {
                            if (favorite.serie.id !== Number(action.payload.data)) {
                                return favorite;
                            }
                        });
                        state.favoriteSeries = updatedFavorites;
                        break;
                    case "Serie Added":
                        state.favoriteSeries.unshift((action.payload.data as IFavoriteSerie));
                        break;
                    default:
                        toast.error("Something went wrong.");
                }
            })
            .addCase(favoriteSerie.rejected, (state, action: PayloadAction<any>) => {
                state.loadingSerieFavorite = false;
                toast.error(action.payload);
            })
            .addCase(getFavoriteSeries.pending, (state) => {
                state.loadingSerieFavoriteAll = true;
            })
            .addCase(getFavoriteSeries.fulfilled, (state, action: PayloadAction<IFavoriteSerie[]>) => {
                state.loadingSerieFavoriteAll = false;
                state.favoriteSeries = action.payload;
            })
    }
});

export const { resetSerie } = serieSlice.actions;
export default serieSlice.reducer;