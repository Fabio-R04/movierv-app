import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import Flickity from "react-flickity-component";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import genreColorMapSerie from "../constants/genreColorMapSerie";
import ViewsIcon from "../components/svg/ViewsIcon";
import LikeIcon from "../components/svg/LikeIcon";
import PlayIcon from "../components/svg/PlayIcon";
import ImageIcon from "../components/svg/ImageIcon";
import { favoriteSerie, getFavoriteSeries, getSerieDetails, getSerieStats, likeSerie } from "../features/serie/serieSlice";
import { toast } from "react-hot-toast";
import { IEpisode } from "../features/serie/serieInterfaces";
import { createReview, dislikeReview, getReviews, likeReview } from "../features/review/reviewSlice";
import moment from "moment";
import DeleteIcon from "../components/svg/DeleteIcon";
import DislikeIcon from "../components/svg/DislikeIcon";
import EmpytStar from "../components/svg/EmpytStar";
import FullStar from "../components/svg/FullStar";
import Rating, { RatingComponentProps } from "react-rating";
import ConfirmPopup, { ConfirmTypes } from "../components/ConfirmPopup";
import FavoriteIcon from "../components/svg/FavoriteIcon";

function SerieDetails() {
    const [reviewActive, setReviewActive] = useState<{
        active: boolean;
        id: string;
    }>({
        active: false,
        id: ""
    });
    const [rating, setRating] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [selectedEpisode, setSelectedEpisode] = useState<IEpisode | null>(null);
    const { serieId } = useParams();
    const {
        serieDetails,
        serieStats,
        favoriteSeries,
        loadingSerieDetails,
        loadingSerieStats,
        loadingSerieLike,
        loadingSerieFavorite,
        loadingSerieFavoriteAll
    } = useAppSelector((state) => state.serie);
    const {
        reviews,
        loadingReviewAll,
        loadingReviewCreate,
        loadingReviewDelete
    } = useAppSelector((state) => state.review);
    const { user } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const ReactRating = Rating as unknown as React.FC<RatingComponentProps>;

    useEffect(() => {
        if (user) {
            dispatch(getFavoriteSeries());
        }
    }, []);

    useEffect(() => {
        if (serieId) {
            const serieDetails = dispatch(getSerieDetails(serieId));
            const serieStats = dispatch(getSerieStats(serieId));
            dispatch(getReviews(serieId));

            return () => {
                serieDetails.abort();
                serieStats.abort();
            }
        }
    }, [serieId, dispatch]);

    useEffect(() => {
        if (serieDetails) {
            setSelectedEpisode(serieDetails.seasonEpisodes[selectedSeason].episodes[0]);
        }
    }, [serieId, selectedSeason, serieDetails]);

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
                if (serieDetails) {
                    dispatch(createReview({
                        type: "serie",
                        rating,
                        description,
                        show: {
                            adult: serieDetails.adult,
                            backdrop_path: serieDetails.backdrop_path,
                            first_air_date: serieDetails.first_air_date,
                            genre_ids: serieDetails.genres.map((g) => g.id),
                            id: serieDetails.id,
                            media_type: "tv",
                            name: serieDetails.name,
                            origin_country: serieDetails.origin_country,
                            original_language: serieDetails.original_language,
                            original_name: serieDetails.original_name,
                            overview: serieDetails.overview,
                            popularity: serieDetails.popularity,
                            poster_path: serieDetails.poster_path,
                            vote_average: serieDetails.vote_average,
                            vote_count: serieDetails.vote_count
                        },
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
                {(loadingSerieDetails || loadingSerieStats || loadingReviewAll || loadingSerieFavoriteAll) ? (
                    <Spinner />
                ) : (
                    <>
                        <div
                            style={{ backgroundImage: `url("https://image.tmdb.org/t/p/original${serieDetails?.backdrop_path}")` }}
                            className="movie-details__container"
                        ></div>
                        <div className="movie-details__overview-container">
                            <div className="movie-details__overview">
                                <img
                                    src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${serieDetails?.poster_path}`}
                                    alt="Poster Path"
                                    className="movie-details__overview-img"
                                />
                                <div className="movie-details__overview-content">
                                    <div className="movie-details__overview-content__heading">
                                        <h1>{serieDetails?.name}</h1>
                                        <p>{serieDetails?.tagline}</p>
                                    </div>
                                    <div className="movie-details__overview-content__about">
                                        <div>
                                            <p>TMDb <span>{serieDetails?.vote_average?.toFixed(1)}</span></p>
                                        </div>
                                        <p>{serieDetails?.first_air_date?.split("-")[0]}</p>
                                        {serieDetails?.episode_run_time[0] && (
                                            <p>{serieDetails.episode_run_time[0]} min</p>
                                        )}
                                    </div>
                                    <div className="movie-details__overview-content__genres">
                                        {serieDetails?.genres?.map((g) => (
                                            <div style={{ backgroundColor: genreColorMapSerie[g.name] }} key={g.id}>
                                                <p>{g.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="movie-details__overview-content__description">
                                        <p>{serieDetails?.overview}</p>
                                    </div>
                                    {(serieDetails && serieDetails["watch/providers"] && Object.keys(serieDetails["watch/providers"].results).length !== 0) && (
                                        <div className="movie-details__overview-content__providers">
                                            {serieDetails["watch/providers"].results["US"]?.flatrate.map((p) => (
                                                <img
                                                    key={p.provider_id}
                                                    src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                                                    alt="Watch Provider Logo"
                                                    title={p.provider_name}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="movie-details__overview-interaction">
                                    <div className="movie-details__overview-interaction__interact">
                                        <div>
                                            <div>
                                                <ViewsIcon />
                                            </div>
                                            <p>{serieStats?.views} Views</p>
                                        </div>
                                        <div onClick={() => dispatch(likeSerie(serieId as string))}>
                                            <div className={serieStats?.likes?.find((u) => u === user?._id) ? "movie-details__overview-interaction__interact-active" : ""}>
                                                {loadingSerieLike ? (
                                                    <Spinner
                                                        height="2rem"
                                                        width="2rem"
                                                        flex={true}
                                                    />
                                                ) : (
                                                    <LikeIcon />
                                                )}
                                            </div>
                                            <p>{serieStats?.likes?.length} Likes</p>
                                        </div>
                                        <Link onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                                            if (serieStats?.trailer === "Not Found") {
                                                event.preventDefault();
                                                toast.error("Trailer not found.");
                                            }
                                        }} to={`https://youtube.com/watch?v=${serieStats?.trailer}`} target="_blank">
                                            <div>
                                                <PlayIcon />
                                            </div>
                                            <p>Trailer</p>
                                        </Link>
                                        <div onClick={() => {
                                            if (serieDetails) {
                                                dispatch(favoriteSerie({
                                                    adult: serieDetails.adult,
                                                    backdrop_path: serieDetails.backdrop_path,
                                                    first_air_date: serieDetails.first_air_date,
                                                    genre_ids: serieDetails.genres.map((g) => g.id),
                                                    id: serieDetails.id,
                                                    media_type: "tv",
                                                    name: serieDetails.name,
                                                    origin_country: serieDetails.origin_country,
                                                    original_language: serieDetails.original_language,
                                                    original_name: serieDetails.original_name,
                                                    overview: serieDetails.overview,
                                                    popularity: serieDetails.popularity,
                                                    poster_path: serieDetails.poster_path,
                                                    vote_average: serieDetails.vote_average,
                                                    vote_count: serieDetails.vote_count
                                                }));
                                            }
                                        }}>
                                            <div className={favoriteSeries.find((favorite) => favorite.serie.id === serieDetails?.id) ? "movie-details__overview-interaction__interact-active" : ""}>
                                                {loadingSerieFavorite ? (
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
                                </div>
                            </div>
                            <div className="serie-details__seasons">
                                <div className="serie-details__seasons-details serie-details__seasons-seasons">
                                    <h1>Seasons</h1>
                                    <div className="serie-details__seasons-episodes__all">
                                        {[...Array(serieDetails?.number_of_seasons)].map((_: void, index: number) => (
                                            <p style={(index + 1) % 2 === 1 ? { backgroundColor: "#151111" } : {}} onClick={() => setSelectedSeason(index + 1)} key={index} className={`${selectedSeason === index + 1 ? "serie-details__seasons-active" : ""} serie-details__seasons-seasons__season`}>
                                                Season {index + 1}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                                <div className="serie-details__seasons-details serie-details__seasons-episodes">
                                    <h1>Episodes</h1>
                                    <div className="serie-details__seasons-episodes__all">
                                        {serieDetails?.seasonEpisodes[selectedSeason]?.episodes?.map((e, index) => (
                                            <div onClick={() => setSelectedEpisode(e)} style={(index + 1) % 2 === 1 ? { backgroundColor: "#151111" } : {}} key={e.id} className={`${selectedEpisode?.id === e.id ? "serie-details__seasons-active" : ""} serie-details__seasons-details__container`}>
                                                <p>{index + 1}</p>
                                                <p className={`serie-details__seasons-episodes__episode`}>
                                                    {e.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="serie-details__seasons-details serie-details__seasons-episode__details">
                                    <h1>{`Season ${selectedEpisode?.season_number} Episode ${selectedEpisode?.episode_number}`} : {selectedEpisode?.name}</h1>
                                    <div className="serie-details__seasons-episode__details-img">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w780${selectedEpisode?.still_path}`}
                                            alt="Episode Image"
                                        />
                                        <p>{selectedEpisode?.air_date}</p>
                                    </div>
                                    <p>{selectedEpisode?.overview}</p>
                                </div>
                            </div>
                            <div className="movie-details__extra">
                                <nav className="movie-details__extra-navigation">
                                    <Link
                                        to={`/tv-details/${serieId}`}
                                        className={`${location.pathname === `/tv-details/${serieId}` ? "movie-details__extra-navigation__active" : ""}`}
                                    >
                                        Similar
                                    </Link>
                                    <Link
                                        to={`/tv-details/${serieId}/cast`}
                                        className={`${location.pathname === `/tv-details/${serieId}/cast` ? "movie-details__extra-navigation__active" : ""}`}
                                    >
                                        Cast
                                    </Link>
                                    <Link
                                        to={`/tv-details/${serieId}/crew`}
                                        className={`${location.pathname === `/tv-details/${serieId}/crew` ? "movie-details__extra-navigation__active" : ""}`}
                                    >
                                        Crew
                                    </Link>
                                </nav>
                                {location.pathname === `/tv-details/${serieId}` && (
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
                                            {serieDetails?.similar?.results.map((m) => (
                                                <Link
                                                    to={`/tv-details/${m.id}`}
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
                                {location.pathname === `/tv-details/${serieId}/cast` && (
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
                                            {serieDetails?.credits?.cast?.map((p) => (
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
                                {location.pathname === `/tv-details/${serieId}/crew` && (
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
                                            {serieDetails?.credits?.crew?.map((p) => (
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
                                                    <div className="movie-details__reviews-all__review">
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
        </Layout >
    )
}

export default SerieDetails;