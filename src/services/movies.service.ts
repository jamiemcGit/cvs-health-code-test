import { MoviesRepository } from "../repositories/movies.repository"
import { RatingsRepository } from "../repositories/ratings.repository"

export class MoviesService {
  constructor(
    private readonly moviesRepository = new MoviesRepository(),
    private readonly ratingsRepository = new RatingsRepository()
  ) {}

  async getMovies() {
    return this.moviesRepository.findAll()
  }

  async getMovieById(id: string) {
    const movie = await this.moviesRepository.findById(id)
    if (!movie) return null

    const rating = await this.ratingsRepository.findByMovieId(id)
    return { ...movie, rating }
  }
}

