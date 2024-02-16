import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import movieReducer from "../features/movie/movieSlice";
import serieReducer from "../features/serie/serieSlice";
import reviewReducer from "../features/review/reviewSlice";
import collectionReducer from "../features/collection/collectionSlice";
import peopleReducer from "../features/people/peopleSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        movie: movieReducer,
        serie: serieReducer,
        review: reviewReducer,
        collection: collectionReducer,
        people: peopleReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
