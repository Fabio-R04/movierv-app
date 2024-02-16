import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getCollections } from "../features/collection/collectionSlice";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";

function Collections() {
    const {
        collections,
        loadingCollectionCollections
    } = useAppSelector((state) => state.collection);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getCollections());
    }, []);

    return (
        <Layout showFilter={true}>
            <div className="collections">
                {(loadingCollectionCollections) ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="collections__all">
                            {collections?.map((c) => (
                                <Link to={`/collection/${c.collectionId}`} key={c._id} className="collections__all-collection">
                                    <div style={{ backgroundImage: `url("https://image.tmdb.org/t/p/w780${c.backdropPath}")` }} className="collections__all-collection__background"></div>
                                    <div className="collections__all-collection__details">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w220_and_h330_face${c.posterPath}`}
                                            alt="Poster Path"
                                            className="collections__all-collection__details-img"
                                        />
                                        <p className="collections__all-collection__details-name">
                                            {c.name}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Collections