import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { resetAuth, login } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

export interface LoginData {
    email: string;
    password: string;
}

function Login() {
    const [formData, setFormData] = useState<LoginData>({
        email: "",
        password: ""
    });
    const {
        successAuth,
        errorAuth,
        messageAuth,
        loadingAuthCreate
    } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate: NavigateFunction = useNavigate();

    useEffect(() => {
        if (successAuth) {
            navigate("/");
        }

        if (errorAuth) {
            toast.error(messageAuth);
        }

        dispatch(resetAuth());
    }, [successAuth, errorAuth, messageAuth, navigate, dispatch]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;

        setFormData((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        dispatch(login(formData));
        setFormData({
            email: "",
            password: ""
        });
    }

    const handleDemoLogin = () => {
        dispatch(login({
            email: `${process.env.REACT_APP_DEMO_EMAIL}`,
            password: `${process.env.REACT_APP_DEMO_PASSWORD}`
        }));
    }

    return (
        <div className="auth">
            {loadingAuthCreate ? (
                <Spinner />
            ) : (
                <>
                    <Link to="/" className="auth__heading">movie<span>rv</span></Link>
                    <div className="auth__content">
                        <div className="auth__content-heading">
                            <p>WELCOME BACK</p>
                            <p>Log into your account</p>
                        </div>
                        <form onSubmit={onSubmit} className="auth__content-form">
                            <div className="auth__content-form__field">
                                <label htmlFor="email">Email</label>
                                <input
                                    value={formData.email}
                                    onChange={onChange}
                                    name="email"
                                    type="email"
                                    placeholder="Enter email"
                                    id="email"
                                    required
                                />
                            </div>
                            <div className="auth__content-form__field">
                                <label htmlFor="password">Password</label>
                                <input
                                    value={formData.password}
                                    onChange={onChange}
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    id="password"
                                    required
                                />
                            </div>
                            <button type="submit" className="auth__content-form__btn">
                                Login now
                            </button>
                        </form>
                        <p className="auth__content-or">or</p>
                        <button onClick={handleDemoLogin} className="auth__content-demo">
                            Login with Demo Account
                        </button>
                        <Link to="/register" className="auth__content-switch">
                            Not registered yet? <span>Register &rarr;</span>
                        </Link>
                    </div>
                </>
            )}
        </div>
    )
}

export default Login;