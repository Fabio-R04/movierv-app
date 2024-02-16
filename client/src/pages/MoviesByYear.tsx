import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getMoviesByYear } from "../features/movie/movieSlice";
import Show, { ShowType } from "../components/Show";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import ReactPaginate from "react-paginate";

function MoviesByYear() {
    const {
        moviesByYear,
        loadingMovieSort
    } = useAppSelector((state) => state.movie);
    const { year, page } = useParams();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (Number(year) && Number(page)) {
            dispatch(getMoviesByYear({
                year: Number(year),
                page: Number(page)
            }));
        }
    }, [year, page]);

    const handlePageChange = (selectedItem: { selected: number; }): void => {
        navigate(`/year/${year}/${selectedItem.selected + 1}`);
    }

    return (
        <Layout showFilter={true}>
            <div className="sort-movies">
                {loadingMovieSort ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="sort-movies__all">
                            {moviesByYear?.results?.map((m) => (
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
                            pageCount={moviesByYear ? moviesByYear.total_pages > 500 ? 500 : moviesByYear.total_pages : 0}
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

export default MoviesByYear;