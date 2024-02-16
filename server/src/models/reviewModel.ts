import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./authModel";
import { IMovie } from "./movieModel";
import { ISerie } from "./serieModel";

export interface IReview extends Document {
    _id: string;
    user: IUser;
    type: string;
    movie?: IMovie;
    serie?: ISerie;
    description: string;
    rating: number;
    likes: string[];
    dislikes: string[];
    createdAt: Date;
}

const reviewSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
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
        required: false
    },
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
        }, required: false
    },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    likes: { type: [{ type: Schema.Types.ObjectId, ref: "User", _id: false }], required: false, default: [] },
    dislikes: { type: [{ type: Schema.Types.ObjectId, ref: "User", _id: false }], required: false, default: [] }
}, {
    timestamps: true
});

export default mongoose.model<IReview>("Review", reviewSchema);