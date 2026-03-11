import { MoviesRepository } from "../repositories/movies.repository"
import { RatingsRepository } from "../repositories/ratings.repository"
import {
  MovieDetailsDtoSchema,
  MovieSummaryDtoSchema,
} from "../dto/movies.dto"

const DEFAULT_PAGE_SIZE = 50

export class MoviesService {
  constructor(
    private readonly moviesRepository = new MoviesRepository(),
    private readonly ratingsRepository = new RatingsRepository()
  ) {}

  async getMovies(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const limit = pageSize
    const offset = (page - 1) * pageSize
    const movies = await this.moviesRepository.findAll(offset, limit)

    return movies.map((movie) =>
      MovieSummaryDtoSchema.parse({
        imdbId: movie.imdbId,
        title: movie.title,
        genres: movie.genres,
        releaseDate: movie.releaseDate,
        budget: movie.budget,
      })
    )
  }

  async getMovieByImdbId(imdbId: string) {
    const movie = await this.moviesRepository.findByImdbId(imdbId)
    if (!movie) return null

    const averageRating =
      (await this.ratingsRepository.findAverageRatingForMovie(
        movie.movieId
      )) ?? null

    return MovieDetailsDtoSchema.parse({
      imdbId: movie.imdbId,
      title: movie.title,
      description: movie.overview,
      releaseDate: movie.releaseDate,
      budget: movie.budget,
      runtime: movie.runtime,
      averageRating,
      genres: movie.genres,
      originalLanguage: movie.language,
      productionCompanies: movie.productionCompanies,
    })
  }
}


