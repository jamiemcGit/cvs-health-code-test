import { moviesDb } from "../db/movies.db"

export interface Movie {
  movieId: number
  imdbId: string
  title: string
  overview: string | null
  productionCompanies: string | null
  releaseDate: string | null
  budget: number | null
  revenue: number | null
  runtime: number | null
  language: string | null
  genres: string | null
  status: string | null
}

export class MoviesRepository {
  findAll(offset: number, limit: number): Promise<Movie[]> {
    return new Promise((resolve, reject) => {
      moviesDb.all<Movie>(
        `
        SELECT
          movieId,
          imdbId,
          title,
          overview,
          productionCompanies,
          releaseDate,
          budget,
          revenue,
          runtime,
          language,
          genres,
          status
        FROM movies
        LIMIT ? OFFSET ?
        `,
        [limit, offset],
        (err, rows) => {
          if (err) return reject(err)
          resolve(rows)
        }
      )
    })
  }

  findByImdbId(imdbId: string): Promise<Movie | null> {
    return new Promise((resolve, reject) => {
      moviesDb.get<Movie>(
        `
        SELECT
          movieId,
          imdbId,
          title,
          overview,
          productionCompanies,
          releaseDate,
          budget,
          revenue,
          runtime,
          language,
          genres,
          status
        FROM movies
        WHERE imdbId = ?
        `,
        [imdbId],
        (err, row) => {
          if (err) return reject(err)
          resolve(row ?? null)
        }
      )
    })
  }
}


