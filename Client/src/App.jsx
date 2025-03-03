import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import MoviesPage from "./pages/MoviesPage";
import IndividualMoviePage from "./pages/IndividualMoviePage";
import AddMoviePage from "./pages/AddMoviePage";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <main>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} /> 
        <Route path="/movies/:id" element={<IndividualMoviePage />} />
        <Route path="/add-movie" element={<AddMoviePage />} />
      </Routes>
    </main>
  );
}

//Route path means: When the URL has this, do this. When /movies is at the end of the URL, display the moviesPage.
