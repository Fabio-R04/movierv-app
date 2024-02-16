import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovies } from "../features/movie/movieSlice";
import { IMovie } from "../features/movie/movieInterfaces";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import Show, { ShowType } from "../components/Show";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import ReactPaginate from "react-paginate";

function Movies() {
    const {
        movies,
        loadingMovieMovies
    } = useAppSelector((state) => state.movie);
    const { page } = useParams();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (Number(page)) {
            dispatch(getMovies(Number(page)));
        }
    }, [page]);

    const handlePageChange = (event: any): void => {
        navigate(`/movies/${event.selected + 1}`);
    }

    return (
        <Layout showFilter={true}>
            <div className="movies">
                {loadingMovieMovies ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="movies__all">
                            {movies?.results?.map((m: IMovie) => (
                                <Show
                                    key={m.id}
                                    type={ShowType.MOVIE}
                                    showId={m.id}
                                    posterPath={m.poster_path}
                                    overview={m.overview}
                                    voteAverage={m.vote_average}
                                    title={m.title}
                                    releaseDate={m.release_date}
                                />
                            ))}
                        </div>
                        <ReactPaginate
                            className="movies__pages"
                            activeClassName="movies__pages-active"
                            pageCount={movies ? movies.total_pages > 500 ? 500 : movies.total_pages : 0}
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

export default Movies