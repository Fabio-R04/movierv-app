import express, { Router } from "express";
const router: Router = express.Router();

import {
    getGenres,
    getTrendingSeries,
    getLatestMovies,
    getPopularPeople,
    getMovieDetails,
    getMovieStats,
    likeMovie,
    getMovies,
    search,
    favoriteMovie,
    getFavoriteMovies,
    getMoviesByGenre,
    getMoviesByYear
} from "../controllers/movieController";
import { authenticateToken } from "../middleware/authMiddleware";

// GET
router.get("/genres", getGenres);
router.get("/trending-series", getTrendingSeries);
router.get("/latest-movies", getLatestMovies);
router.get("/popular-people", getPopularPeople);
router.get("/movie-details/:movieId", getMovieDetails);
router.get("/movie-stats/:movieId", getMovieStats);
router.get("/movies/:page", getMovies);
router.get("/search/:query/:page", search);
router.get("/favorite-movies", authenticateToken, getFavoriteMovies);
router.get("/genre-movies/:genreId/:page", getMoviesByGenre);
router.get("/year-movies/:year/:page", getMoviesByYear);

// PUT
router.put("/like/:movieId", authenticateToken, likeMovie);
router.put("/favorite", authenticateToken, favoriteMovie);

export default router;