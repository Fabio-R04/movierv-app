import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSeries } from "../features/serie/serieSlice";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import Show, { ShowType } from "../components/Show";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import ReactPaginate from "react-paginate";

function Series() {
    const {
        series,
        loadingSerieSeries
    } = useAppSelector((state) => state.serie);
    const { page } = useParams();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (Number(page)) {
            dispatch(getSeries(Number(page)));
        }
    }, [page]);

    const handlePageChange = (event: any): void => {
        navigate(`/tv-series/${event.selected + 1}`);
    }

    return (
        <Layout showFilter={true}>
            <div className="movies">
                {loadingSerieSeries ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="movies__all">
                            {series?.results?.map((m) => (
                                <Show
                                    key={m.id}
                                    type={ShowType.SERIE}
                                    showId={m.id}
                                    posterPath={m.poster_path}
                                    overview={m.overview}
                                    voteAverage={m.vote_average}
                                    name={m.name}
                                    firstAirDate={m.first_air_date}
                                />
                            ))}
                        </div>
                        <ReactPaginate
                            className="movies__pages"
                            activeClassName="movies__pages-active"
                            pageCount={series ? series.total_pages > 500 ? 500 : series.total_pages : 0}
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

export default Series;