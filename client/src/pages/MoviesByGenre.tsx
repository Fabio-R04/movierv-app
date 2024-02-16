import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getMoviesByGenre } from "../features/movie/movieSlice";
import Show, { ShowType } from "../components/Show";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import ReactPaginate from "react-paginate";

function MoviesByGenre() {
    const {
        moviesByGenre,
        loadingMovieSort
    } = useAppSelector((state) => state.movie);
    const { genreId, page } = useParams();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (Number(genreId?.split("-")[1]) && Number(page)) {
            dispatch(getMoviesByGenre({
                genreId: Number(genreId?.split("-")[1]),
                page: Number(page)
            }));
        }
    }, [genreId, page]);

    const handlePageChange = (selectedItem: { selected: number; }): void => {
        navigate(`/genre/${genreId}/${selectedItem.selected + 1}`);
    }

    return (
        <Layout showFilter={true}>
            <div className="sort-movies">
                {loadingMovieSort ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="sort-movies__all">
                            {moviesByGenre?.results?.map((m) => (
                                <Show
                                    key={m.id}
                                    type={ShowType.MOVIE}
                                    showId={m.id}
                                    title={m.title}
                                    overview={m.overview}
                                    posterPath={m.poster_path}
                                    releaseDate={m.release_date}
                                    voteAverage={m.vote_average}
                                />
                            ))}
                        </div>
                        <ReactPaginate
                            className="movies__pages"
                            activeClassName="movies__pages-active"
                            pageCount={moviesByGenre ? moviesByGenre.total_pages > 500 ? 500 : moviesByGenre.total_pages : 0}
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

export default MoviesByGenre;