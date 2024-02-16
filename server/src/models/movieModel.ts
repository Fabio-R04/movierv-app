import mongoose, { Schema, Document } from "mongoose";

export interface IMovie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface IFavoriteMovie extends Document {
    _id: string;
    user: string;
    movie: IMovie;
}

export interface IMovieStat extends Document {
    _id: string;
    movieId: number;
    views: number;
    likes: string[];
    trailer: string;
    createdAt: Date;
}

export interface MovieVideo {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: string;
}

const movieSchema: Schema = new Schema({
    movieId: { type: Number, required: true },
    views: { type: Number, required: false, default: 0 },
    likes: { type: [{ type: Schema.Types.ObjectId, ref: "User", _id: false }], required: false, default: [] },
    trailer: { type: String, required: true }
}, {
    timestamps: true
});

const favoriteMoviesSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movie: {
        type: {
            adult: Boolean,
            backdrop_path: String,
            genre_ids: [Number],
            id: Number,
            original_language: String,
            original_title: String,
            overview: String,
            popularity: Number,
            poster_path: String,
            release_date: String,
            title: String,
            video: Boolean,
            vote_average: Number,
            vote_count: Number
        },
        required: true,
        _id: false
    }
});

export const FavoriteMovieM = mongoose.model<IFavoriteMovie>("FavoriteMovie", favoriteMoviesSchema);
export default mongoose.model<IMovieStat>("Movie", movieSchema);