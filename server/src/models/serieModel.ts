import mongoose, { Schema, Document } from "mongoose";

export interface ISerie {
    adult: boolean;
    backdrop_path: string;
    id: number;
    name: string;
    original_language: string;
    original_name: string;
    overview: string;
    poster_path: string;
    media_type: string;
    genre_ids: number[];
    popularity: number;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    origin_country: string[];
}

export interface IFavoriteSerie extends Document {
    _id: string;
    user: string;
    serie: ISerie;
}

export interface ISerieStat extends Document {
    _id: string;
    serieId: number;
    views: number;
    likes: string[];
    trailer: string;
    createdAt: Date;
}

export interface SeasonEpisodes {
    [key: number]: any;
}

const serieSchema: Schema = new Schema({
    serieId: { type: Number, required: true },
    trailer: { type: String, required: true },
    views: { type: Number, required: false, default: 0 },
    likes: { type: [{ type: Schema.Types.ObjectId, ref: "User", _id: false }], required: false, default: [] }
}, {
    timestamps: true
});

const favoriteSeriesSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serie: {
        type: {
            adult: Boolean,
            backdrop_path: String,
            id: Number,
            name: String,
            original_language: String,
            original_name: String,
            overview: String,
            poster_path: String,
            media_type: String,
            genre_ids: [Number],
            popularity: Number,
            first_air_date: String,
            vote_average: Number,
            vote_count: Number,
            origin_country: [String]
        },
        required: true,
        _id: false
    }
});

export const FavoriteSerieM = mongoose.model<IFavoriteSerie>("FavoriteSerie", favoriteSeriesSchema);
export default mongoose.model<ISerieStat>("Serie", serieSchema);