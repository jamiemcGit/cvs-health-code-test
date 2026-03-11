import express from "express"
import moviesRouter from "./routes/movies.routes"

const app = express()

app.use(express.json())

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

app.use("/", moviesRouter)

export default app