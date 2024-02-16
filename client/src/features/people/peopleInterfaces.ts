import { IMovie, ISerieH } from "../movie/movieInterfaces";

export interface IPerson {
    adult: boolean;
    gender: number;
    id: number,
    known_for: {
        adult: boolean;
        backdrop_path: string;
        genre_ids: number[];
        id: number;
        media_type: string;
        original_language: string;
        original_title: string;
        overview: string;
        poster_path: string;
        release_date: string;
        title: string;
        video: boolean;
        vote_average: number;
        vote_count: number;
    }[];
    known_for_department: string;
    name: string;
    popularity: number;
    profile_path: string;
}

export type KnownFor = IMovie | ISerieH;

export interface IPersonSearch {
    adult: boolean;
    id: number;
    name: string;
    original_name: string;
    media_type: string;
    popularity: number;
    gender: number;
    known_for_department: string;
    profile_path: string;
    known_for: KnownFor[];
}

export interface PeopleResults {
    page: number;
    results: IPerson[];
    total_pages: number;
    total_results: number;
}

export interface PersonDetails {
    adult: boolean;
    also_known_as: string[];
    biography: string;
    birthday: string | null;
    deathday: string | null;
    gender: number;
    homepage: string | null;
    id: number;
    imdb_id: string;
    known_for_department: string;
    name: string;
    place_of_birth: string;
    popularity: number;
    profile_path: string;
    movie_credits: {
        cast: MovieCredit[];
    };
    tv_credits: {
        cast: SerieCredit[];
    };
    external_ids: {
        [value: string]: string | null;
    }
}

export interface MovieCredit {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_langauge: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    character: string;
    credit_id: string;
    order: number;
}

export interface SerieCredit {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    origin_country: string[];
    original_langauge: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    first_air_date: string;
    name: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    character: string;
    credit_id: string;
    episode_count: number;
}

export interface PeopleState {
    personDetails: PersonDetails | null;
    allPeople: PeopleResults | null;
    loadingPeopleAll: boolean;
    loadingPeopleDetails: boolean;
    successPeople: boolean;
    errorPeople: boolean;
    messagePeople: string;
}