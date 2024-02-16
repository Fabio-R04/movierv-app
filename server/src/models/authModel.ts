import mongoose, { Schema, Document } from "mongoose";
import { IFavoriteMovie } from "./movieModel";
import { IFavoriteSerie } from "./serieModel";

export interface IUser extends Document {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    createdAt: Date;
}

const authSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IUser>("User", authSchema);