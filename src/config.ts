import "dotenv/config"

export const config = {
  port: process.env.PORT || 3000,
  movisDbPath: process.env.DB_PATH_MOVIES,
  ratingDbPath: process.env.DB_PATH_RATINGS,
}

