import { MoviesService } from "../services/movies.service"
import type { MoviesRepository } from "../repositories/movies.repository"
import type { RatingsRepository } from "../repositories/ratings.repository"

type MovieEntity = MoviesRepository extends {
  findAll: () => Promise<(infer M)[]>
}
  ? M
  : any

const makeMovie = (overrides: Partial<MovieEntity> = {}): MovieEntity => {
  return {
    movieId: 1,
    imdbId: "tt1234567",
    title: "Test Movie",
    overview: "A test movie",
    productionCompanies: "Test Studio",
    releaseDate: "2000-01-01",
    budget: 1000000,
    revenue: 5000000,
    runtime: 120,
    language: "en",
    genres: "Drama",
    status: "Released",
    ...overrides,
  } as MovieEntity
}

describe("MoviesService", () => {
  let moviesRepository: jest.Mocked<MoviesRepository>
  let ratingsRepository: jest.Mocked<RatingsRepository>
  let service: MoviesService

  beforeEach(() => {
    moviesRepository = {
      findAll: jest.fn(),
      findByImdbId: jest.fn(),
      findByYear: jest.fn(),
      findByGenre: jest.fn(),
    } as unknown as jest.Mocked<MoviesRepository>

    ratingsRepository = {
      findAverageRatingForMovie: jest.fn(),
    } as unknown as jest.Mocked<RatingsRepository>

    service = new MoviesService(moviesRepository, ratingsRepository)
  })

  describe("getMovies", () => {
    it("applies pagination and maps to summary DTO with formatted budget", async () => {
      const movie = makeMovie({ budget: 1000 })
      moviesRepository.findAll.mockResolvedValue([movie] as any)

      const result = await service.getMovies(2, 10)

      expect(moviesRepository.findAll).toHaveBeenCalledWith(10, 10)
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        imdbId: movie.imdbId,
        title: movie.title,
        genres: movie.genres,
        releaseDate: movie.releaseDate,
        // formatted in dollars per SPEC via MovieSummaryDtoSchema -> formatUsd
        budget: "$1,000",
      })
    })

    it("uses default pagination when page and pageSize are not provided (page=1, pageSize=50)", async () => {
      const movie = makeMovie()
      moviesRepository.findAll.mockResolvedValue([movie] as any)

      await service.getMovies()

      // page=1, pageSize=50 (from DEFAULT_PAGE_SIZE) -> offset 0, limit 50
      expect(moviesRepository.findAll).toHaveBeenCalledWith(0, 50)
    })
  })

  describe("getMoviesByYear", () => {
    it("applies year, pagination, and default ascending sort", async () => {
      const movie = makeMovie()
      moviesRepository.findByYear.mockResolvedValue([movie] as any)

      const result = await service.getMoviesByYear(1999, 1, 50)

      expect(moviesRepository.findByYear).toHaveBeenCalledWith(1999, 0, 50, "asc")
      expect(result[0]).toMatchObject({
        imdbId: movie.imdbId,
        title: movie.title,
      })
    })

    it("passes through requested sort order", async () => {
      const movie = makeMovie()
      moviesRepository.findByYear.mockResolvedValue([movie] as any)

      await service.getMoviesByYear(1999, 3, 25, "desc")

      // page=3, pageSize=25 -> offset (3-1)*25 = 50
      expect(moviesRepository.findByYear).toHaveBeenCalledWith(1999, 50, 25, "desc")
    })
  })

  describe("getMoviesByGenre", () => {
    it("applies genre filter and pagination", async () => {
      const movie = makeMovie({ genres: "Comedy" })
      moviesRepository.findByGenre.mockResolvedValue([movie] as any)

      const result = await service.getMoviesByGenre("Comedy", 2, 20)

      // page=2, pageSize=20 -> offset 20
      expect(moviesRepository.findByGenre).toHaveBeenCalledWith("Comedy", 20, 20)
      expect(result[0]).toMatchObject({
        imdbId: movie.imdbId,
        title: movie.title,
        genres: "Comedy",
      })
    })
  })

  describe("getMovieByImdbId", () => {
    it("returns null when movie is not found", async () => {
      moviesRepository.findByImdbId.mockResolvedValue(null as any)

      const result = await service.getMovieByImdbId("tt-missing")

      expect(moviesRepository.findByImdbId).toHaveBeenCalledWith("tt-missing")
      expect(result).toBeNull()
    })

    it("returns detailed DTO including average rating and formatted budget", async () => {
      const movie = makeMovie({ budget: 2000, movieId: 42 })
      moviesRepository.findByImdbId.mockResolvedValue(movie as any)
      ratingsRepository.findAverageRatingForMovie.mockResolvedValue(4.5)

      const result = await service.getMovieByImdbId(movie.imdbId)

      expect(moviesRepository.findByImdbId).toHaveBeenCalledWith(movie.imdbId)
      expect(ratingsRepository.findAverageRatingForMovie).toHaveBeenCalledWith(
        movie.movieId
      )

      // fields per SPEC 4.2
      expect(result).toEqual({
        imdbId: movie.imdbId,
        title: movie.title,
        description: movie.overview,
        releaseDate: movie.releaseDate,
        budget: "$2,000",
        runtime: movie.runtime,
        averageRating: 4.5,
        genres: movie.genres,
        originalLanguage: movie.language,
        productionCompanies: movie.productionCompanies,
      })
    })

    it("allows averageRating to be null when there are no ratings", async () => {
      const movie = makeMovie({ budget: 3000, movieId: 99 })
      moviesRepository.findByImdbId.mockResolvedValue(movie as any)
      ratingsRepository.findAverageRatingForMovie.mockResolvedValue(null)

      const result = await service.getMovieByImdbId(movie.imdbId)

      expect(result?.averageRating).toBeNull()
      expect(result?.budget).toBe("$3,000")
    })
  })
})

