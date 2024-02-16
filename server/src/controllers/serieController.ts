import { Request, Response } from "express";
import axios from "axios";
import SerieM, { FavoriteSerieM, IFavoriteSerie, ISerie, ISerieStat, SeasonEpisodes } from "../models/serieModel";
import { MovieVideo } from "../models/movieModel";
import { startSession } from "mongoose";
import { IUser } from "../models/authModel";


const accessToken: string = `${process.env.TMDB_ACCESS_TOKEN}`;
const config = {
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
}

// GET
export const getSerieDetails = async (req: Request, res: Response): Promise<void> => {
    const serieId: number = Number(req.params.serieId);

    if (!serieId) {
        res.status(400).json({
            error: "TV Show ID not found."
        });
        return;
    }

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}`, {
            params: {
                append_to_response: "credits,similar,watch/providers"
            },
            ...config
        });

        const serieDetails = response.data;
        const seasonEpisodes: SeasonEpisodes = {};
        
        for (const season of serieDetails?.seasons) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/tv/${serieDetails?.id}/season/${season.season_number}`,
                config
            );
            seasonEpisodes[season.season_number] = {
                season: season.season_number,
                air_date: response.data.air_date,
                episodes: response.data.episodes
            }
        }

        res.status(200).json({ ...serieDetails, seasonEpisodes });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "Failed to fetch TV Show details."
        });
    }
}

export const getSerieStats = async (req: Request, res: Response): Promise<void> => {
    const serieId: number = Number(req.params.serieId);

    if (!serieId) {
        res.status(400).json({
            error: "TV Show ID not found."
        });
    }

    const controller: AbortController = new AbortController();
    const signal: AbortSignal = controller.signal;

    req.on("close", () => {
        controller.abort();
    });

    try {
        let serie: ISerieStat | null = await SerieM.findOne({ serieId });

        if (!serie) {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/videos`, {
                ...config,
                signal
            });

            if (signal.aborted) {
                return;
            }

            const videos: MovieVideo[] = response.data.results;
            const trailer: MovieVideo | undefined = videos.find((v: MovieVideo) => {
                if (v.name === "Official Trailer") {
                    return v;
                } else {
                    if (v.type === "Trailer") {
                        return v;
                    }
                }
            });

            serie = await SerieM.create({
                serieId,
                trailer: trailer ? trailer.key : "Not Found"
            });
        }

        serie.views++;
        await serie.save();
        res.status(200).json(serie);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch TV Show stats."
        });
    }
}

export const getSeries = async (req: Request, res: Response): Promise<void> => {
    const page: number = Number(req.params.page);

    if (!page) {
        res.status(400).json({
            error: "Page number not provided."
        });
        return;
    }

    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/tv/popular`,
            {
                params: {
                    language: "en-US",
                    page
                },
                ...config
            }
        );

        const series = response.data;
        res.status(200).json(series);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch series."
        });
    }
}

export const getFavoriteSeries = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: IUser = req.user;
        const favoriteSeries: IFavoriteSerie[] = await FavoriteSerieM.find({
            user: user._id
        });
        res.status(200).json(favoriteSeries);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch favorite series."
        });
    }
}

// PUT
export const likeSerie = async (req: Request, res: Response): Promise<void> => {
    const serieId: number = Number(req.params.serieId);
    const userId: string = req.user._id;

    if (!serieId) {
        res.status(400).json({
            error: "TV Show ID not found."
        });
        return;
    }

    try {
        const serie: ISerieStat | null = await SerieM.findOne({ serieId });

        if (serie) {
            const alreadyLiked: boolean = serie.likes.some((u: string): boolean => {
                if (userId.toString() === u.toString()) {
                    return true;
                }
                return false;
            });

            switch (alreadyLiked) {
                case true:
                    const filteredLikes: string[] = serie.likes.filter((u: string) => {
                        if (u.toString() !== userId.toString()) {
                            return u;
                        }
                    });
                    serie.likes = filteredLikes;
                    break;
                case false:
                    serie.likes.push(userId);
                    break;
                default:
                    break;
            }

            await serie.save();
            res.status(200).json(serie.likes);
        }
    } catch (error) {
        res.status(400).json({
            error: "Failed to like TV Show."
        });
    }
}

export const favoriteSerie = async (req: Request, res: Response): Promise<void> => {
    const serieData: ISerie = req.body;

    if (!serieData) {
        res.status(400).json({
            error: "Serie data missing"
        });
        return;
    }

    try {
        const user: IUser = req.user;
        const serie: IFavoriteSerie | null = await FavoriteSerieM.findOne({
            user: user._id,
            "serie.id": serieData.id
        });

        if (serie) {
            await serie.deleteOne();
            res.status(200).json({
                message: "Serie Deleted",
                data: serieData.id
            });
            return;
        }

        const newSerie: IFavoriteSerie = await FavoriteSerieM.create({
            user: user._id,
            serie: serieData
        });
        res.status(200).json({
            message: "Serie Added",
            data: newSerie
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to favorite serie."
        });
    }
}