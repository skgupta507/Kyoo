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

import {
	Genre,
	ItemKind,
	News,
	NewsKind,
	NewsP,
	QueryIdentifier,
	getDisplayDate,
} from "@kyoo/models";
import { H3, IconButton, ts } from "@kyoo/primitives";
import { ReactElement, forwardRef, useRef } from "react";
import { View } from "react-native";
import { px, useYoshiki } from "yoshiki/native";
import { ItemGrid } from "../browse/grid";
import ChevronLeft from "@material-symbols/svg-400/rounded/chevron_left-fill.svg";
import ChevronRight from "@material-symbols/svg-400/rounded/chevron_right-fill.svg";
import { InfiniteFetch, InfiniteFetchList } from "../fetch-infinite";
import { useTranslation } from "react-i18next";
import { Header } from "./genre";
import { EpisodeBox, episodeDisplayNumber } from "../details/episode";

export const NewsList = () => {
	const { t } = useTranslation();
	const { css } = useYoshiki();

	return (
		<>
			<Header title={t("home.news")} />
			<InfiniteFetch
				query={NewsList.query()}
				layout={{ ...ItemGrid.layout, layout: "horizontal" }}
				getItemType={(x, i) =>
					x.kind === NewsKind.Movie || (x.isLoading && i % 2) ? "movie" : "episode"
				}
				empty={t("home.none")}
			>
				{(x, i) =>
					x.kind === NewsKind.Movie || (x.isLoading && i % 2) ? (
						<ItemGrid
							isLoading={x.isLoading as any}
							href={x.href}
							name={x.name!}
							subtitle={!x.isLoading ? getDisplayDate(x) : undefined}
							poster={x.poster}
						/>
					) : (
						<EpisodeBox
							isLoading={x.isLoading as any}
							name={
								x.kind === NewsKind.Episode
									? `${x.show!.name} ${episodeDisplayNumber(x)}`
									: undefined
							}
							overview={x.name}
							thumbnail={x.thumbnail}
							href={x.href}
							// TODO: support this on mobile too
							// @ts-expect-error This is a web only property
							{...css({ gridColumnEnd: "span 2" })}
						/>
					)
				}
			</InfiniteFetch>
		</>
	);
};

NewsList.query = (): QueryIdentifier<News> => ({
	parser: NewsP,
	infinite: true,
	path: ["news"],
	params: {
		// Limit the inital numbers of items
		limit: 10,
	},
});