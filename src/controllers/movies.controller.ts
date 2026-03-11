import type { Request, Response } from "express"
import { MoviesService } from "../services/movies.service"

export class MoviesController {
  constructor(private readonly moviesService = new MoviesService()) {}

  getMovies = async (_req: Request, res: Response) => {
    const movies = await this.moviesService.getMovies()
    res.json(movies)
  }

  getMovieById = async (req: Request, res: Response) => {
    const { id } = req.params
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid movie ID" })
    }
    
    const movie = await this.moviesService.getMovieById(id)

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    res.json(movie)
  }
}

