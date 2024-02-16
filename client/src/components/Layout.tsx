import React, { useRef, ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { generateYearArray } from "../reuseable";
import { getMovieGenres } from "../features/movie/movieSlice";
import LoginIcon from "./svg/LoginIcon";
import LogoutIcon from "./svg/LogoutIcon";
import HomeIcon from "./svg/HomeIcon";
import MovieIcon from "./svg/MovieIcon";
import TvIcon from "./svg/TvIcon";
import CollectionIcon from "./svg/CollectionIcon";
import FavoriteIcon from "./svg/FavoriteIcon";
import SearchIcon from "./svg/SearchIcon";
import PeopleIcon from "./svg/PeopleIcon";
import ReviewIcon from "./svg/ReviewIcon";
import Media from "react-media";
import MenuIcon from "./svg/MenuIcon";
import MobileNavbar from "./MobileNavbar";

interface LayoutProps {
    children: ReactNode;
    showFilter: boolean;
}

function Layout({ children, showFilter }: LayoutProps) {
    const [mobileNavActive, setMobileNavActive] = useState<boolean>(false);
    const query = useRef<string>("");
    const { movieGenres, loadingMovieGenres } = useAppSelector((state) => state.movie);
    const { user } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (movieGenres.length < 1) {
            dispatch(getMovieGenres());
        }
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        query.current = event.target.value;
    }

    const handleSearchSubmit = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            if (query.current.trim() !== "") {
                navigate(`/search/${query.current}/1`);
            }
        }
    }

    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        navigate(`/genre/${event.target.value}/1`);
    }

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        navigate(`/year/${event.target.value}/1`);
    }

    return (
        <>
            <div className="layout">
                <nav className="layout__navbar">
                    <Media query="(max-width: 50em)" render={() => (
                        <div onClick={() => setMobileNavActive(true)} className="layout__navbar-menu">
                            <MenuIcon />
                            <p>MENU</p>
                        </div>
                    )} />
                    <Link to="/" className="layout__navbar-brand">
                        movie<span>rv</span>
                    </Link>
                    {user ? (
                        <Link onClick={(event: React.MouseEvent<HTMLAnchorElement>): void => {
                            event.preventDefault();
                            dispatch(logout());
                        }} to="/#" className="layout__navbar-btn">
                            <LogoutIcon />
                            Logout
                        </Link>
                    ) : (
                        <Link to="/login" className="layout__navbar-btn">
                            <LoginIcon />
                            Login
                        </Link>
                    )}
                </nav>
                <div className="layout__sidebar-container">
                    <nav className="layout__sidebar">
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
                <main className="layout__content">
                    {showFilter && (
                        <div className="layout__content-filter">
                            <div className="layout__content-filter__options">
                                <select className="layout__content-filter__options-select" onChange={handleGenreChange}>
                                    <option selected disabled>Genre</option>
                                    {loadingMovieGenres ? (
                                        <option value="loading">Loading.......</option>
                                    ) : (
                                        movieGenres.map((g) => (
                                            <option key={g.id} value={`${g.name}-${g.id}`}>
                                                {g.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                <select onChange={handleYearChange} className="layout__content-filter__options-select layout__content-filter__options-second">
                                    <option selected disabled>Year</option>
                                    {generateYearArray().map((year, i) => (
                                        <option key={i} value={year}>{year}</option>
                                    ))}
                                </select>
                                <div className="layout__content-filter__options-search">
                                    <SearchIcon onClick={() => {
                                        if (query.current.trim() !== "") {
                                            navigate(`/search/${query.current}/1`);
                                        }
                                    }} />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        onChange={handleSearchChange}
                                        onKeyDown={handleSearchSubmit}
                                    />
                                </div>
                            </div>
                            <p className="layout__content-filter__desc">
                                FILTER & SEARCH MOVIES OR TV SHOWS
                            </p>
                        </div>
                    )}
                    {children}
                </main>
            </div>
            <Media query="(max-width: 50em)" render={() => (
                <MobileNavbar
                    active={mobileNavActive}
                    setActive={setMobileNavActive}
                />
            )} />
        </>

    )
}

export default Layout