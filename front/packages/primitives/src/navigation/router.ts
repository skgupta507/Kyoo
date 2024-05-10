import { navigate } from "vike/client/router";
import { type UrlObject, format } from "node:url";

export const useRouter = () => {
	return {
		push: (route: string | UrlObject) => {
			if (typeof route === "object") route = format(route);
			navigate(route);
		},
		replace: (route: string | UrlObject, opts: {isNested?: boolean} = {}) => {
			if (typeof route === "object") route = format(route);
			navigate(route, { overwriteLastHistoryEntry: opts.isNested });
		},
		back: () => {
			window.history.back();
		},
	};
};
