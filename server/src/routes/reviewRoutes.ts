import express, { Router } from "express";
const router: Router = express.Router();

import {
    createReview,
    getReviews,
    likeReview,
    dislikeReview,
    deleteReview,
    getMyReviews
} from "../controllers/reviewController";
import { authenticateToken } from "../middleware/authMiddleware";

// GET
router.get("/reviews/:showId", getReviews);
router.get("/my-reviews", authenticateToken, getMyReviews);

// POST
router.post("/create/:type", authenticateToken, createReview);

// PUT
router.put("/like/:reviewId", authenticateToken, likeReview);
router.put("/dislike/:reviewId", authenticateToken, dislikeReview);

// DELETE
router.delete("/delete/:reviewId", authenticateToken, deleteReview);

export default router;