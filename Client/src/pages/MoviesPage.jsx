import {useState, useEffect} from "react"
import { Link } from "react-router-dom"
import "./MoviesPage.css"

//Function to display my movies page, bascially a component. When the user clicks the movies link, the url will change to slash movies, and this component (MoviesPage.) will appear

export default function MoviesPage() {
    const[movies, setMovies] = useState([]) //have to use useState to change whats in movies, movies set to an empty array, setMovies is bascially the same as movies =
    
     // useEffect runs once when the component loads (empty dependency array [])
    useEffect(() => {
        async function fetchData() { 
            const res = await fetch(`https://week07-fullstack-database-app.onrender.com/movies`) //fetch movies from local api
            const data = await res.json() //convert response to JSON
            setMovies(data) // update the state(movies array) with the fetched movies
        }
        fetchData() //call the function, so movies now has an array with all the movies 
        }, [])

    return (
        <div className="movies-container">
            {/* Loop through movies array and create a movie card for each */}
            {movies.map(movie => (
                <div key={movie.id}>
                    {/* bascially an image and a title of the movie (a poster), when i click on it it will display the info for that indiivudal movie */}
                    <Link to={`/movies/${movie.id}`}>
                        {/* Display Movie Image and title */}
                        <img src={movie.image_url} alt={movie.title}/>
                        <h3 className="movie-title">{movie.title}</h3>
                    </Link>
                </div>
            ))}
        </div>
    )

}