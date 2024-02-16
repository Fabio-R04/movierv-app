import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import collectionService from "./collectionService";
import { CollectionDetails, CollectionState, ICollection } from "./collectionInterfaces";

const initialState: CollectionState = {
    collectionDetails: null,
    collections: [],
    loadingCollectionCollections: false,
    loadingCollectionDetails: false,
    successCollection: false,
    errorCollection: false,
    messageCollection: ""
}

// GET
export const getCollections = createAsyncThunk("collection/all", async (_: void, thunkAPI) => {
    try {
        return await collectionService.getCollections();
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getCollectionDetails = createAsyncThunk("collection/details", async (collectionId: number, thunkAPI) => {
    try {
        return await collectionService.getCollectionDetails(collectionId, thunkAPI.signal);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

const collectionSlice = createSlice({
    name: "collection",
    initialState,
    reducers: {
        resetCollection: (state) => {
            state.successCollection = false;
            state.errorCollection = false;
            state.messageCollection = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCollections.pending, (state) => {
                state.loadingCollectionCollections = true;
            })
            .addCase(getCollections.fulfilled, (state, action: PayloadAction<ICollection[]>) => {
                state.loadingCollectionCollections = false;
                state.collections = action.payload;
            })
            .addCase(getCollectionDetails.pending, (state) => {
                state.loadingCollectionDetails = true;
            })
            .addCase(getCollectionDetails.fulfilled, (state, action: PayloadAction<CollectionDetails>) => {
                state.loadingCollectionDetails = false;
                state.collectionDetails = action.payload;
            })
    }
});

export const { resetCollection } = collectionSlice.actions;
export default collectionSlice.reducer;