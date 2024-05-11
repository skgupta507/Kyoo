import { PortalProvider } from "@gorhom/portal";
import { AccountProvider, useUserTheme } from "@kyoo/models";
import {
	HiddenIfNoJs,
	SkeletonCss,
	SnackbarProvider,
	ThemeSelector,
	Tooltip,
	TouchOnlyCss,
} from "@kyoo/primitives";
import { WebTooltip } from "@kyoo/primitives/src/tooltip.web";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { useMobileHover, useTheme } from "yoshiki";
import "~/polyfill";

// const font = Poppins({ weight: ["300", "400", "900"], subsets: ["latin"], display: "swap" });

// const WithLayout = ({ Component, ...props }: { Component: ComponentType }) => {
// 	const layoutInfo = (Component as QueryPage).getLayout ?? (({ page }) => page);
// 	const { Layout, props: layoutProps } =
// 		typeof layoutInfo === "function" ? { Layout: layoutInfo, props: {} } : layoutInfo;
// 	return <Layout page={<Component {...props} />} randomItems={[]} {...layoutProps} />;
// };

const GlobalCssTheme = () => {
	const theme = useTheme();
	return (
		<>
			<style jsx global>{`
				body {
					margin: 0px;
					padding: 0px;
					overflow: "hidden";
					background-color: ${theme.background};
					{/* font-family: ${font.style.fontFamily}; */}
				}

				*::-webkit-scrollbar {
					height: 6px;
					width: 6px;
					background: transparent;
				}

				*::-webkit-scrollbar-thumb {
					background-color: #999;
					border-radius: 90px;
				}
				*:hover::-webkit-scrollbar-thumb {
					background-color: rgb(134, 127, 127);
				}

				#__next {
					height: 100vh;
				}

				.infinite-scroll-component__outerdiv {
					width: 100%;
					height: 100%;
				}

				::cue {
					background-color: transparent;
					text-shadow:
						-1px -1px 0 #000,
						1px -1px 0 #000,
						-1px 1px 0 #000,
						1px 1px 0 #000;
				}
			`}</style>
			<WebTooltip theme={theme} />
			<SkeletonCss />
			<TouchOnlyCss />
			<HiddenIfNoJs />
		</>
	);
};
export default function Layout({ children }: { children: ReactNode }) {
	// TODO: theme ssr
	// const userTheme = useUserTheme(undefined);

	useMobileHover();

	// TODO: ssr account/error
	return (
		<>
			{/* <AccountProvider ssrAccount={undefined} ssrError={undefined}> */}
			{/* 	<ThemeSelector theme={userTheme} font={{ normal: "inherit" }}> */}
			{/* 		<PortalProvider> */}
			{/* 			<SnackbarProvider> */}
							<GlobalCssTheme />
							{children}
			{/* 				{/* <ConnectionErrorVerifier skipErrors={(Component as QueryPage).isPublic}> */}
			{/* 					<WithLayout */}
			{/* 						Component={children} */}
			{/* 						randomItems={ */}
			{/* 							randomItems[Component.displayName!] ?? */}
			{/* 							arrayShuffle((Component as QueryPage).randomItems ?? []) */}
			{/* 						} */}
			{/* 						{...props} */}
			{/* 					/> */}
			{/* 				</ConnectionErrorVerifier> */}
			{/* 				<Tooltip id="tooltip" positionStrategy={"fixed"} /> */}
			{/* 			</SnackbarProvider> */}
			{/* 		</PortalProvider> */}
			{/* 	</ThemeSelector> */}
			{/* </AccountProvider> */}
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</>
	);
}

