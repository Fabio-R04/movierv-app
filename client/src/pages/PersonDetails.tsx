import React, { useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getPersonDetails } from "../features/people/peopleSlice";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import FacebookIcon from "../components/svg/FacebookIcon";
import InstagramIcon from "../components/svg/InstagramIcon";
import TwitterIcon from "../components/svg/TwitterIcon";
import TiktokIcon from "../components/svg/TiktokIcon";
import Flickity from "react-flickity-component";
import ImageIcon from "../components/svg/ImageIcon";

function PersonDetails() {
    const {
        personDetails,
        loadingPeopleDetails
    } = useAppSelector((state) => state.people);
    const { personId } = useParams();

    const dispatch = useAppDispatch();
    const location = useLocation();

    useEffect(() => {
        if (Number(personId)) {
            dispatch(getPersonDetails(Number(personId)));
        }
    }, [personId]);

    return (
        <Layout showFilter={false}>
            <div className="movie-details">
                {(loadingPeopleDetails) ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="movie-details__overview-container">
                            <div className="movie-details__overview">
                                <img
                                    src={`https://image.tmdb.org/t/p/w342${personDetails?.profile_path}`}
                                    alt="Poster Path"
                                    className="movie-details__overview-img"
                                />
                                <div className="movie-details__overview-content">
                                    <div className="movie-details__overview-content__heading">
                                        <h1>{personDetails?.name} {personDetails?.birthday && <span>{`(${personDetails?.birthday?.split("-")[0]})`}</span>}</h1>
                                    </div>
                                    <div className="movie-details__overview-content__about">
                                        <p>{personDetails?.place_of_birth}</p>
                                    </div>
                                    <div className="movie-details__overview-content__description">
                                        <p>{personDetails?.biography}</p>
                                    </div>
                                </div>
                                <div className="movie-details__overview-interaction">
                                    <div className="movie-details__overview-interaction__interact">
                                        {personDetails?.external_ids["facebook_id"] && (
                                            <div>
                                                <div>
                                                    <FacebookIcon />
                                                </div>
                                                <Link to={`https://www.facebook.com/${personDetails.external_ids["facebook_id"]}`} target="_blank">Facebook</Link>
                                            </div>
                                        )}
                                        {personDetails?.external_ids["instagram_id"] && (
                                            <div>
                                                <div >
                                                    <InstagramIcon />
                                                </div>
                                                <Link to={`https://www.instagram.com/${personDetails.external_ids["instagram_id"]}`} target="_blank">Instagram</Link>
                                            </div>
                                        )}
                                        {personDetails?.external_ids["twitter_id"] && (
                                            <div>
                                                <div>
                                                    <TwitterIcon />
                                                </div>
                                                <Link to={`https://www.twitter.com/${personDetails.external_ids["twitter_id"]}`} target="_blank">Twitter</Link>
                                            </div>
                                        )}
                                        {personDetails?.external_ids["tiktok_id"] && (
                                            <div>
                                                <div>
                                                    <TiktokIcon />
                                                </div>
                                                <Link to={`https://www.tiktok.com/@${personDetails.external_ids["tiktok_id"]}`} target="_blank">Tiktok</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="movie-details__extra">
                                <nav className="movie-details__extra-navigation">
                                    <Link
                                        to={`/person/${personId}`}
                                        className={`${location.pathname === `/person/${personId}` ? "movie-details__extra-navigation__active" : ""}`}
                                    >
                                        Movies Known For
                                    </Link>
                                    <Link
                                        to={`/person/${personId}/series`}
                                        className={`${location.pathname === `/person/${personId}/series` ? "movie-details__extra-navigation__active" : ""}`}
                                    >
                                        Series Known For
                                    </Link>
                                </nav>
                                {location.pathname === `/person/${personId}` && (
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
                                            {personDetails?.movie_credits?.cast?.map((m) => (
                                                <Link
                                                    to={`/movie-details/${m.id}`}
                                                    key={m.id}
                                                    className="movie-details__extra-content__container movie-details__extra-similar__movie"
                                                    title={m.title}
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
                                {location.pathname === `/person/${personId}/series` && (
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
                                            {personDetails?.tv_credits?.cast?.map((p) => (
                                                <Link
                                                    to={`/tv-details/${p.id}`}
                                                    key={p.id}
                                                    className="movie-details__extra-content__container movie-details__extra-cast__person"
                                                    title={p.name}
                                                >
                                                    {p.poster_path ? (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w154${p.poster_path}`}
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
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default PersonDetails