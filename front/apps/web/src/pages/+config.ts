import type { Config } from "vike/types";
import logoUrl from "../../public/icon.svg";
import vikeReact from "vike-react/config";
import vikeReactQuery from "vike-react-query/config";

export default {
	ssr: true,
	title: "Kyoo",
	favicon: logoUrl,
	extends: [vikeReact, vikeReactQuery],
} satisfies Config;
