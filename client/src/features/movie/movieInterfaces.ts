import { IPerson, IPersonSearch } from "../people/peopleInterfaces";
import { IProvider } from "../serie/serieInterfaces";

export interface GenreColorMap {
    [genre: string]: string;
}

export interface ISerieH {
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

export interface ICollection {
    collectionId: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
}

export interface IMovie {
    adult: boolean;
    backdrop_path: string;
    id: number;
    title: string;
    original_language: string;
    original_title: string;
    overview: string;
    poster_path: string;
    media_type: string;
    genre_ids: number[];
    popularity: number;
    release_date: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface IMovieDetails {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: { id: number; name: string; poster_path: string; backdrop_path: string; } | null;
    budget: number;
    genres: { id: number; name: string; }[];
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: { id: number; logo_path: string; name: string; origin_country: string; }[];
    production_countries: { iso_3166_1: string; name: string; }[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: { english_name: string; iso_639_1: string; name: string; }[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    credits: {
        cast: ICast[];
        crew: ICrew[];
    };
    director: ICrew | null;
    similar: { page: number; results: SimilarMovie[]; };
    "watch/providers": { results: {
        [country: string]: {
            link: string;
            rent?: IProvider[];
            buy?: IProvider[];
            flatrate: IProvider[];
        }; 
    } };
}

export interface SimilarMovie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface ICast {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    popularity: number;
    profile_path: string;
    cast_id: number;
    character: string;
    order: number;
}

export interface ICrew {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    credit_id: string;
    department: string;
    job: string;
}

export interface IMovieStats {
    _id: string;
    movieId: number;
    views: number;
    likes: string[];
    trailer: string;
    createdAt: Date;
}

export interface MovieResults {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface SearchData {
    query: string;
    page: number;
}

type ShowTypes = IMovie | ISerieH | IPersonSearch;

export interface SearchResults {
    page: number;
    results: ShowTypes[];
    total_pages: number;
    total_results: number;
}

export interface IFavoriteMovie {
    _id: string;
    user: string;
    movie: IMovie;
}

export interface IMovieGenre {
    id: number;
    name: string;
}

export interface SortMovieResults {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface MovieState {
    movieDetails: IMovieDetails | null;
    movieStats: IMovieStats | null;
    movies: MovieResults | null;
    searchResults: SearchResults | null;
    moviesByGenre: SortMovieResults | null;
    moviesByYear: SortMovieResults | null;
    favoriteMovies: IFavoriteMovie[];
    trendingSeries: ISerieH[];
    latestMovies: IMovie[];
    popularPeople: IPerson[];
    movieGenres: IMovieGenre[];
    loadingMovieGenres: boolean;
    loadingMovieSeries: boolean;
    loadingMovieMovies: boolean;
    loadingMoviePeople: boolean;
    loadingMovieDetailsM: boolean;
    loadingMovieStats: boolean;
    loadingMovieLike: boolean;
    loadingMovieSearch: boolean;
    loadingMovieFavorite: boolean;
    loadingMovieFavoriteAll: boolean;
    loadingMovieSort: boolean;
    successMovie: boolean;
    errorMovie: boolean;
    messageMovie: string;
}