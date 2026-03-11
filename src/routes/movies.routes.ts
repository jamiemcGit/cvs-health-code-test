import { Router } from "express"
import { MoviesController } from "../controllers/movies.controller"

const router = Router()
const moviesController = new MoviesController()

router.get("/movies", moviesController.getMovies)
router.get("/movies/:imdbId", moviesController.getMovieById)
router.get("/movies/year/:year", moviesController.getMoviesByYear)
router.get("/movies/genre/:genre", moviesController.getMoviesByGenre)

export default router
