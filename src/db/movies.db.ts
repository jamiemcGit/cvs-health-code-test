import sqlite3 from "sqlite3"
import path from "path"

const dbPath =
  process.env.DB_PATH_MOVIES || path.join(__dirname, "../../data/movies.db")

export const moviesDb = new sqlite3.Database(dbPath)
