import { z } from "zod";

const MovieItemSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  imdbID: z.string(),
  Type: z.string(),
  Poster: z.string(),
});

const RatingSchema = z.object({
  Source: z.string(),
  Value: z.string(),
});

const MovieDetailSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  Rated: z.string(),
  Released: z.string(),
  Runtime: z.string(),
  Genre: z.string(),
  Director: z.string(),
  Writer: z.string(),
  Actors: z.string(),
  Plot: z.string(),
  Language: z.string(),
  Country: z.string(),
  Awards: z.string(),
  Poster: z.string(),
  Ratings: z.array(RatingSchema),
  Metascore: z.string(),
  imdbRating: z.string(),
  imdbVotes: z.string(),
  imdbID: z.string(),
  Type: z.string(),
  DVD: z.string().optional(),
  BoxOffice: z.string().optional(),
  Production: z.string().optional(),
  Website: z.string().optional(),
  totalSeasons: z.string().optional(),
  Response: z.literal("True"),
});

const OMDbSearchResponseSchema = z.object({
  Search: z.array(MovieItemSchema),
  totalResults: z.string(),
  Response: z.literal("True"),
});

const OMDbErrorResponseSchema = z.object({
  Response: z.literal("False"),
  Error: z.string(),
});

const OMDbSearchSchema = z.union([
  OMDbSearchResponseSchema,
  OMDbErrorResponseSchema,
]);

const OMDbDetailSchema = z.union([MovieDetailSchema, OMDbErrorResponseSchema]);

export type MovieItem = z.infer<typeof MovieItemSchema>;
export type Rating = z.infer<typeof RatingSchema>;
export type MovieDetail = z.infer<typeof MovieDetailSchema>;
export type OMDbSearchResponse = z.infer<typeof OMDbSearchResponseSchema>;
export type OMDbErrorResponse = z.infer<typeof OMDbErrorResponseSchema>;
export type OMDbSearchResult = z.infer<typeof OMDbSearchSchema>;
export type OMDbDetailResult = z.infer<typeof OMDbDetailSchema>;

export {
  MovieItemSchema,
  RatingSchema,
  MovieDetailSchema,
  OMDbSearchResponseSchema,
  OMDbErrorResponseSchema,
  OMDbSearchSchema,
  OMDbDetailSchema,
};
