import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getFavoriteMovies } from "../features/movie/movieSlice";
import { getFavoriteSeries } from "../features/serie/serieSlice";
import { IFavoriteMovie } from "../features/movie/movieInterfaces";
import { IFavoriteSerie } from "../features/serie/serieInterfaces";
import Show, { ShowType } from "../components/Show";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";

function Favorites() {
    const {
        favoriteMovies,
        loadingMovieFavoriteAll
    } = useAppSelector((state) => state.movie);
    const {
        favoriteSeries,
        loadingSerieFavoriteAll
    } = useAppSelector((state) => state.serie);
    const { user } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            dispatch(getFavoriteMovies());
            dispatch(getFavoriteSeries());
        } else {
            navigate("/login");
        }
    }, []);

    return (
        <Layout showFilter={true}>
            <div className="favorites">
                {(loadingMovieFavoriteAll || loadingSerieFavoriteAll) ? (
                    <Spinner />
                ) : (
                    <>
                        <nav className="movie-details__extra-navigation favorites__navigation">
                            <Link
                                to={`/favorites`}
                                className={`${location.pathname === `/favorites` ? "movie-details__extra-navigation__active" : ""}`}
                            >
                                Movies
                            </Link>
                            <Link
                                to={`/favorites/series`}
                                className={`${location.pathname === `/favorites/series` ? "movie-details__extra-navigation__active" : ""}`}
                            >
                                Series
                            </Link>
                        </nav>
                        <div className="favorites__content">
                            {location.pathname === "/favorites" && (
                                favoriteMovies.length > 0 ? (
                                    <div className="favorites__shows">
                                        {favoriteMovies.map((f: IFavoriteMovie) => (
                                            <Show
                                                key={f._id}
                                                type={ShowType.MOVIE}
                                                showId={f.movie.id}
                                                title={f.movie.title}
                                                overview={f.movie.overview}
                                                posterPath={f.movie.poster_path}
                                                releaseDate={f.movie.release_date}
                                                voteAverage={f.movie.vote_average}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <h1 className="favorites__none">No Movies Favorited</h1>
                                )
                            )}
                            {location.pathname === "/favorites/series" && (
                                favoriteSeries.length > 0 ? (
                                    <div className="favorites__shows">
                                        {favoriteSeries.map((f: IFavoriteSerie) => (
                                            <Show
                                                key={f._id}
                                                type={ShowType.SERIE}
                                                showId={f.serie.id}
                                                name={f.serie.name}
                                                overview={f.serie.overview}
                                                posterPath={f.serie.poster_path}
                                                firstAirDate={f.serie.first_air_date}
                                                voteAverage={f.serie.vote_average}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <h1 className="favorites__none">No Series Favorited</h1>
                                )
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Favorites