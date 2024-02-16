import axios from "axios";
import { URL, getConfig } from "../../reuseable";
import { IPerson, PeopleResults, PersonDetails } from "./peopleInterfaces";

// GET
const getPeople = async (page: number): Promise<PeopleResults> => {
    const response = await axios.get(
        `${URL}/people/all/${page}`,
        undefined
    );

    return response.data;
}

const getPersonDetails = async (personId: number): Promise<PersonDetails> => {
    const response = await axios.get(
        `${URL}/people/details/${personId}`,
        undefined
    );

    return response.data;
}

const peopleService = {
    getPeople,
    getPersonDetails
}

export default peopleService;