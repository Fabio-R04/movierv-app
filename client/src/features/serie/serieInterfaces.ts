import { ICast, ICrew, ISerieH, SimilarMovie } from "../movie/movieInterfaces";

export interface ISerieStats {
    _id: string;
    serieId: number;
    views: number;
    likes: string[];
    trailer: string;
    createdAt: Date;
}

export interface ISerie {
    adult: boolean;
    backdrop_path: string;
    created_by: {
        id: number;
        credit_id: string;
        name: string;
        gender: number;
        profile_path: string;
    }[];
    episode_run_time: number[];
    first_air_date: string;
    genres: {
        id: number;
        name: string;
    }[];
    homepage: string;
    id: number;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    last_episode_to_air: IEpisode;
    name: string;
    next_episode_to_air: IEpisode | null;
    networks: {
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
    }[];
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: {
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
    }[];
    production_countries: {
        iso_3166_1: string;
        name: string;
    }[];
    seasons: ISeason[];
    spoken_languages: {
        english_name: string;
        iso_639_1: string;
        name: string;
    }[];
    status: string;
    tagline: string;
    type: string;
    vote_average: number;
    vote_count: number;
    credits: {
        cast: ICast[];
        crew: ICrew[];
    };
    similar: { page: number; results: SimilarMovie[] };
    "watch/providers": {
        results: {
            [country: string]: {
                link: string;
                rent?: IProvider[];
                buy?: IProvider[];
                flatrate: IProvider[];
            };
        }
    };
    seasonEpisodes: {
        [key: number]: {
            season: number;
            air_date: string | null;
            episodes: IEpisode[];
        };
    };
}

export interface IEpisode {
    id: number;
    name: string;
    vote_average: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    overview: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
}

export interface ISeason {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
}

export interface IProvider {
    logo_path: string;
    provider_id: number;
    provider_name: string;
    display_priority: number;
}

export interface SerieResults {
    page: number;
    results: {
        backdrop_path: string;
        first_air_date: string;
        genre_ids: number[];
        id: number;
        name: string;
        origin_country: string[];
        original_language: string;
        original_name: string;
        overview: string;
        popularity: number;
        poster_path: string;
        vote_average: number;
        vote_count: number;
    }[];
    total_pages: number;
    total_results: number;
}

export interface IFavoriteSerie {
    _id: string;
    user: string;
    serie: ISerieH;
}

export interface SerieState {
    serieDetails: ISerie | null;
    serieStats: ISerieStats | null;
    series: SerieResults | null;
    favoriteSeries: IFavoriteSerie[];
    loadingSerieDetails: boolean;
    loadingSerieStats: boolean;
    loadingSerieLike: boolean;
    loadingSerieSeries: boolean;
    loadingSerieFavorite: boolean;
    loadingSerieFavoriteAll: boolean;
    successSerie: boolean;
    errorSerie: boolean;
    messageSerie: string;
}