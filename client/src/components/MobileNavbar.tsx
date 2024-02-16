import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import CollectionIcon from "./svg/CollectionIcon";
import FavoriteIcon from "./svg/FavoriteIcon";
import HomeIcon from "./svg/HomeIcon";
import MovieIcon from "./svg/MovieIcon";
import PeopleIcon from "./svg/PeopleIcon";
import ReviewIcon from "./svg/ReviewIcon";
import TvIcon from "./svg/TvIcon";
import CloseIcon from "./svg/CloseIcon";
import LogoutIcon from "./svg/LogoutIcon";
import LoginIcon from "./svg/LoginIcon";

interface MoblieNavbarProps {
    active: boolean;
    setActive: (value: boolean) => void;
}

function MobileNavbar({ active, setActive }: MoblieNavbarProps) {
    const { user } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const location = useLocation();

    return (
        <div className={`mobile-navbar__container ${active ? "mobile-navbar__container-active" : ""}`}>
            <nav className="mobile-navbar">
                <Link onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                    event.preventDefault();
                    setActive(false);
                }} to="#">
                    <CloseIcon />
                    Close
                </Link>
                {user ? (
                    <Link onClick={(event: React.MouseEvent<HTMLAnchorElement>): void => {
                        event.preventDefault();
                        dispatch(logout());
                    }} to="/#">
                        <LogoutIcon />
                        Logout
                    </Link>
                ) : (
                    <Link to="/login">
                        <LoginIcon />
                        Login
                    </Link>
                )}
                <hr className="mobile-navbar__hr" />
                <Link className={`${location.pathname === "/" ? "layout__sidebar-active" : ""}`} to="/">
                    <HomeIcon />
                    Home
                </Link>
                <Link className={`${location.pathname.includes("/movies") ? "layout__sidebar-active" : ""}`} to="/movies/1">
                    <MovieIcon />
                    Movies
                </Link>
                <Link className={`${location.pathname.includes("/tv-series") ? "layout__sidebar-active" : ""}`} to="/tv-series/1">
                    <TvIcon />
                    TV Series
                </Link>
                <Link className={`${location.pathname === "/collections" ? "layout__sidebar-active" : ""}`} to="/collections">
                    <CollectionIcon />
                    Collections
                </Link>
                <Link className={`${location.pathname.includes("/people") ? "layout__sidebar-active" : ""}`} to="/people/1">
                    <PeopleIcon />
                    People
                </Link>
                <Link className={`${(location.pathname === "/favorites" || location.pathname === "/favorites/series") ? "layout__sidebar-active" : ""}`} to="/favorites">
                    <FavoriteIcon />
                    Favorites
                </Link>
                <Link className={`${(location.pathname === "/my-reviews" || location.pathname === "/my-reviews") ? "layout__sidebar-active" : ""}`} to="/my-reviews">
                    <ReviewIcon />
                    My Reviews
                </Link>
            </nav>
        </div>
    )
}

export default MobileNavbar