import { Link } from "react-router-dom";
import "./HomePage.css"

export default function HomePage() {
    return (
        <div className="home-page">
            <h1>Welcome to Taran&apos;s Movie App!</h1>
            <p>This is an application where you can add, view, and delete movies.</p>
            <p>To get started, you can:</p>
            <ul>
                <li><Link to="/movies">View All Movies</Link></li>
                <li><Link to="/movies/new">Add a New Movie</Link></li>
            </ul>
        </div>
    );
}
