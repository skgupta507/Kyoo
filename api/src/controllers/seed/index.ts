import Elysia from "elysia";
import { Movie, SeedMovie } from "~/models/movie";
import { seedMovie, SeedMovieResponse } from "./movies";
import { Resource, validateTranslations } from "~/models/utils";
import { comment } from "~/utils";
import { KError } from "~/models/error";

export const seed = new Elysia()
	.model({
		movie: Movie,
		"seed-movie": SeedMovie,
		"seed-movie-response": SeedMovieResponse,
	})
	.post(
		"/movies",
		async ({ body, error }) => {
			const err = validateTranslations(body.translations);
			if (err) return error(400, err);

			const ret = await seedMovie(body);
			if (ret.status === 422) return error(422, ret);
			return error(ret.status, ret);
		},
		{
			body: "seed-movie",
			response: {
				200: {
					...SeedMovieResponse,
					description: "Existing movie edited/updated.",
				},
				201: { ...SeedMovieResponse, description: "Created a new movie." },
				400: { ...KError, description: "Invalid translation name" },
				409: {
					...Resource,
					description: comment`
						A movie with the same slug but a different air date already exists.
						Change the slug and re-run the request.
					`,
				},
				422: { ...KError, description: "Invalid schema in body." },
			},
			detail: {
				tags: ["movies"],
				description:
					"Create a movie & all related metadata. Can also link videos.",
			},
		},
	);
