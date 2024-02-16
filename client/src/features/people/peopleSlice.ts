import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import peopleService from "./peopleService";
import { IPerson, MovieCredit, PeopleResults, PeopleState, PersonDetails, SerieCredit } from "./peopleInterfaces";

const initialState: PeopleState = {
    personDetails: null,
    allPeople: null,
    loadingPeopleAll: false,
    loadingPeopleDetails: false,
    successPeople: false,
    errorPeople: false,
    messagePeople: ""
}

// GET
export const getPeople = createAsyncThunk("people/all", async (page: number, thunkAPI) => {
    try {
        return await peopleService.getPeople(page);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getPersonDetails = createAsyncThunk("people/details", async (personId: number, thunkAPI) => {
    try {
        return await peopleService.getPersonDetails(personId);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});


const peopleSlice = createSlice({
    name: "people",
    initialState,
    reducers: {
        resetPeople: (state) => {
            state.successPeople = false;
            state.errorPeople = false;
            state.messagePeople = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPeople.pending, (state) => {
                state.loadingPeopleAll = true;
            })
            .addCase(getPeople.fulfilled, (state, action: PayloadAction<PeopleResults>) => {
                state.loadingPeopleAll = false;
                state.allPeople = action.payload;
            })
            .addCase(getPersonDetails.pending, (state) => {
                state.loadingPeopleDetails = true;
            })
            .addCase(getPersonDetails.fulfilled, (state, action: PayloadAction<PersonDetails>) => {
                const sortedMovies: MovieCredit[] = action.payload.movie_credits.cast.sort((a: MovieCredit, b: MovieCredit) => {
                    return b.popularity - a.popularity; 
                });
                const sortedSeries: SerieCredit[] = action.payload.tv_credits.cast.sort((a: SerieCredit, b: SerieCredit) => {
                    return b.popularity - a.popularity;
                });
                state.loadingPeopleDetails = false;
                state.personDetails = {
                    ...action.payload,
                    movie_credits: {
                        cast: sortedMovies,
                    },
                    tv_credits: {
                        cast: sortedSeries
                    }
                }
            })
    }
});

export const { resetPeople } = peopleSlice.actions;
export default peopleSlice.reducer;