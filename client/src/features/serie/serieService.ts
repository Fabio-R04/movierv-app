import axios from "axios";
import { URL, getConfig } from "../../reuseable";
import { IFavoriteSerie, ISerie, ISerieStats, SerieResults } from "./serieInterfaces";
import { ISerieH } from "../movie/movieInterfaces";

// GET
const getSerieDetails = async (serieId: string, signal: AbortSignal): Promise<ISerie> => {
    const response = await axios.get(
        `${URL}/serie/serie-details/${serieId}`,
        { signal }
    );

    return response.data;
}

const getSerieStats = async (serieId: string, signal: AbortSignal): Promise<ISerieStats> => {
    const response = await axios.get(
        `${URL}/serie/serie-stats/${serieId}`,
        { signal }
    );

    return response.data;
}

const getSeries = async (page: number): Promise<SerieResults> => {
    const response = await axios.get(
        `${URL}/serie/series/${page}`,
        undefined
    );

    return response.data;
}

const getFavoriteSeries = async (token: string | null): Promise<IFavoriteSerie[]> => {
    const response = await axios.get(
        `${URL}/serie/favorite-series`,
        getConfig(token)
    );

    return response.data;
}

// PUT
const likeSerie = async (serieId: string, token: string | null): Promise<string[]> => {
    const response = await axios.put(
        `${URL}/serie/like/${serieId}`,
        undefined,
        getConfig(token)
    );

    return response.data;
}

const favoriteSerie = async (data: ISerieH, token: string | null): Promise<{
    message: string;
    data: IFavoriteSerie | string;
}> => {
    const response = await axios.put(
        `${URL}/serie/favorite`,
        data,
        getConfig(token)
    );

    return response.data;
}

const serieService = {
    getSerieDetails,
    getSerieStats,
    likeSerie,
    getSeries,
    favoriteSerie,
    getFavoriteSeries
}

export default serieService;