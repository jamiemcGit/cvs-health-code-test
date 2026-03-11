import type { Request, Response } from "express"
import { MoviesService } from "../services/movies.service"
import {
  paginationSchema,
  paginationWithSortSchema,
} from "../schemas/pagination.schema"
import {
  genreParamSchema,
  imdbIdParamSchema,
  yearParamSchema,
} from "../schemas/movie.schema"

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

  getMoviesByYear = async (req: Request, res: Response) => {
    const paramsResult = yearParamSchema.safeParse(req.params)
    if (!paramsResult.success) {
      return res.status(400).json({ message: "Invalid year" })
    }

    const queryResult = paginationWithSortSchema.safeParse(req.query)
    if (!queryResult.success) {
      return res
        .status(400)
        .json({ message: "Invalid pagination or sort parameters" })
    }

    const { page, pageSize, sort } = queryResult.data
    const movies = await this.moviesService.getMoviesByYear(
      paramsResult.data.year,
      page,
      pageSize,
      sort ?? "asc"
    )

    res.json(movies)
  }

  getMoviesByGenre = async (req: Request, res: Response) => {
    const paramsResult = genreParamSchema.safeParse(req.params)
    if (!paramsResult.success) {
      return res.status(400).json({ message: "Invalid genre" })
    }

    const queryResult = paginationSchema.safeParse(req.query)
    if (!queryResult.success) {
      return res
        .status(400)
        .json({ message: "Invalid pagination parameters" })
    }

    const { page, pageSize } = queryResult.data
    const movies = await this.moviesService.getMoviesByGenre(
      paramsResult.data.genre,
      page,
      pageSize
    )

    res.json(movies)
  }
}
