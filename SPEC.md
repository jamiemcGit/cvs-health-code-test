# SPEC.md
Movie API Code Test — Implementation Specification

## 1. Purpose

Build a read-only REST API in TypeScript using Express, Node.js, and SQLite.

The API reads from the provided SQLite databases under `db/` and exposes movie data through JSON endpoints.

## 2. Technical Requirements

- REST-style API
- JSON responses
- Read-only
- Configurable via environment variables
- Locally runnable
- Logging (stretch objective)

## 3. Conventions

### 3.1 Pagination

Query parameters:
- `page` — optional, positive integer, default `1`
- `pageSize` — optional, positive integer, default `50`

## 4. Endpoints

## 4.1 List All Movies - `GET /movies`

- Lists all movies
- List is paginated: 50 movies per page, the page can be altered with the `page` and `pageSize` query parameters
- Columns should include: imdb id, title, genres, release date, budget
- Budget is displayed in dollars

### Query Params

- pagination (optional) (see [section 3.1](#31-pagination) above)

### Response Fields Per Movie

- `imdbId`
- `title`
- `genres`
- `releaseDate`
- `budget` - formatted in dollars

## 4.2 Movie Details - `GET /movies/{imdbId}`

- An endpoint exists that lists the movie details for a particular movie
- Details should include: imdb id, title, description, release date, budget, runtime, average rating, genres, original language, production companies
- Budget should be displayed in dollars
- Ratings are pulled from the rating database

### Path Parameters

- `imdbId` — required

### Response Fields

- `imdbId`
- `title`
- `description`
- `releaseDate`
- `budget` - formatted in dollars
- `runtime`
- `averageRating`
- `genres`
- `originalLanguage`
- `productionCompanies`

## 4.3 Movies By Year- `GET /movies/year/{year}`

- List all movies from a particular year
- List is paginated: 50 movies per page, the page can be altered with the `page` and `pageSize` query parameters
- List is sorted by date in chronological order
- Sort order can be descending
- Columns include: imdb id, title, genres, release date, budget
- Budget should be displayed in dollars

### Path Parameters

- `year` — required, positive integer

### Query Parameters

- pagination (optional) (see [section 3.1](#31-pagination) above)
- `sort` — optional, values: `asc` - default | `desc`

### Response Fields Per Movie

- `imdbId`
- `title`
- `genres`
- `releaseDate`
- `budget` - formatted in dollars

## 4.4 Movies By Genre - `GET /movies/genre/{genre}`

- List all movies by a genre
- List is paginated: 50 movies per page, the page can be altered with the `page` and `pageSize` query parameters
- Columns include: imdb id, title, genres, release date, budget
- Budget should be displayed in dollars

### Path Parameters

- `genre` — required

### Query Parameters

- pagination (optional) (see [section 3.1](#31-pagination) above)

### Response Fields Per Movie

- `imdbId`
- `title`
- `genres`
- `releaseDate`
- `budget` - formatted in dollars
