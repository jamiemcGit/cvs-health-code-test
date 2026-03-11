import request from "supertest"
import app from "../app"

describe("Movies API (controllers & routing)", () => {
  describe("GET /health", () => {
    it("returns service health", async () => {
      const res = await request(app).get("/health")

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ status: "ok" })
    })
  })

  describe("GET /movies", () => {
    it("returns a paginated list of movies with required summary fields", async () => {
      const res = await request(app).get("/movies")

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)

      if (res.body.length > 0) {
        const movie = res.body[0]
        // Fields per SPEC 4.1
        expect(movie).toHaveProperty("imdbId")
        expect(movie).toHaveProperty("title")
        expect(movie).toHaveProperty("genres")
        expect(movie).toHaveProperty("releaseDate")
        expect(movie).toHaveProperty("budget")

        // budget should be displayed in dollars when present
        if (movie.budget !== null) {
          expect(typeof movie.budget).toBe("string")
          expect(movie.budget).toMatch(/^\$/)
        }
      }

      // default pageSize is 50 per SPEC; controller delegates to service default
      expect(res.body.length).toBeLessThanOrEqual(50)
    })

    it("honors explicit page and pageSize query parameters", async () => {
      const res = await request(app).get("/movies").query({ page: 2, pageSize: 10 })

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeLessThanOrEqual(10)
    })

    it("returns 400 for invalid pagination parameters", async () => {
      const res = await request(app).get("/movies").query({ page: "0", pageSize: "-1" })

      expect(res.status).toBe(400)
      expect(res.body).toEqual({ message: "Invalid pagination parameters" })
    })
  })

  describe("GET /movies/:imdbId", () => {
    it("returns 404 when movie is not found", async () => {
      const res = await request(app).get("/movies/tt9999999999")

      expect(res.status).toBe(404)
      expect(res.body).toEqual({ message: "Movie not found" })
    })

    it("returns movie details with required fields when found", async () => {
      // We don't know a concrete imdbId from the fixture DB, so we first
      // fetch a movie from the list endpoint and then request its details.
      const listRes = await request(app).get("/movies")
      expect(listRes.status).toBe(200)

      if (listRes.body.length === 0) {
        return
      }

      const imdbId = listRes.body[0].imdbId
      const res = await request(app).get(`/movies/${imdbId}`)

      expect(res.status).toBe(200)

      const movie = res.body
      // Fields per SPEC 4.2
      expect(movie).toHaveProperty("imdbId", imdbId)
      expect(movie).toHaveProperty("title")
      expect(movie).toHaveProperty("description")
      expect(movie).toHaveProperty("releaseDate")
      expect(movie).toHaveProperty("budget")
      expect(movie).toHaveProperty("runtime")
      expect(movie).toHaveProperty("averageRating")
      expect(movie).toHaveProperty("genres")
      expect(movie).toHaveProperty("originalLanguage")
      expect(movie).toHaveProperty("productionCompanies")

      // budget is displayed in dollars when present
      if (movie.budget !== null) {
        expect(typeof movie.budget).toBe("string")
        expect(movie.budget).toMatch(/^\$/)
      }
    })
  })

  describe("GET /movies/year/:year", () => {
    it("returns 400 for invalid year parameter", async () => {
      const res = await request(app).get("/movies/year/not-a-year")

      expect(res.status).toBe(400)
      expect(res.body).toEqual({ message: "Invalid year" })
    })

    it("returns 400 for invalid sort parameter", async () => {
      const res = await request(app)
        .get("/movies/year/2000")
        .query({ sort: "not-valid" })

      expect(res.status).toBe(400)
      expect(res.body).toEqual({
        message: "Invalid pagination or sort parameters",
      })
    })

    it("returns movies sorted by releaseDate ascending by default, paginated", async () => {
      const res = await request(app).get("/movies/year/2000")

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeLessThanOrEqual(50)

      const dates = res.body
        .map((m: any) => m.releaseDate)
        .filter((d: string | null) => d != null)

      const sorted = [...dates].sort()
      expect(dates).toEqual(sorted)
    })

    it("supports descending sort order", async () => {
      const res = await request(app)
        .get("/movies/year/2000")
        .query({ sort: "desc" })

      expect(res.status).toBe(200)

      const dates = res.body
        .map((m: any) => m.releaseDate)
        .filter((d: string | null) => d != null)

      const sortedDesc = [...dates].sort().reverse()
      expect(dates).toEqual(sortedDesc)
    })
  })

  describe("GET /movies/genre/:genre", () => {
    it("returns 400 for invalid pagination parameters", async () => {
      const res = await request(app)
        .get("/movies/genre/Drama")
        .query({ page: "0", pageSize: "-1" })

      expect(res.status).toBe(400)
      expect(res.body).toEqual({ message: "Invalid pagination parameters" })
    })

    it("returns movies filtered by genre with required summary fields", async () => {
      const res = await request(app).get("/movies/genre/Drama")

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeLessThanOrEqual(50)

      if (res.body.length > 0) {
        const movie = res.body[0]
        expect(movie).toHaveProperty("imdbId")
        expect(movie).toHaveProperty("title")
        expect(movie).toHaveProperty("genres")
        expect(movie).toHaveProperty("releaseDate")
        expect(movie).toHaveProperty("budget")

        if (movie.budget !== null) {
          expect(typeof movie.budget).toBe("string")
          expect(movie.budget).toMatch(/^\$/)
        }
      }
    })
  })
})

