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

import { type DocumentContext, Head, Html, Main, NextScript } from "next/document";
import { AppRegistry } from "react-native";
import { StyleRegistryProvider, createStyleRegistry } from "yoshiki/web";

const Document = () => {
	return (
		<Html>
			<Head>
			</Head>
			<body className="hoverEnabled">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

Document.getInitialProps = async (ctx: DocumentContext) => {
	const renderPage = ctx.renderPage;
	const registry = createStyleRegistry();

	ctx.renderPage = () =>
		renderPage({
			enhanceApp: (App) => (props) => {
				return (
					<StyleRegistryProvider registry={registry}>
						<App {...props} />
					</StyleRegistryProvider>
				);
			},
		});

	const props = await ctx.defaultGetInitialProps(ctx);

	AppRegistry.registerComponent("Main", () => Main);
	// @ts-ignore React native web missing type.
	const { getStyleElement } = AppRegistry.getApplication("Main");
	const page = await ctx.renderPage();

	return {
		...props,
		...page,
		styles: (
			<>
				{props.styles}
				{page.styles}
				<style>{style}</style>
				{getStyleElement()}
				{registry.flushToComponent()}
			</>
		),
	};
};
export default Document;
