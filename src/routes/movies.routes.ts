import { Router } from "express"
import { MoviesController } from "../controllers/movies.controller"

const router = Router()
const moviesController = new MoviesController()

router.get("/movies", moviesController.getMovies)
router.get("/movies/:id", moviesController.getMovieById)

export default router
