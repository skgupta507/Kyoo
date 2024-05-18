import react from "@vitejs/plugin-react";
import reactNativeWeb from "vite-plugin-react-native-web";
import { cjsInterop } from "vite-plugin-cjs-interop";
import vike from "vike/plugin";
import type { UserConfig } from "vite";
import path from "node:path";

export default {
	server: {
		host: "0.0.0.0",
	},
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./src"),
		},
	},
	// build: {
	// 	commonjsOptions: {
	// 		transformMixedEsModules: true,
	// 	},
	// },
	// optimizeDeps: {
	// 	esbuildOptions: {
	// 		mainFields: ["module", "main"],
	// 	},
	// },
	plugins: [react(), vike(), reactNativeWeb()]
} satisfies UserConfig;
