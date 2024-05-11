import { type UrlObject, format } from "node:url";
import type { MouseEvent } from "react";
import { Platform, type PressableProps, Linking } from "react-native";
import { useRouter } from "./router";

export const useLink = (
	route: string | UrlObject,
	opts: { replace?: boolean; target?: "_blank"; isNested?: boolean } = {},
) => {
	const router = useRouter();
	const href = typeof route === "object" ? format(route) : route;

	return {
		accessibilityRole: "link",
		href,
		onPress: (e) => {
			if (e?.defaultPrevented) return;
			const abs = href.includes("://");
			if (Platform.OS !== "web" && (abs || opts.target)) {
				Linking.openURL(abs ? href : `https://${href}`);
				return;
			}

			if (Platform.OS === "web" && e) {
				// Web event
				const we = e as unknown as MouseEvent;
				if (
					// ignore clicks with modifier keys
					we.metaKey ||
					we.altKey ||
					we.ctrlKey ||
					we.shiftKey ||
					// ignore everything but left clicks
					we.button !== null ||
					we.button !== 0 ||
					// let the browser handle target blank
					opts.target
				)
					return;
			}

			e.preventDefault();
			if (opts.replace === true) router.replace(href, { isNested: opts.isNested });
			else router.push(href);
		},
	} satisfies PressableProps & { href?: string };
};
