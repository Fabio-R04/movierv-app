import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import reviewService from "./reviewService";
import { IReview, ReviewData, ReviewState } from "./reviewInterfaces";
import { RootState } from "../../app/store";
import { checkTokenValidity } from "../../reuseable";
import { logout } from "../auth/authSlice";
import { toast } from "react-hot-toast";

const initialState: ReviewState = {
    reviews: [],
    myReviews: [],
    loadingReviewCreate: false,
    loadingReviewAll: false,
    loadingReviewDelete: false,
    loadingReviewUser: false,
    successReview: false,
    errorReview: false,
    messageReview: ""
}

// GET
export const getReviews = createAsyncThunk("review/reviews", async (showId: string, thunkAPI) => {
    try {
        return await reviewService.getReviews(showId);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getMyReviews = createAsyncThunk("review/my-reviews", async (_: void, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await reviewService.getMyReviews(token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// POST
export const createReview = createAsyncThunk("review/create", async (data: ReviewData, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await reviewService.createReview(data, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// PUT 
export const likeReview = createAsyncThunk("review/like", async (reviewId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await reviewService.likeReview(reviewId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const dislikeReview = createAsyncThunk("review/dislikes", async (reviewId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await reviewService.dislikeReview(reviewId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// DELETE
export const deleteReview = createAsyncThunk("review/delete", async (reviewId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await reviewService.deleteReview(reviewId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        resetReview: (state) => {
            state.successReview = false;
            state.errorReview = false;
            state.messageReview = "";
        }
    },
    extraReducers: (bulider) => {
        bulider
            .addCase(createReview.pending, (state) => {
                state.loadingReviewCreate = true;
            })
            .addCase(createReview.fulfilled, (state, action: PayloadAction<IReview>) => {
                state.loadingReviewCreate = false;
                state.reviews.unshift(action.payload);
                toast.success("Review Added!");
            })
            .addCase(createReview.rejected, (state, action: PayloadAction<any>) => {
                state.loadingReviewCreate = false;
                toast.error(action.payload);
            })
            .addCase(getReviews.pending, (state) => {
                state.loadingReviewAll = true;
            })
            .addCase(getReviews.fulfilled, (state, action: PayloadAction<IReview[]>) => {
                state.loadingReviewAll = false;
                state.reviews = action.payload;
            })
            .addCase(likeReview.fulfilled, (state, action: PayloadAction<{
                reviewId: string;
                likes: string[];
                dislikes: string[];
            }>) => {
                state.reviews.some((r) => {
                    if (r._id === action.payload.reviewId) {
                        r.likes = action.payload.likes;
                        r.dislikes = action.payload.dislikes;
                        return true;
                    }
                    return false;
                });
            })
            .addCase(dislikeReview.fulfilled, (state, action: PayloadAction<{
                reviewId: string;
                likes: string[];
                dislikes: string[];
            }>) => {
                state.reviews.some((r) => {
                    if (r._id === action.payload.reviewId) {
                        r.likes = action.payload.likes;
                        r.dislikes = action.payload.dislikes;
                        return true;
                    }
                    return false;
                })
            })
            .addCase(deleteReview.pending, (state) => {
                state.loadingReviewDelete = true;
            })
            .addCase(deleteReview.fulfilled, (state, action: PayloadAction<{ reviewId: string; }>) => {
                state.loadingReviewDelete = false;
                const updatedReviews: IReview[] = state.reviews.filter((r: IReview) => {
                    if (r._id !== action.payload.reviewId) {
                        return r;
                    }
                });
                state.reviews = updatedReviews;
                toast.success("Review Deleted!");
            })
            .addCase(deleteReview.rejected, (state, action: PayloadAction<any>) => {
                state.loadingReviewDelete = false;
                toast.error(action.payload);
            })
            .addCase(getMyReviews.pending, (state) => {
                state.loadingReviewUser = true;
            })
            .addCase(getMyReviews.fulfilled, (state, action: PayloadAction<IReview[]>) => {
                state.loadingReviewUser = false;
                state.myReviews = action.payload;
            })
    }
});

export const { resetReview } = reviewSlice.actions;
export default reviewSlice.reducer;