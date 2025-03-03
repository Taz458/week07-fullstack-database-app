import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import "./IndividualMoviePage.css";

export default function IndividualMoviePage() {
    // State to store the movie info
    const [movieInfo, setMovieInfo] = useState({});
    const { id } = useParams(); // Get the movie ID from the URL
    const navigate = useNavigate(); // Use useNavigate for redirection after deletion

    // Fetch the movie data on component mount
    useEffect(() => {
        async function fetchMovie() {
            const res = await fetch(`https://week07-fullstack-database-app.onrender.com/movies/${id}?includes_actors=true`);
            const data = await res.json();
            setMovieInfo(data); // Set the movie data in state
        }
        fetchMovie();
    }, [id]);

    // Handle the delete action
    const handleDelete = async () => {
        try {
            // Send DELETE request to server
            const response = await fetch(`https://week07-fullstack-database-app.onrender.com/movies/${id}`, {
                method: 'DELETE',
            });

            // Parse the response to check for success
            const result = await response.json();
            console.log(result.message); // Log success message

            // Optionally redirect the user after deletion
            navigate('/movies'); // Redirect to movies list page
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    };

    return (
        <div className="individual-movie-page">
            <h2>{movieInfo.title}</h2>
            <img src={movieInfo.image_url} alt={movieInfo.title} />
            <p><strong>Release Year:</strong> {movieInfo.release_year}</p>
            <p><strong>Genre:</strong> {movieInfo.genre}</p>
            <p><strong>Description:</strong> {movieInfo.description}</p>

            {/* Display actors if available */}
            {movieInfo.actors && movieInfo.actors.length > 0 && (
                <div>
                    <strong>Actors:</strong>
                    <ul>
                        {movieInfo.actors.map((actor, index) => (
                            <li key={index}>{actor}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Delete button */}
            <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
                Delete Movie
            </button>
        </div>
    );
}
