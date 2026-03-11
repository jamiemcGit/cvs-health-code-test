import sqlite3 from "sqlite3"
import path from "path"

const dbPath =
  process.env.DB_PATH_RATINGS || path.join(__dirname, "../../data/ratings.db")

export const ratingsDb = new sqlite3.Database(dbPath)
