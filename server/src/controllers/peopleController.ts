import { Request, Response } from "express";
import axios from "axios";

// TMDB
const accessToken: string = `${process.env.TMDB_ACCESS_TOKEN}`;
const config = {
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
}

// GET
export const getPeople = async (req: Request, res: Response): Promise<void> => {
    const page: number = Number(req.params.page);

    if (!page) {
        res.status(400).json({
            error: "Page number not provided."
        });
        return;
    }

    try {
        const response = await axios.get("https://api.themoviedb.org/3/person/popular", {
            params: {
                language: "en-US",
                page
            },
            ...config
        });

        const peopleData = response.data;
        res.status(200).json(peopleData);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch all people."
        });
    }
}

export const getPersonDetails = async (req: Request, res: Response): Promise<void> => {
    const personId: number = Number(req.params.personId);

    if (!personId) {
        res.status(400).json({
            error: "Person ID not found."
        });
        return;
    }

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/person/${personId}`, {
            params: {
                language: "en-US",
                append_to_response: "movie_credits,tv_credits,external_ids"
            },
            ...config
        });

        const personDetails = response.data;
        res.status(200).json(personDetails);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch person details."
        });
    }
}