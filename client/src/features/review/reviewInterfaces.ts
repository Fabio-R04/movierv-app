import { IUser } from "../auth/authInterfaces";
import { IMovie, ISerieH } from "../movie/movieInterfaces";

export interface IReview {
    _id: string;
    user: IUser;
    type: string;
    movie?: IMovie;
    serie?: ISerieH;
    description: string;
    rating: number;
    likes: string[];
    dislikes: string[];
    createdAt: Date;
}

export interface ReviewData {
    type: string;
    show: IMovie | ISerieH;
    description: string;
    rating: number;
}

export interface ReviewState {
    reviews: IReview[];
    myReviews: IReview[];
    loadingReviewCreate: boolean;
    loadingReviewAll: boolean;
    loadingReviewDelete: boolean;
    loadingReviewUser: boolean;
    successReview: boolean;
    errorReview: boolean;
    messageReview: string;
}