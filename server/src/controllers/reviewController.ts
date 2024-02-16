import { Request, Response } from "express";
import ReviewM, { IReview } from "../models/reviewModel";
import { ISerie } from "../models/serieModel";
import { IMovie } from "../models/movieModel";

// GET
export const getReviews = async (req: Request, res: Response): Promise<void> => {
    const showId: number = Number(req.params.showId);

    if (!showId) {
        res.status(400).json({
            error: "Show ID not found."
        });
        return;
    }

    try {
        const reviews: IReview[] = await ReviewM.find({ $or: [{ "serie.id": showId }, { "movie.id": showId }] })
            .populate({
                path: "user",
                model: "User",
                select: "-password"
            })
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch reviews."
        });
    }
}

export const getMyReviews = async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.user._id;

    try {
        const myReviews: IReview[] = await ReviewM.find({ user: userId });
        res.status(200).json(myReviews);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch user reviews."
        });
    }
}

// POST
export const createReview = async (req: Request, res: Response): Promise<void> => {
    const { description, rating, show }: { description: string; rating: string; show: IMovie | ISerie; } = req.body;
    const type: string = req.params.type;
    const userId: string = req.user._id;

    if (!description || !rating || !show || !type) {
        res.status(400).json(({
            error: "Don't leave empty fields."
        }));
        return;
    }

    try {
        const alreadyReviewed = await ReviewM.exists({
            [type === "movie" ? "movie.id" : "serie.id"]: show.id,
            user: userId
        });

        if (alreadyReviewed) {
            res.status(400).json({
                error: "Already Reviewed."
            });
            return;
        }

        const newReview: IReview = await ReviewM.create({
            user: userId,
            type,
            ...(type === "movie" && { movie: show }),
            ...(type === "serie" && { serie: show }),
            description,
            rating: Number(rating)
        });

        await newReview.populate({
            path: "user",
            model: "User",
            select: "-password"
        });

        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({
            error: "Failed to create review."
        });
    }
}

// PUT
export const likeReview = async (req: Request, res: Response): Promise<void> => {
    const reviewId: string = req.params.reviewId;

    try {
        const review: IReview | null = await ReviewM.findById(reviewId);

        if (!review) {
            res.status(400).json({
                error: "Review not found."
            });
            return;
        }

        const alreadyLiked: boolean = review.likes.some((userId: string): boolean => {
            if (userId.toString() === req.user._id.toString()) {
                return true;
            }
            return false;
        });

        const alreadyDisliked: boolean = review.dislikes.some((userId: string): boolean => {
            if (userId.toString() === req.user._id.toString()) {
                return true;
            }
            return false;
        });

        if (alreadyLiked) {
            const updatedLikes: string[] = review.likes.filter((userId: string) => {
                if (userId.toString() !== req.user._id.toString()) {
                    return userId;
                }
            });

            review.likes = updatedLikes;
            await review.save();

            res.status(200).json({
                reviewId,
                likes: review.likes,
                dislikes: review.dislikes
            });
            return;
        }

        if (alreadyDisliked) {
            const updatedDislikes: string[] = review.dislikes.filter((userId: string) => {
                if (userId.toString() !== req.user._id.toString()) {
                    return userId;
                }
            });

            review.dislikes = updatedDislikes;
        }

        review.likes.push(req.user._id);
        await review.save();

        res.status(200).json({
            reviewId,
            likes: review.likes,
            dislikes: review.dislikes
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to like review."
        });
    }
}

export const dislikeReview = async (req: Request, res: Response): Promise<void> => {
    const reviewId: string = req.params.reviewId;

    try {
        const review: IReview | null = await ReviewM.findById(reviewId);

        if (!review) {
            res.status(400).json({
                error: "Review not found."
            });
            return;
        }

        const alreadyDisliked: boolean = review.dislikes.some((userId: string): boolean => {
            if (userId.toString() === req.user._id.toString()) {
                return true;
            }
            return false;
        });

        const alreadyLiked: boolean = review.likes.some((userId: string): boolean => {
            if (userId.toString() === req.user._id.toString()) {
                return true;
            }
            return false;
        });

        if (alreadyDisliked) {
            const updatedDislikes: string[] = review.dislikes.filter((userId: string) => {
                if (userId.toString() !== req.user._id.toString()) {
                    return userId;
                }
            });

            review.dislikes = updatedDislikes;
            await review.save();

            res.status(200).json({
                reviewId,
                likes: review.likes,
                dislikes: review.dislikes
            });
            return;
        }

        if (alreadyLiked) {
            const updatedLikes: string[] = review.likes.filter((userId: string) => {
                if (userId.toString() !== req.user._id.toString()) {
                    return userId;
                }
            });
            review.likes = updatedLikes;
        }

        review.dislikes.push(req.user._id);
        await review.save();

        res.status(200).json({
            reviewId,
            likes: review.likes,
            dislikes: review.dislikes
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to dislike review."
        });
    }
}

// DELETE
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
    const reviewId: string = req.params.reviewId;

    try {
        const deletedReview: IReview | null = await ReviewM.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            res.status(400).json({
                error: "Review not found."
            });
            return;
        }

        res.status(200).json({
            reviewId: deletedReview._id
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to delete review."
        });
    }
}