import mongoose, { Schema, Document } from "mongoose";

export interface ICollection {
    _id: string;
    collectionId: number;
    name: string;
    posterPath: string;
    backdropPath: string;
}

export interface CollectionData {
    collectionId: number;
    name: string;
    posterPath: string;
    backdropPath: string
}

const collectionSchema: Schema = new Schema({
    collectionId: { type: Number, required: true },
    name: { type: String, required: true },
    posterPath: { type: String, required: true },
    backdropPath: { type: String, required: true }
});

export default mongoose.model<ICollection>("Collection", collectionSchema);