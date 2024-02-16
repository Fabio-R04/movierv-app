import { Request, Response } from "express";
import CollectionM, { CollectionData, ICollection } from "../models/collectionModel";
import axios from "axios";

// TMDb
const accessToken: string = `${process.env.TMDB_ACCESS_TOKEN}`;
const config = {
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
}

// REUSABLE
export const createCollection = async (data: CollectionData): Promise<ICollection | null> => {
    const { collectionId, name, posterPath, backdropPath } = data;

    if (!Number(collectionId) || !name || !posterPath || !backdropPath) {
        return null;
    }

    try {
        const newCollection: ICollection = await CollectionM.create({
            collectionId,
            name,
            posterPath,
            backdropPath
        });

        return newCollection;
    } catch (error) {
        return null;
    }
}

// GET
export const getCollections = async (req: Request, res: Response): Promise<void> => {
    try {
        const collections: ICollection[] = await CollectionM.find({});
        res.status(200).json(collections);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch collections."
        });
    }
}

export const getCollectionDetails = async (req: Request, res: Response): Promise<void> => {
    const collectionId: number = Number(req.params.collectionId);

    if (!collectionId) {
        res.status(400).json({
            error: "Collection ID not found."
        });
        return;
    }

    const controller: AbortController = new AbortController();
    const signal: AbortSignal = controller.signal;
    
    req.on("close", () => {
        controller.abort();
    });

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/collection/${collectionId}`, {
            signal,
            ...config
        });

        if (signal.aborted) {
            return;
        }

        const collectionDetails = response.data;
        const exists = await CollectionM.exists({ collectionId });

        if (!exists) {
            await CollectionM.create({
                collectionId: collectionDetails?.id,
                name: collectionDetails?.name,
                posterPath: collectionDetails?.poster_path,
                backdropPath: collectionDetails?.backdrop_path
            });
        }

        res.status(200).json(collectionDetails);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch collection details."
        });
    }
}