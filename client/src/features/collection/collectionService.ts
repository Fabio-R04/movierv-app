import axios from "axios";
import { URL, getConfig } from "../../reuseable";
import { CollectionDetails, ICollection } from "./collectionInterfaces";

// GET
const getCollections = async (): Promise<ICollection[]> => {
    const response = await axios.get(
        `${URL}/collection/all`,
        undefined
    );
    
    return response.data;
}

const getCollectionDetails = async (collectionId: number, signal: AbortSignal): Promise<CollectionDetails> => {
    const response = await axios.get(
        `${URL}/collection/details/${collectionId}`,
        { signal }
    );

    return response.data;
}

const collectionService = {
    getCollections,
    getCollectionDetails
} 

export default collectionService;