import { z } from "zod"

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
})

export type PaginationQuery = z.infer<typeof paginationSchema>

export const sortOrderSchema = z.enum(["asc", "desc"]).optional()

export type SortOrder = z.infer<typeof sortOrderSchema>

export const paginationWithSortSchema = paginationSchema.extend({
  sort: sortOrderSchema,
})

export type PaginationWithSortQuery = z.infer<typeof paginationWithSortSchema>
