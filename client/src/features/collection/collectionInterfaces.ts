export interface ICollection {
    _id: string;
    collectionId: number;
    name: string;
    posterPath: string;
    backdropPath: string;
}

export interface ICollectionDetails {
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

export interface CollectionData {
    collectionId: number;
    name: string;
    posterPath: string;
    backdropPath: string;
}

export interface CollectionDetails {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    parts: ICollectionDetails[];
}

export interface CollectionState {
    collectionDetails: CollectionDetails | null;
    collections: ICollection[];
    loadingCollectionCollections: boolean;
    loadingCollectionDetails: boolean;
    successCollection: boolean;
    errorCollection: boolean;
    messageCollection: string;
}