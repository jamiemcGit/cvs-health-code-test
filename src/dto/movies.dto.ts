import { z } from "zod"

const formatBudget = (budget: number | null): string | null => {
  if (budget == null) return null

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(budget)
}

export const MovieSummaryDtoSchema = z.object({
  imdbId: z.string(),
  title: z.string(),
  genres: z.string().nullable(),
  releaseDate: z.string().nullable(),
  budget: z.number().nullable().transform(formatBudget),
})

export type MovieSummaryDto = z.infer<typeof MovieSummaryDtoSchema>

export const MovieDetailsDtoSchema = z.object({
  imdbId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  releaseDate: z.string().nullable(),
  budget: z.number().nullable().transform(formatBudget),
  runtime: z.number().nullable(),
  averageRating: z.number().nullable(),
  genres: z.string().nullable(),
  originalLanguage: z.string().nullable(),
  productionCompanies: z.string().nullable(),
})

export type MovieDetailsDto = z.infer<typeof MovieDetailsDtoSchema>

