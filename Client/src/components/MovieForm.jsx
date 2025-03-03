import { useState } from "react";
import { useNavigate } from "react-router-dom"; //Allows navigation to other routes on an event.
import './MovieForm.css'; 


export default function MovieForm() {
    const [movieData, setMovieData] = useState({
        title: "",
        release_year: "",
        genre: "",
        description: "",
        image_url: "",
        actors: ""  // use a single string for actors, separated by commas
    });

    const navigate = useNavigate(); // Initialize useNavigate

    async function handleSubmit(event) {
        event.preventDefault();
        
        // Split actors by comma, trim any extra spaces, and ensure it's an array
        const actorsArray = movieData.actors
            .split(",")
            .map(actor => actor.trim())
            .filter(actor => actor !== ""); // Remove empty values (if any)

        // Updates the movie data with actors as an array
        const dataToSend = { ...movieData, actors: actorsArray };

        try {
            const result = await fetch("https://week07-fullstack-database-app.onrender.com/movies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend) //send the datatoSend object as JSON to the server/api
            });

            const message = await result.json();
            console.log(message);

            // clear the form after submission
            setMovieData({
                title: "",
                release_year: "",
                genre: "",
                description: "",
                image_url: "",
                actors: ""  // Reset the actors field as well
            });

            // If the movie is successfully created, navigate to /movies
            navigate("/movies");

        } catch (error) {
            console.error("Something went wrong", error);
        }
    }

    function handleChange(event) {
        setMovieData({
            ...movieData,
            [event.target.name]: event.target.value
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Input fields for each movie attribute */}
            <input
                name="title"
                placeholder="Title"
                onChange={handleChange}
                value={movieData.title}  // Add value to ensure the input is controlled
                required
            />
            <input
                name="release_year"
                placeholder="Release Year"
                onChange={handleChange}
                value={movieData.release_year}  
                required
            />
            <input
                name="genre"
                placeholder="Genre"
                onChange={handleChange}
                value={movieData.genre}  
                required
            />
            <input
                name="description"
                placeholder="Description"
                onChange={handleChange}
                value={movieData.description}  
                required
            />
            <input
                name="image_url"
                placeholder="Image URL"
                onChange={handleChange}
                value={movieData.image_url}  
                required
            />
            {/* Actors Input: comma-separated actors */}
            <input
                name="actors"
                placeholder="Enter actors (comma separated)"
                onChange={handleChange}
                value={movieData.actors}  // Controlled input
                required
            />
            <button type="submit">Submit</button>
        </form>
    );
}
