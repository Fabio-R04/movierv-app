import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getPeople } from "../features/people/peopleSlice";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import ReactPaginate from "react-paginate";

function People() {
    const {
        allPeople,
        loadingPeopleAll
    } = useAppSelector((state) => state.people);
    const { page } = useParams();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (Number(page)) {
            dispatch(getPeople(Number(page)));
        }
    }, [page]);

    const handlePageChange = (event: any): void => {
        navigate(`/people/${event.selected + 1}`);
    }

    return (
        <Layout showFilter={true}>
            <div className="people">
                {loadingPeopleAll ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="people__all">
                            {allPeople?.results?.map((p) => (
                                <Link key={p.id} to={`/person/${p.id}`} className="people__all-person">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w220_and_h330_face${p.profile_path}`}
                                        alt="Person Picture"
                                        className="people__all-person__img"
                                    />
                                    <div className="people__all-person__details">
                                        <p className="people__all-person__details-name">
                                            {p.name}
                                        </p>
                                        <p className="people__all-person__details-department">
                                            {p.known_for_department}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <ReactPaginate
                            className="movies__pages"
                            activeClassName="movies__pages-active"
                            pageCount={allPeople ? allPeople.total_pages > 500 ? 500 : allPeople.total_pages : 0}
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

export default People;