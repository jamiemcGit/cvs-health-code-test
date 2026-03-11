import { ratingsDb } from "../database/ratings.db"

export interface Rating {
  ratingId: number
  userId: number
  movieId: number
  rating: number
  timestamp: number
}

export class RatingsRepository {
  findAverageRatingForMovie(movieId: number): Promise<number | null> {
    return new Promise((resolve, reject) => {
      ratingsDb.get<{ averageRating: number | null }>(
        `
        SELECT AVG(rating) AS averageRating
        FROM ratings
        WHERE movieId = ?
        `,
        [movieId],
        (err, row) => {
          if (err) return reject(err)
          resolve(row?.averageRating ?? null)
        }
      )
    })
  }
}


