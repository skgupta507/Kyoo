/*
 * Kyoo - A portable and vast media library solution.
 * Copyright (c) Kyoo.
 *
 * See AUTHORS.md and LICENSE file in the project root for full license information.
 *
 * Kyoo is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Kyoo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Kyoo. If not, see <https://www.gnu.org/licenses/>.
 */

import {MediaType} from "./header";
import Collection from "@material-symbols/svg-400/rounded/collections_bookmark.svg";
import TV from "@material-symbols/svg-400/rounded/tv.svg";
import Movie from "@material-symbols/svg-400/rounded/movie.svg";
import All from "@material-symbols/svg-400/rounded/view_headline.svg";

export enum SortBy {
	Name = "name",
	StartAir = "startAir",
	EndAir = "endAir",
	AddedDate = "addedDate",
	Ratings = "rating",
}

export enum SearchSort {
	Relevance = "relevance",
	AirDate = "airDate",
	AddedDate = "addedDate",
	Ratings = "rating",
}

export enum SortOrd {
	Asc = "asc",
	Desc = "desc",
}

export enum Layout {
	Grid,
	List,
}

export const AllMediaTypes: MediaType = {
	key: "all",
	icon: All
}

export const MediaTypes: MediaType[] = [
	AllMediaTypes,
	{
		key: "movie",
		icon: Movie
	},
	{
		key: "show",
		icon: TV,
	},
	{
		key: "collection",
		icon: Collection
	}
];
