import express from "express"
import dotenv from "dotenv"
import pg from "pg"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())
dotenv.config()

//db is now my database on supabase, can query tables inside the database
const db = new pg.Pool({connectionString: process.env.DB_URL})

//Root route working
app.get('/', (req, res) => res.send('Root route working'))

//I'm gonna start so the user can just use /movies and see all the movies, by querying the movies table and selecting all.
//Get all movies
app.get('/movies', async (req, res) => { //if the user types /movies in the url: do this. REQ = the request object (what the user sends), RES = the response (what i send back)
    try {
        // fetch my movies
        const movies = (await db.query(`SELECT * FROM movies`)).rows //rows sends back just the rows, no metadata
        res.status(200).json(movies) //res.status 200 means OK, and .json(movies) means send the list of movies as JSON which front end can easily use. res.(response i want it to respond)
    } catch (err) {
        res.status(500).json(err) //error handling, 500 server error, sends error details
    }
})


//GETS MOVIE, AND RETURNS MOVIE WITH ACTORS OPTIONALLY IF ITS INCLUEDED IN URL.

// Get individual movie
// Example: /movies/1 -> params: {id: 1}
//          /movies/1 ?includes_actors=true  -> returns movie with actors
app.get('/movies/:id', async (req, res) => {
    // Destructure the 'includes_actors' query parameter from the request
    const { includes_actors } = req.query;
    
    // Destructure the 'id' parameter from the request URL
    const { id } = req.params;
    
    // Log the requested movie ID to the console for debugging
    console.log(`Movie ID requested: ${id}`);

    try {
        // Check if the query parameter 'includes_actors' is set to 'true'
        if (includes_actors === 'true') {
            // If true, fetch the movie with the associated actors, assign it to constant movieWithActors, which is bascially the database now 
            const movieWithActors = (
                await db.query(`
                    SELECT movies.*, array_agg(actors.name) AS actors

                    FROM movies
                    LEFT JOIN  
                    movie_actors ON movies.id = movie_actors.movie_id
                    LEFT JOIN
                    actors ON movie_actors.actor_id = actors.id
                    
                    WHERE movies.id = $1

                    GROUP BY movies.id  
                `, [id])
            ).rows[0]; // Fetch the first result

            // Send the movie data along with the list of actors as a JSON response
            res.status(200).json(movieWithActors);
            return; // Exit the function after responding
        }

        // If 'includes_actors' is not 'true', just fetch basic movie information
        const movieInfo = (
            await db.query(`SELECT * FROM movies WHERE id = $1`, [id])
        ).rows[0]; // Fetch the first result

        // Send the basic movie information as a JSON response
        res.status(200).json(movieInfo);
    } catch (err) {
        // If an error occurs during the database query, log the error and send a 500 status
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

//INSERT A NEW MOVIE

app.post('/movies', async (req, res) => {
    const { title, release_year, genre, description, image_url, actors } = req.body;

    try {
        // Step 1: Insert the movie into the movies table
        const movieResult = await db.query(`
            INSERT INTO movies (title, release_year, genre, description, image_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `, [title, release_year, genre, description, image_url]);

        const movieId = movieResult.rows[0].id;

        // Step 2: Insert actors directly into the actors table (no conflict handling)
        for (const actor of actors) {
            await db.query(`
                INSERT INTO actors (name)
                VALUES ($1);
            `, [actor]);
        }

        // Step 3: Associate the actors with the movie in the movie_actors table
        for (const actor of actors) {
            const actorResult = await db.query(`
                SELECT id FROM actors WHERE name = $1;
            `, [actor]);
            
            const actorId = actorResult.rows[0].id;

            await db.query(`
                INSERT INTO movie_actors (movie_id, actor_id)
                VALUES ($1, $2);
            `, [movieId, actorId]);
        }

        // Return a success response with the movie data
        res.status(200).json({ message: 'Movie added successfully', movieId });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});




//DELETE ROUTE

app.delete('/movies/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        // Delete the associations from the movie_actors table
        await db.query('DELETE FROM movie_actors WHERE movie_id = $1;', [movieId]);

        // Delete the movie from the movies table
        await db.query('DELETE FROM movies WHERE id = $1;', [movieId]);

        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (err) {
        console.error('Error deleting movie:', err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});









app.listen(7070, () => console.log(`ヽ(｀Д´)⊃━☆ﾟ. * ･ ｡ﾟ, It's alive on PORT 7070`))