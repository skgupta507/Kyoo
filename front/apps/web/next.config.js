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

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const DefinePlugin = require("webpack").DefinePlugin;
const withFont = require("next-fonts");

const suboctopus = path.dirname(require.resolve("@jellyfin/libass-wasm"));

/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
	// FIXME: https://github.com/nandorojo/moti/issues/224
	reactStrictMode: false,
	swcMinify: true,
	output: "standalone",
	webpack: (config) => {
		config.plugins = [
			...config.plugins,
			new CopyPlugin({
				patterns: [
					{
						context: suboctopus,
						from: "*",
						to: "static/chunks/",
					},
				],
			}),
		];
		config.resolve = {
			...config.resolve,
			alias: {
				...config.resolve.alias,
				"react-native$": "react-native-web",
			},
			extensions: [".web.ts", ".web.tsx", ".web.js", ".web.jsx", ...config.resolve.extensions],
		};

		if (!config.plugins) config.plugins = [];
		config.plugins.push(
			new DefinePlugin({
				__DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
			}),
		);
		return config;
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/browse",
				permanent: true,
			},
		];
	},
	i18n: {
		locales: ["en", "fr"],
		defaultLocale: "en",
	},
	experimental: {
		forceSwcTransforms: true,
		outputFileTracingRoot: path.join(__dirname, "../../"),
		transpilePackages: [
			"@kyoo/ui",
			"@kyoo/primitives",
			"@kyoo/models",
			"solito",
			"react-native",
			"react-native-web",
			"react-native-svg",
			"react-native-reanimated",
			"moti",
			"yoshiki",
			"@expo/vector-icons",
			"@expo/html-elements",
			"expo-font",
			"expo-asset",
			"expo-modules-core",
			"expo-linear-gradient",
		],
	},
};

if (process.env.NODE_ENV !== "production") {
	nextConfig.rewrites = async () => [
		{
			source: "/api/:path*",
			destination: `${process.env.KYOO_URL}/:path*` ?? "http://localhost:5000/:path*",
		},
	];
}

module.exports = withFont(nextConfig);
