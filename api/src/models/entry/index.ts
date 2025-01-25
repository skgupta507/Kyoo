import { t } from "elysia";
import {
	Episode,
	SeedEpisode,
	MovieEntry,
	SeedMovieEntry,
	Special,
	SeedSpecial,
} from "../entry";

export const Entry = t.Union([Episode, MovieEntry, Special]);
export type Entry = typeof Entry.static;

export const SeedEntry = t.Union([SeedEpisode, SeedMovieEntry, SeedSpecial]);
export type SeedEntry = typeof Entry.static;

export * from "./episode";
export * from "./movie-entry";
export * from "./special";
export * from "./extra";
export * from "./unknown-entry";
