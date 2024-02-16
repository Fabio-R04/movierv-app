import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getCollectionDetails } from "../features/collection/collectionSlice";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import Show, { ShowType } from "../components/Show";

function CollectionShows() {
    const {
        collectionDetails,
        loadingCollectionDetails
    } = useAppSelector((state) => state.collection);
    const { collectionId } = useParams();

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (Number(collectionId)) {
            const action = dispatch(getCollectionDetails(Number(collectionId)));

            return () => {
                action.abort();
            }
        }
    }, [collectionId]);

    return (
        <Layout showFilter={true}>
            <div className="collection-details">
                {loadingCollectionDetails ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="collection-details__shows">
                            {collectionDetails?.parts?.map((s) => (
                                <Show
                                    key={s.id}
                                    type={ShowType.MOVIE}
                                    showId={s.id}
                                    title={s.title}
                                    overview={s.overview}
                                    posterPath={s.poster_path}
                                    voteAverage={s.vote_average}
                                    releaseDate={s.release_date}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default CollectionShows