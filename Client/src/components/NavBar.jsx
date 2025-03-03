import { Link } from "react-router-dom";
import "./NavBar.css"; 

export default function NavBar() {
    return (
        <nav className="navbar">
        <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/add-movie">Add Movie</Link></li> 
        </ul>
        </nav>
    );
}
