import { z } from "zod"

export const imdbIdSchema = z.string().min(1)

export const imdbIdParamSchema = z.object({
  imdbId: imdbIdSchema,
})

export type ImdbIdParams = z.infer<typeof imdbIdParamSchema>

export const yearSchema = z.coerce.number().int().positive()

export const yearParamSchema = z.object({
  year: yearSchema,
})

export type YearParams = z.infer<typeof yearParamSchema>

export const genreSchema = z.string().min(1)

export const genreParamSchema = z.object({
  genre: genreSchema,
})

export type GenreParams = z.infer<typeof genreParamSchema>
