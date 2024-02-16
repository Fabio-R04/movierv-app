import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService from "./authService";
import { AuthState, AuthUser } from "./authInterfaces";
import { RegisterData } from "../../pages/Register";
import { LoginData } from "../../pages/Login";
import { toast } from "react-hot-toast";

const user: string | null = localStorage.getItem("user");

const initialState: AuthState = {
    user: user ? JSON.parse(user) : null,
    loadingAuthCreate: false,
    successAuth: false,
    errorAuth: false,
    messageAuth: ""
}

// POST
export const register = createAsyncThunk("auth/register", async (data: RegisterData, thunkAPI: any) => {
    try {
        return await authService.register(data);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const login = createAsyncThunk("auth/login", async (data: LoginData, thunkAPI: any) => {
    try {
        return await authService.login(data);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.successAuth = false;
            state.errorAuth = false;
            state.messageAuth = "";
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            document.location.href = "/login";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loadingAuthCreate = true;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<AuthUser>) => {
                state.loadingAuthCreate = false;
                state.successAuth = true;
                toast.success("Registration Successful!");
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action: PayloadAction<any>) => {
                state.loadingAuthCreate = false;
                state.errorAuth = true;
                state.messageAuth = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loadingAuthCreate = true;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<AuthUser>) => {
                state.loadingAuthCreate = false;
                state.successAuth = true;
                toast.success("Login Successful!");
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action: PayloadAction<any>) => {
                state.loadingAuthCreate = false;
                state.errorAuth = true;
                state.messageAuth = action.payload;
            })
    }
});

export const { resetAuth, logout } = authSlice.actions;
export default authSlice.reducer;