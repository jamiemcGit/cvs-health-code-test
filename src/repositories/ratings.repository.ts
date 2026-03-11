export interface Rating {
  movieId: string
  score: number
}

export class RatingsRepository {
  async findByMovieId(movieId: string): Promise<Rating | null> {
    void movieId
    return null
  }
}

