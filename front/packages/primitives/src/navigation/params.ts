import { useCallback } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { useRouter } from "./router";

export const useParam = (name: string) => {
	const { urlParsed } = usePageContext();
	const router = useRouter();
	const val = urlParsed.search[name];

	const setState = useCallback(
		(newVal: string | null) => {
			if (newVal) urlParsed.search[name] = newVal;
			else delete urlParsed.search[name];
			router.replace({
				...urlParsed,
				search: Object.entries(urlParsed.search).join("&"),
			});
		},
		[router],
	);

	return [val, setState] as const;
};
