import { z } from "zod"
import { imdbIdSchema } from "../schemas/movie.schema"
import { formatUsd } from "../utils/formatUsd"

export const MovieSummaryDtoSchema = z.object({
  imdbId: imdbIdSchema,
  title: z.string(),
  genres: z.string().nullable(),
  releaseDate: z.string().nullable(),
  budget: z.number().nullable().transform(formatUsd),
})

export type MovieSummaryDto = z.infer<typeof MovieSummaryDtoSchema>

export const MovieDetailsDtoSchema = z.object({
  imdbId: imdbIdSchema,
  title: z.string(),
  description: z.string().nullable(),
  releaseDate: z.string().nullable(),
  budget: z.number().nullable().transform(formatUsd),
  runtime: z.number().nullable(),
  averageRating: z.number().nullable(),
  genres: z.string().nullable(),
  originalLanguage: z.string().nullable(),
  productionCompanies: z.string().nullable(),
})

export type MovieDetailsDto = z.infer<typeof MovieDetailsDtoSchema>

