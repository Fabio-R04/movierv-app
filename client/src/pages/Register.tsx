import React, { useState, useEffect } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { toast } from "react-hot-toast";
import { register, resetAuth } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

export interface RegisterData {
    fullName: string;
    email: string;
    password: string;
}

function Register() {
    const [formData, setFormData] = useState<RegisterData>({
        fullName: "",
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
        dispatch(register(formData));
        setFormData({
            fullName: "",
            email: "",
            password: ""
        });
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
                            <p>START FOR FREE</p>
                            <p>Register</p>
                        </div>
                        <form onSubmit={onSubmit} className="auth__content-form">
                            <div className="auth__content-form__field">
                                <label htmlFor="full-name">Full Name</label>
                                <input
                                    value={formData.fullName}
                                    onChange={onChange}
                                    name="fullName"
                                    type="text"
                                    placeholder="Enter full name"
                                    id="full-name"
                                    required
                                />
                            </div>
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
                                Register now
                            </button>
                        </form>
                        <Link to="/login" className="auth__content-switch">
                            Already have an account? <span>Login &rarr;</span>
                        </Link>
                    </div>
                </>
            )}
        </div>
    )
}

export default Register;