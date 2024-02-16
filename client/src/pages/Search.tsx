import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { search } from "../features/movie/movieSlice";
import { ISerie } from "../features/serie/serieInterfaces";
import { IMovie } from "../features/movie/movieInterfaces";
import Show, { ShowType } from "../components/Show";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import ReactPaginate from "react-paginate";
import { IPersonSearch } from "../features/people/peopleInterfaces";

function Search() { 
    const {
        searchResults,
        loadingMovieSearch
    } = useAppSelector((state) => state.movie);
    const { query, page } = useParams();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (query && query.trim() !== "" && Number(page)) {
            dispatch(search({
                query,
                page: Number(page)
            }));
        }
    }, [query, page]);

    const handlePageChange = (event: any): void => {
        navigate(`/search/${query}/${event.selected + 1}`);
    }

    return (
        <Layout showFilter={true}>
            <div className="search">
                {loadingMovieSearch ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="search__results">
                            {searchResults?.results?.map((r) => {
                                if (r.media_type === "movie") {
                                    const movie: IMovie = (r as IMovie);
                                    return (
                                        <Show
                                            key={movie.id}
                                            type={ShowType.MOVIE}
                                            showId={movie.id}
                                            title={movie.title}
                                            overview={movie.overview}
                                            posterPath={movie.poster_path}
                                            voteAverage={movie.vote_average}
                                            releaseDate={movie.release_date}
                                        />
                                    );
                                } else if (r.media_type === "tv") {
                                    const tvSerie: ISerie = (r as unknown as ISerie);
                                    return (
                                        <Show
                                            key={tvSerie.id}
                                            type={ShowType.SERIE}
                                            showId={tvSerie.id}
                                            name={tvSerie.name}
                                            overview={tvSerie.overview}
                                            posterPath={tvSerie.poster_path}
                                            voteAverage={tvSerie.vote_average}
                                            firstAirDate={tvSerie.first_air_date}
                                        />
                                    );
                                } else if (r.media_type === "person") {
                                    const person: IPersonSearch = (r as IPersonSearch);
                                    return (
                                        <Show
                                            key={person.id}
                                            type={ShowType.PERSON}
                                            showId={person.id}
                                            name={person.name}
                                            knownForDepartment={person.known_for_department}
                                            profilePath={person.profile_path}
                                            gender={person.gender}
                                            knownFor={person.known_for}
                                        />
                                    );
                                }
                            })}
                        </div>
                        <ReactPaginate
                            className="movies__pages"
                            activeClassName="movies__pages-active"
                            pageCount={searchResults ? searchResults.total_pages : 88}
                            initialPage={Number(page) - 1}
                            onPageChange={handlePageChange}
                            previousClassName="movies__pages-prev"
                            nextClassName="movies__pages-next"
                        />
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Search