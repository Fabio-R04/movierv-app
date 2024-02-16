import { IFavoriteMovie } from "../movie/movieInterfaces";
import { IFavoriteSerie } from "../serie/serieInterfaces";

export interface IUser {
    _id: string;
    fullName: string;
    email: string;
    createdAt: Date;
}

export interface AuthUser {
    _id: string;
    fullName: string;
    email: string;
    token: string;
}

export interface AuthState {
    user: AuthUser | null;
    loadingAuthCreate: boolean;
    successAuth: boolean;
    errorAuth: boolean;
    messageAuth: string;
}