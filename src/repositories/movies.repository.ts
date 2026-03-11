export interface Movie {
  id: string
  title: string
  year: number
}

export class MoviesRepository {
  async findAll(): Promise<Movie[]> {
    return []
  }

  async findById(id: string): Promise<Movie | null> {
    void id
    return null
  }
}

