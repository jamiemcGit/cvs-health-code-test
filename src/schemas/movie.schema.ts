import { z } from "zod"

export const imdbIdSchema = z.string().min(1)

export const imdbIdParamSchema = z.object({
  imdbId: imdbIdSchema,
})

export type ImdbIdParams = z.infer<typeof imdbIdParamSchema>
