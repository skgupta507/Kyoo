import { navigate } from "vike/client/router";
import { type UrlObject, format } from "node:url";
import { useMemo } from "react";

export const useRouter = () => {
	const ret = useMemo(
		() => ({
			push: (route: string | UrlObject) => {
				if (typeof route === "object") route = format(route);
				navigate(route);
			},
			replace: (route: string | UrlObject, opts?: { isNested?: boolean }) => {
				if (typeof route === "object") route = format(route);
				navigate(route, { overwriteLastHistoryEntry: true });
			},
			back: () => {
				window.history.back();
			},
		}),
		[],
	);
	return ret;
};
