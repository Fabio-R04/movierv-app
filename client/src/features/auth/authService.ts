import axios from "axios";
import { RegisterData } from "../../pages/Register";
import { AuthUser } from "./authInterfaces";
import { URL } from "../../reuseable";
import { LoginData } from "../../pages/Login";

// POST
const register = async (data: RegisterData): Promise<AuthUser> => {
    const response = await axios.post(
        `${URL}/auth/register`,
        data,
        undefined
    );

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
}

const login = async (data: LoginData): Promise<AuthUser> => {
    const response = await axios.post(
        `${URL}/auth/login`,
        data,
        undefined
    );

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
}

const authService = {
    register,
    login
}

export default authService;