import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getMyReviews } from "../features/review/reviewSlice";
import { IMovie, ISerieH } from "../features/movie/movieInterfaces";
import Show, { ShowType } from "../components/Show";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";

function MyReviews() {
    const {
        myReviews,
        loadingReviewUser
    } = useAppSelector((state) => state.review);
    const { user } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            dispatch(getMyReviews());
        } else {
            navigate("/login");
        }
    }, []);

    return (
        <Layout showFilter={true}>
            <div className="my-reviews">
                {loadingReviewUser ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="my-reviews__all">
                            {myReviews.map((review) => {
                                if (review.type === "movie") {
                                    const movie: IMovie = (review.movie as IMovie);
                                    return (
                                        <Show
                                            key={review._id}
                                            type={ShowType.MOVIE}
                                            showId={movie.id}
                                            title={movie.title}
                                            overview={movie.overview}
                                            posterPath={movie.poster_path}
                                            releaseDate={movie.release_date}
                                            voteAverage={movie.vote_average}
                                        />
                                    );
                                } else if (review.type === "serie") {
                                    const serie: ISerieH = (review.serie as ISerieH);
                                    return (
                                        <Show
                                            key={review._id}
                                            type={ShowType.SERIE}
                                            showId={serie.id}
                                            name={serie.name}
                                            overview={serie.overview}
                                            posterPath={serie.poster_path}
                                            firstAirDate={serie.first_air_date}
                                            voteAverage={serie.vote_average}
                                        />
                                    );
                                }
                            })}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default MyReviews;