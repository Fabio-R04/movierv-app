import axios from "axios";
import { IReview, ReviewData } from "./reviewInterfaces";
import { URL, getConfig } from "../../reuseable";

// GET
const getReviews = async (showId: string): Promise<IReview[]> => {
    const response = await axios.get(
        `${URL}/review/reviews/${showId}`,
        undefined
    );

    return response.data;
}

const getMyReviews = async (token: string | null): Promise<IReview[]> => {
    const response = await axios.get(
        `${URL}/review/my-reviews`,
        getConfig(token)
    );

    return response.data;
}

// POST
const createReview = async (data: ReviewData, token: string | null): Promise<IReview> => {
    const response = await axios.post(
        `${URL}/review/create/${data.type}`,
        {
            description: data.description,
            rating: data.rating,
            show: data.show
        },
        getConfig(token)
    );

    return response.data;
}

// PUT
const likeReview = async (reviewId: string, token: string | null): Promise<{
    reviewId: string;
    likes: string[];
    dislikes: string[];
}> => {
    const response = await axios.put(
        `${URL}/review/like/${reviewId}`,
        undefined,
        getConfig(token)
    );

    return response.data;
}

const dislikeReview = async (reviewId: string, token: string | null): Promise<{
    reviewId: string;
    likes: string[];
    dislikes: string[];
}> => {
    const response = await axios.put(
        `${URL}/review/dislike/${reviewId}`,
        undefined,
        getConfig(token)
    );

    return response.data;
}

// DELETE
const deleteReview = async (reviewId: string, token: string | null): Promise<{ reviewId: string; }> => {
    const response = await axios.delete(
        `${URL}/review/delete/${reviewId}`,
        getConfig(token)
    );

    return response.data;
}

const reviewService = {
    createReview,
    getReviews,
    likeReview,
    dislikeReview,
    deleteReview,
    getMyReviews
}

export default reviewService;