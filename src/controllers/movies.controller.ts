import type { Request, Response } from "express"
import { MoviesService } from "../services/movies.service"
import { paginationSchema } from "../schemas/pagination.schema"
import { imdbIdParamSchema } from "../schemas/movie.schema"

export class MoviesController {
  constructor(private readonly moviesService = new MoviesService()) {}

  getMovies = async (req: Request, res: Response) => {
    const parsed = paginationSchema.safeParse(req.query)

    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid pagination parameters" })
    }

    const { page, pageSize } = parsed.data

    const movies = await this.moviesService.getMovies(page, pageSize)
    res.json(movies)
  }

  getMovieById = async (req: Request, res: Response) => {
    const parsed = imdbIdParamSchema.safeParse(req.params)

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid imdbId" })
    }

    const movie = await this.moviesService.getMovieByImdbId(
      parsed.data.imdbId
    )

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    res.json(movie)
  }
}

