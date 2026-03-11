import type { Request, Response } from "express"
import { MoviesService } from "../services/movies.service"

export class MoviesController {
  constructor(private readonly moviesService = new MoviesService()) {}

  getMovies = async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : undefined
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined

    const movies = await this.moviesService.getMovies(page, pageSize)
    res.json(movies)
  }

  getMovieById = async (req: Request, res: Response) => {
    const { imdbId } = req.params

    if (!imdbId || Array.isArray(imdbId)) {
      return res.status(400).json({ message: "Invalid imdbId" })
    }

    const movie = await this.moviesService.getMovieByImdbId(imdbId)

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    res.json(movie)
  }
}

