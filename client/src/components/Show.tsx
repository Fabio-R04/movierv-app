import React from "react";
import { Link } from "react-router-dom";
import StarIcon from "./svg/StarIcon";
import { KnownFor } from "../features/people/peopleInterfaces";
import { IMovie, ISerieH } from "../features/movie/movieInterfaces";
import ImageIcon from "./svg/ImageIcon";

export enum ShowType {
    MOVIE = "MOVIE",
    SERIE = "SERIE",
    PERSON = "PERSON"
}

interface ShowProps {
    showId: number;
    posterPath?: string;
    profilePath?: string;
    title?: string;
    name?: string;
    gender?: number;
    overview?: string;
    voteAverage?: number;
    releaseDate?: string;
    firstAirDate?: string;
    knownForDepartment?: string;
    knownFor?: KnownFor[];
    type: ShowType;
}

function Show({ showId, posterPath, title, name, overview, voteAverage, releaseDate, firstAirDate, type, profilePath, gender, knownForDepartment, knownFor }: ShowProps) {
    return (
        <Link to={`/${type === ShowType.MOVIE ? "movie-details" : type === ShowType.SERIE ? "tv-details" : "person"}/${showId}`} className="home__section-movies__movie">
            <div className="home__section-movies__movie-inner">
                <div className="home__section-movies__movie-front">
                    {type === ShowType.PERSON ? (
                        profilePath ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w300${profilePath}`}
                                alt="Profile Picture"
                            />
                        ) : (
                            <ImageIcon />
                        )
                    ) : (
                        posterPath ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w300${posterPath}`}
                                alt="Poster Picture"
                            />
                        ) : (
                            <ImageIcon />
                        )
                    )}
                </div>
                <div className="home__section-movies__movie-back">
                    <h1 className="home__section-movies__movie-back__title">
                        {type === ShowType.MOVIE ? (
                            title?.length! > 15 ? `${title?.slice(0, 13)}...` : title
                        ) : (
                            name?.length! > 15 ? `${name?.slice(0, 13)}...` : name
                        )}
                    </h1>
                    {type === ShowType.PERSON ? (
                        <div className="home__section-movies__movie-back__known">
                            {knownFor?.map((s) => (
                                <div key={s.id} className="home__section-movies__movie-back__known-show">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${s.poster_path}`}
                                        alt="Poster"
                                    />
                                    <p>{s.media_type === "movie" ? (s as IMovie).title : (s as ISerieH).name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="home__section-movies__movie-back__description">
                            {overview}
                        </p>
                    )}
                    <div className="home__section-movies__movie-back__bottom">
                        <div className="home__section-movies__movie-back__bottom-details">
                            {type === ShowType.PERSON ? (
                                <p>
                                    {gender === 1 ? "Female" : "Male"}
                                </p>
                            ) : (
                                <div>
                                    <StarIcon />
                                    <p>{voteAverage?.toFixed(1)}</p>
                                </div>
                            )}
                            <p>
                                {type === ShowType.MOVIE ? (
                                    releaseDate?.split("-")[0]
                                ) : (
                                    type === ShowType.SERIE ? (
                                        firstAirDate?.split("-")[0]
                                    ) : (
                                        knownForDepartment
                                    )
                                )}
                            </p>
                        </div>
                        <button className="home__section-movies__movie-back__bottom-btn">
                            View
                        </button>
                    </div>
                </div>
            </div>
        </Link >
    )
}

export default Show