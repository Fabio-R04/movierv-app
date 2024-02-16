import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoutesAuth from "./components/PrivateRoutesAuth";
import MovieDetails from "./pages/MovieDetails";
import SerieDetails from "./pages/SerieDetails";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Collections from "./pages/Collections";
import CollectionShows from "./pages/CollectionShows";
import People from "./pages/People";
import PersonDetails from "./pages/PersonDetails";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import MoviesByGenre from "./pages/MoviesByGenre";
import MoviesByYear from "./pages/MoviesByYear";
import MyReviews from "./pages/MyReviews";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie-details/:movieId" element={<MovieDetails />} />
                <Route path="/movie-details/:movieId/cast" element={<MovieDetails />} />
                <Route path="/movie-details/:movieId/crew" element={<MovieDetails />} />
                <Route path="/tv-details/:serieId" element={<SerieDetails />} />
                <Route path="/tv-details/:serieId/cast" element={<SerieDetails />} />
                <Route path="/tv-details/:serieId/crew" element={<SerieDetails />} />
                <Route path="/movies/:page" element={<Movies />} />
                <Route path="/tv-series/:page" element={<Series />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collection/:collectionId" element={<CollectionShows />} />
                <Route path="/people/:page" element={<People />} />
                <Route path="/person/:personId" element={<PersonDetails />} />
                <Route path="/person/:personId/series" element={<PersonDetails />} />
                <Route path="/search/:query/:page" element={<Search />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/favorites/series" element={<Favorites />} />
                <Route path="/genre/:genreId/:page" element={<MoviesByGenre />} />
                <Route path="/year/:year/:page" element={<MoviesByYear />} />
                <Route path="/my-reviews" element={<MyReviews />} />
                <Route element={<PrivateRoutesAuth />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
            </Routes>
            <Toaster
                toastOptions={{
                    style: {
                        fontSize: "1.4rem",
                        fontWeight: 600,
                        color: "black"
                    }
                }}
            />
        </Router>
    );
}

export default App;
