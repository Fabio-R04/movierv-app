import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { favoriteMovie, getFavoriteMovies, getMovieDetails, getMovieStats, likeMovie } from "../features/movie/movieSlice";
import { createReview, dislikeReview, getReviews, likeReview } from "../features/review/reviewSlice";
import { toast } from "react-hot-toast";
import Rating, { RatingComponentProps } from "react-rating";
import moment from "moment";
import Flickity from "react-flickity-component";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import genreColorMap from "../constants/genreColorMap";
import ViewsIcon from "../components/svg/ViewsIcon";
import LikeIcon from "../components/svg/LikeIcon";
import PlayIcon from "../components/svg/PlayIcon";
import ImageIcon from "../components/svg/ImageIcon";
import EmpytStar from "../components/svg/EmpytStar";
import FullStar from "../components/svg/FullStar";
import DislikeIcon from "../components/svg/DislikeIcon";
import DeleteIcon from "../components/svg/DeleteIcon";
import ConfirmPopup, { ConfirmTypes } from "../components/ConfirmPopup";
import FavoriteIcon from "../components/svg/FavoriteIcon";


function MovieDetails() {
    const [reviewActive, setReviewActive] = useState<{
        active: boolean;
        id: string;
    }>({
        active: false,
        id: ""
    });
    const [rating, setRating] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const { movieId } = useParams();
    const {
        movieDetails,
        movieStats,
        favoriteMovies,
        loadingMovieDetailsM,
        loadingMovieStats,
        loadingMovieLike,
        loadingMovieFavorite,
        loadingMovieFavoriteAll
    } = useAppSelector((state) => state.movie);
    const {
        reviews,
        loadingReviewCreate,
        loadingReviewAll,
        loadingReviewDelete
    } = useAppSelector((state) => state.review);
    const { user } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const ReactRating = Rating as unknown as React.FC<RatingComponentProps>;

    useEffect(() => {
        if (user) {
            dispatch(getFavoriteMovies());
        }
    }, []);

    useEffect(() => {
        if (movieId) {
            dispatch(getMovieDetails(movieId));
            const action = dispatch(getMovieStats(movieId));
            dispatch(getReviews(movieId));

            return () => {
                action.abort();
            }
        }
    }, [movieId]);

    const handleRatingChange = (value: number): void => {
        setRating(value);
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setDescription(event.target.value);
    }

    const handleReviewSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (user) {
            if (rating === 0) {
                toast.error("Please select a rating.");
            } else {
                if (movieDetails) {
                    dispatch(createReview({
                        type: "movie",
                        rating,
                        description,
                        show: {
                            adult: movieDetails.adult,
                            backdrop_path: movieDetails.backdrop_path,
                            genre_ids: movieDetails.genres.map((g) => g.id),
                            id: movieDetails.id,
                            media_type: "movie",
                            original_language: movieDetails.original_language,
                            original_title: movieDetails.original_title,
                            overview: movieDetails.overview,
                            popularity: movieDetails.popularity,
                            poster_path: movieDetails.poster_path,
                            release_date: movieDetails.release_date,
                            title: movieDetails.title,
                            video: movieDetails.video,
                            vote_average: movieDetails.vote_average,
                            vote_count: movieDetails.vote_count
                        }
                    }));
                    setRating(0);
                    setDescription("");
                }
            }
        } else {
            navigate("/login");
        }
    }

    return (
        <Layout showFilter={false}>
            <div className="movie-details">
                {(loadingMovieDetailsM || loadingMovieStats || loadingReviewAll || loadingMovieFavoriteAll) ? (
                    <Spinner />
                ) : (
                    <>
                        <div
                            style={{ backgroundImage: `url("https://image.tmdb.org/t/p/original${movieDetails?.backdrop_path}")` }}
                            className="movie-details__container"
                        ></div>
                        <div className="movie-details__overview-container">
                            <div className="movie-details__overview">
                                <img
                                    src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movieDetails?.poster_path}`}
                                    alt="Poster Path"
                                    className="movie-details__overview-img"
                                />
                                <div className="movie-details__overview-content">
                                    <div className="movie-details__overview-content__heading">
                                        <h1>{movieDetails?.title}</h1>
                                        <p>{movieDetails?.tagline}</p>
                                    </div>
                                    <div className="movie-details__overview-content__about">
                                        <div>
                                            <p>TMDb <span>{movieDetails?.vote_average?.toFixed(1)}</span></p>
                                        </div>
                                        <p>{movieDetails?.release_date?.split("-")[0]}</p>
                                        <p>{movieDetails?.runtime} min</p>
                                    </div>
                                    <div className="movie-details__overview-content__genres">
                                        {movieDetails?.genres?.map((g) => (
                                            <div style={{ backgroundColor: genreColorMap[g.name] }} key={g.id}>
                                                <p>{g.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="movie-details__overview-content__description">
                                        <p>{movieDetails?.overview}</p>
                                    </div>
                                    {movieDetails?.belongs_to_collection && (
                                        <div className="movie-details__overview-content__collection">
                                            <img
                                                onClick={() => navigate(`/collection/${movieDetails?.belongs_to_collection?.id}`)}
                                                src={`https://image.tmdb.org/t/p/w92${movieDetails.belongs_to_collection.poster_path}`}
                                                alt="Poster Path"
                                            />
                                            <Link to={`/collection/${movieDetails.belongs_to_collection.id}`}>
                                                {movieDetails.belongs_to_collection.name}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <div className="movie-details__overview-interaction">
                                    <div className="movie-details__overview-interaction__interact">
                                        <div>
                                            <div>
                                                <ViewsIcon />
                                            </div>
                                            <p>{movieStats?.views} Views</p>
                                        </div>
                                        <div onClick={() => dispatch(likeMovie(movieId as string))}>
                                            <div className={movieStats?.likes?.find((u) => u === user?._id) ? "movie-details__overview-interaction__interact-active" : ""}>
                                                {loadingMovieLike ? (
                                                    <Spinner
                                                        height="2rem"
                                                        width="2rem"
                                                        flex={true}
                                                    />
                                                ) : (
                                                    <LikeIcon />
                                                )}
                                            </div>
                                            <p>{movieStats?.likes?.length} Likes</p>
                                        </div>
                                        <div>
                                            <div>
                                                <PlayIcon />
                                            </div>
                                            <Link to={`https://youtube.com/watch?v=${movieStats?.trailer}`} target="_blank">Trailer</Link>
                                        </div>
                                        <div onClick={() => {
                                            if (movieDetails) {
                                                dispatch(favoriteMovie({
                                                    adult: movieDetails.adult,
                                                    backdrop_path: movieDetails.backdrop_path,
                                                    genre_ids: movieDetails.genres.map((g) => g.id),
                                                    id: movieDetails.id,
                                                    media_type: "movie",
                                                    original_language: movieDetails.original_language,
                                                    original_title: movieDetails.original_title,
                                                    overview: movieDetails.overview,
                                                    popularity: movieDetails.popularity,
                                                    poster_path: movieDetails.poster_path,
                                                    release_date: movieDetails.release_date,
                                                    title: movieDetails.title,
                                                    video: movieDetails.video,
                                                    vote_average: movieDetails.vote_average,
                                                    vote_count: movieDetails.vote_count
                                                }));
                                            }
                                        }}>
                                            <div className={favoriteMovies.find((favorite) => favorite.movie.id === movieDetails?.id) ? "movie-details__overview-interaction__interact-active" : ""}>
                                                {loadingMovieFavorite ? (
                                                    <Spinner
                                                        height="2rem"
                                                        width="2rem"
                                                        flex={true}
                                                    />
                                                ) : (
                                                    <FavoriteIcon />
                                                )}
                                            </div>
                                            <p>Favorite</p>
                                        </div>
                                    </div>
                                    {movieDetails?.director && (
                                        <div onClick={() => navigate(`/person/${movieDetails.director?.id}`)} className="movie-details__overview-interaction__director">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w150_and_h150_face${movieDetails.director.profile_path}`}
                                                alt="Profile Path"
                                                className="movie-details__overview-interaction__director-img"
                                            />
                                            <div className="movie-details__overview-interaction__director-details">
                                                <p>{movieDetails.director.name}</p>
                                                <p>{movieDetails.director.job}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="movie-details__extra">
                                <nav className="movie-details__extra-navigation">
                                    <Link
                                        to={`/movie-details/${movieId}`}
                                        className={`${location.pathname === `/movie-details/${movieId}` ? "movie-details__extra-navigation__active" : ""}`}
                                    >
                                        Similar
                                    </Link>
                                    <Link
                                        to={`/movie-details/${movieId}/cast`}
                                        className={`${location.pathname === `/movie-details/${movieId}/cast` ? "movie-details__extra-navigation__active" : ""}`}
                                    >
                                        Cast
                                    </Link>
                                    <Link
                                        to={`/movie-details/${movieId}/crew`}
                                        className={`${location.pathname === `/movie-details/${movieId}/crew` ? "movie-details__extra-navigation__active" : ""}`}
                                    >
                                        Crew
                                    </Link>
                                </nav>
                                {location.pathname === `/movie-details/${movieId}` && (
                                    <div className="movie-details__extra-content movie-details__extra-similar">
                                        <Flickity options={{
                                            autoPlay: false,
                                            draggable: false,
                                            cellAlign: "left",
                                            prevNextButtons: true,
                                            pageDots: false,
                                            lazyLoad: true,
                                            wrapAround: true,
                                            contain: true,
                                            initialIndex: 1
                                        }}>
                                            {movieDetails?.similar?.results.map((m) => (
                                                <Link
                                                    to={`/movie-details/${m.id}`}
                                                    key={m.id}
                                                    className="movie-details__extra-content__container movie-details__extra-similar__movie"
                                                >
                                                    {m.poster_path ? (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w154${m.poster_path}`}
                                                            alt="Poster Path"
                                                            className="movie-details__extra-similar__movie-img"
                                                        />
                                                    ) : (
                                                        <div className="movie-details__extra-similar__movie-null">
                                                            <ImageIcon />
                                                        </div>
                                                    )}
                                                </Link>
                                            ))}
                                        </Flickity>
                                    </div>
                                )}
                                {location.pathname === `/movie-details/${movieId}/cast` && (
                                    <div className="movie-details__extra-content movie-details__extra-cast">
                                        <Flickity options={{
                                            autoPlay: false,
                                            draggable: false,
                                            cellAlign: "left",
                                            prevNextButtons: true,
                                            pageDots: false,
                                            lazyLoad: true,
                                            wrapAround: true,
                                            initialIndex: 1
                                        }}>
                                            {movieDetails?.credits?.cast?.map((p) => (
                                                <Link
                                                    to={`/person/${p.id}`}
                                                    key={p.id}
                                                    className="movie-details__extra-content__container movie-details__extra-cast__person"
                                                >
                                                    {p.profile_path ? (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w154${p.profile_path}`}
                                                            alt="Poster Path"
                                                            className="movie-details__extra-cast__person-img"
                                                        />
                                                    ) : (
                                                        <ImageIcon />
                                                    )}
                                                </Link>
                                            ))}
                                        </Flickity>
                                    </div>
                                )}
                                {location.pathname === `/movie-details/${movieId}/crew` && (
                                    <div className="movie-details__extra-content movie-details__extra-crew">
                                        <Flickity options={{
                                            autoPlay: false,
                                            draggable: false,
                                            cellAlign: "left",
                                            prevNextButtons: true,
                                            pageDots: false,
                                            lazyLoad: true,
                                            wrapAround: true,
                                            initialIndex: 1
                                        }}>
                                            {movieDetails?.credits?.crew?.map((p) => (
                                                <Link
                                                    to={`/person/${p.id}`}
                                                    key={p.id}
                                                    className="movie-details__extra-content__container movie-details__extra-crew__person"
                                                >
                                                    {p.profile_path ? (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w154${p.profile_path}`}
                                                            alt="Poster Path"
                                                            className="movie-details__extra-crew__person-img"
                                                        />
                                                    ) : (
                                                        <ImageIcon />
                                                    )}
                                                </Link>
                                            ))}
                                        </Flickity>
                                    </div>
                                )}
                            </div>
                            <div className="movie-details__reviews">
                                <div className="movie-details__reviews-heading">
                                    <p>{reviews?.length === 1 ? `${reviews?.length} Review` : `${reviews?.length} Reviews`}</p>
                                </div>
                                <div className="movie-details__reviews-container">
                                    <form onSubmit={handleReviewSubmit} className="movie-details__reviews-form">
                                        <div className="movie-details__reviews-form__field">
                                            <label htmlFor="review">Your Review</label>
                                            <textarea required onChange={handleDescriptionChange} value={description} id="review" cols={20} rows={5} placeholder="Enter review"></textarea>
                                        </div>
                                        <div className="movie-details__reviews-form__field">
                                            <label>Your Rating</label>
                                            <ReactRating
                                                initialRating={rating}
                                                readonly={false}
                                                emptySymbol={<EmpytStar height="3.2rem" width="3.2rem" />}
                                                fullSymbol={<FullStar height="3.2rem" width="3.2rem" />}
                                                onChange={handleRatingChange}
                                            />
                                        </div>
                                        <button disabled={user ? false : true} type="submit" className="movie-details__reviews-form__btn">
                                            {loadingReviewCreate ? (
                                                <Spinner
                                                    flex={true}
                                                    height="2rem"
                                                    width="2rem"
                                                />
                                            ) : (
                                                "Post Review"
                                            )}
                                        </button>
                                    </form>
                                    <div className="movie-details__reviews-all">
                                        <p className="movie-details__reviews-all__heading">
                                            Reviews
                                        </p>
                                        {loadingReviewDelete ? (
                                            <Spinner />
                                        ) : (
                                            reviews?.length > 0 ? (
                                                reviews?.map((r) => (
                                                    <div key={r._id} className="movie-details__reviews-all__review">
                                                        <div className="movie-details__reviews-all__review-heading">
                                                            <p>{r.user?.fullName}</p>
                                                            <ReactRating
                                                                initialRating={r.rating}
                                                                readonly={true}
                                                                emptySymbol={<EmpytStar height="2rem" width="2rem" />}
                                                                fullSymbol={<FullStar height="2rem" width="2rem" />}
                                                            />
                                                            <p>{moment(r.createdAt).format("DD MMM YYYY")}</p>
                                                        </div>
                                                        <p className="movie-details__reviews-all__review-description">
                                                            {r.description}
                                                        </p>
                                                        <div className="movie-details__reviews-all__review-interact">
                                                            <div>
                                                                <LikeIcon
                                                                    onClick={() => dispatch(likeReview(r._id))}
                                                                    style={r.likes.find((userId: string) => userId === user?._id) ? { fill: "#e50914" } : {}}
                                                                />
                                                                <DislikeIcon
                                                                    onClick={() => dispatch(dislikeReview(r._id))}
                                                                    style={r.dislikes.find((userId: string) => userId === user?._id) ? { fill: "#e50914" } : {}}
                                                                />
                                                                {r.user?._id === user?._id && (
                                                                    <DeleteIcon
                                                                        onClick={() => setReviewActive({ active: true, id: r._id })}
                                                                    />
                                                                )}
                                                            </div>
                                                            <p>{r.likes?.length === 1 ? `${r.likes?.length} Like` : `${r.likes?.length} Likes`}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <h1 className="movie-details__reviews-all__none">No Reviews</h1>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {reviewActive.active && (
                            <ConfirmPopup
                                active={reviewActive}
                                setActive={setReviewActive}
                                type={ConfirmTypes.DELETE_REVIEW}
                                title="REVIEW"
                            />
                        )}
                    </>
                )}
            </div>
        </Layout>
    )
}

export default MovieDetails;