import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getLatestMovies, getPopularPeople, getTrendingSeries } from "../features/movie/movieSlice";
import { Link } from "react-router-dom";
import Flickity from "react-flickity-component";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import StarIcon from "../components/svg/StarIcon";
import Show, { ShowType } from "../components/Show";
import { getCollections } from "../features/collection/collectionSlice";

function Home() {
    const {
        trendingSeries,
        latestMovies,
        popularPeople,
        loadingMovieSeries,
        loadingMovieMovies,
        loadingMoviePeople
    } = useAppSelector((state) => state.movie);
    const {
        collections,
        loadingCollectionCollections
    } = useAppSelector((state) => state.collection);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getTrendingSeries());
        dispatch(getLatestMovies());
        dispatch(getPopularPeople());
        dispatch(getCollections());
    }, []);

    return (
        <Layout showFilter={true}>
            <div className="home">
                {(loadingMovieSeries || loadingMovieMovies || loadingMoviePeople || loadingCollectionCollections) ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="home__section">
                            <div className="home__section-heading">
                                <h1>Trending Series</h1>
                                <Link to="/tv-series/1">View All</Link>
                            </div>
                            <div className="home__section-content home__section-series">
                                <Flickity options={{
                                    autoPlay: true,
                                    draggable: false,
                                    cellAlign: "left",
                                    prevNextButtons: true,
                                    pageDots: false,
                                    lazyLoad: true,
                                    wrapAround: true,
                                    initialIndex: 1
                                }}>
                                    {trendingSeries?.map((s) => (
                                        <Link key={s.id} to={`/tv-details/${s.id}`} className="home__section-series__serie">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w300${s.backdrop_path}`}
                                                alt="Poster Path"
                                            />
                                            <div className="home__section-series__serie-details">
                                                <div className="home__section-series__serie-details__top">
                                                    <div className="home__section-series__serie-details__episodes">
                                                        <p>TMDB</p>
                                                        <p>{s.vote_average?.toFixed(1)}</p>
                                                    </div>
                                                    <p className="home__section-series__serie-details__category">TV</p>
                                                </div>
                                                <p className="home__section-series__serie-details__name">
                                                    {s.name}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </Flickity>
                            </div>
                        </div>
                        <div className="home__section">
                            <div className="home__section-heading">
                                <h1>Latest Movies</h1>
                                <Link to="/movies/1">View All</Link>
                            </div>
                            <div className="home__section-content home__section-movies">
                                {latestMovies?.slice(0, 8).map((m) => (
                                    <Show
                                        key={m.id}
                                        showId={m.id}
                                        posterPath={m.poster_path}
                                        overview={m.overview}
                                        voteAverage={m.vote_average}
                                        title={m.title}
                                        releaseDate={m.release_date}
                                        type={ShowType.MOVIE}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="home__section">
                            <div className="home__section-heading">
                                <h1>Collections</h1>
                                <Link to="/collections">View All</Link>
                            </div>
                            <div className="home__section-content home__section-collections">
                                <Flickity options={{
                                    autoPlay: true,
                                    draggable: false,
                                    cellAlign: "left",
                                    prevNextButtons: true,
                                    pageDots: false,
                                    lazyLoad: true,
                                    wrapAround: true,
                                    initialIndex: 1
                                }}>
                                    {collections?.slice(0, 20).map((c) => (
                                        <Link to={`/collection/${c.collectionId}`} key={c.collectionId} className="home__section-collections__collection">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w300${c.posterPath}`}
                                                alt="Poster Path"
                                            />
                                        </Link>
                                    ))}
                                </Flickity>
                            </div>
                        </div>
                        <div className="home__section">
                            <div className="home__section-heading">
                                <h1>Popular People</h1>
                                <Link to="/people/1">View All</Link>
                            </div>
                            <div className="home__section-content home__section-people">
                                {popularPeople?.slice(0, 8).map((p) => (
                                    <Link to={`/person/${p.id}`} key={p.id} className="home__section-people__person">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w220_and_h330_face${p.profile_path}`}
                                            alt="Person Picture"
                                            className="home__section-people__person-img"
                                        />
                                        <div className="home__section-people__person-details">
                                            <p>{p.name}</p>
                                            <p>{p.known_for_department}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Home