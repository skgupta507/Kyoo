import { and, eq, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "~/db";
import { shows } from "~/db/schema";
import { KError } from "~/models/error";
import { bubble } from "~/models/examples";
import { FullMovie, Movie, MovieTranslation } from "~/models/movie";
import {
	AcceptLanguage,
	Filter,
	Page,
	createPage,
	processLanguages,
} from "~/models/utils";
import { desc } from "~/models/utils/descriptions";
import { getShow, getShows, showFilters, showSort } from "./logic";

export const movies = new Elysia({ prefix: "/movies", tags: ["movies"] })
	.model({
		movie: Movie,
		"movie-translation": MovieTranslation,
	})
	.get(
		"/:id",
		async ({
			params: { id },
			headers: { "accept-language": languages },
			query: { preferOriginal, with: relations },
			error,
			set,
		}) => {
			const langs = processLanguages(languages);
			const ret = await getShow(id, {
				languages: langs,
				preferOriginal,
				relations,
				filters: eq(shows.kind, "movie"),
			});
			if (!ret) {
				return error(404, {
					status: 404,
					message: "Movie not found",
				});
			}
			if (!ret.language) {
				return error(422, {
					status: 422,
					message: "Accept-Language header could not be satisfied.",
				});
			}
			set.headers["content-language"] = ret.language;
			return ret.show;
		},
		{
			detail: {
				description: "Get a movie by id or slug",
			},
			params: t.Object({
				id: t.String({
					description: "The id or slug of the movie to retrieve.",
					example: bubble.slug,
				}),
			}),
			query: t.Object({
				preferOriginal: t.Optional(
					t.Boolean({ description: desc.preferOriginal }),
				),
				with: t.Array(t.UnionEnum(["translations", "videos"]), {
					default: [],
					description: "Include related resources in the response.",
				}),
			}),
			headers: t.Object({
				"accept-language": AcceptLanguage(),
			}),
			response: {
				200: { ...FullMovie, description: "Found" },
				404: {
					...KError,
					description: "No movie found with the given id or slug.",
				},
				422: KError,
			},
		},
	)
	.get(
		"random",
		async ({ error, redirect }) => {
			const [movie] = await db
				.select({ slug: shows.slug })
				.from(shows)
				.where(eq(shows.kind, "movie"))
				.orderBy(sql`random()`)
				.limit(1);
			if (!movie)
				return error(404, {
					status: 404,
					message: "No movies in the database.",
				});
			return redirect(`/movies/${movie.slug}`);
		},
		{
			detail: {
				description: "Get a random movie",
			},
			response: {
				302: t.Void({
					description:
						"Redirected to the [/movies/{id}](#tag/movies/GET/movies/{id}) route.",
				}),
				404: {
					...KError,
					description: "No movies in the database.",
				},
			},
		},
	)
	.get(
		"",
		async ({
			query: { limit, after, query, sort, filter, preferOriginal },
			headers: { "accept-language": languages },
			request: { url },
		}) => {
			const langs = processLanguages(languages);
			const items = await getShows({
				limit,
				after,
				query,
				sort,
				filter: and(eq(shows.kind, "movie"), filter),
				languages: langs,
				preferOriginal,
			});
			return createPage(items, { url, sort, limit });
		},
		{
			detail: { description: "Get all movies" },
			query: t.Object({
				sort: showSort,
				filter: t.Optional(Filter({ def: showFilters })),
				query: t.Optional(t.String({ description: desc.query })),
				limit: t.Integer({
					minimum: 1,
					maximum: 250,
					default: 50,
					description: "Max page size.",
				}),
				after: t.Optional(t.String({ description: desc.after })),
				preferOriginal: t.Optional(
					t.Boolean({
						description: desc.preferOriginal,
					}),
				),
			}),
			headers: t.Object({
				"accept-language": AcceptLanguage({ autoFallback: true }),
			}),
			response: {
				200: Page(Movie),
				422: KError,
			},
		},
	);
