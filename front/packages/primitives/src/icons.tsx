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

import React, { ComponentProps, ComponentType, ForwardedRef, forwardRef } from "react";
import { Platform, PressableProps, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";
import { YoshikiStyle } from "yoshiki/dist/type";
import { px, Theme, useYoshiki } from "yoshiki/native";
import { PressableFeedback } from "./links";
import { alpha } from "./themes";
import { Breakpoint, ts, useBreakpointValue } from "./utils";

declare module "react" {
	function forwardRef<T, P = {}>(
		render: (props: P, ref: React.ForwardedRef<T>) => React.ReactElement | null,
	): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

type IconProps = {
	icon: ComponentType<SvgProps>;
	color?: Breakpoint<string>;
	size?: YoshikiStyle<number | string>;
};

export const Icon = ({ icon: Icon, color, size = 24, ...props }: IconProps) => {
	const { css, theme } = useYoshiki();
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const colorValue = Platform.OS !== "web" ? useBreakpointValue(color) : null;

	return (
		<Icon
			{...Platform.select<SvgProps>({
				web: css({ width: size, height: size, fill: color ?? theme.contrast } as ViewStyle, props),
				default: {
					height: size,
					width: size,
					// @ts-ignore
					fill: colorValue ?? theme.contrast,
					...props,
				},
			})}
		/>
	);
};

export const IconButton = forwardRef(function _IconButton<AsProps = PressableProps>(
	{
		icon,
		size,
		color,
		as,
		...asProps
	}: IconProps & {
		as?: ComponentType<AsProps>;
	} & AsProps,
	ref: ForwardedRef<unknown>,
) {
	const { css } = useYoshiki();

	const Container = as ?? PressableFeedback;

	return (
		<Container
			ref={ref as any}
			accessibilityRole="button"
			focusRipple
			{...(css(
				{
					p: ts(1),
					m: px(2),
					borderRadius: 9999,
					fover: {
						self: {
							bg: (theme: Theme) => alpha(theme.contrast, 0.5),
						},
					},
				},
				asProps,
			) as AsProps)}
		>
			<Icon icon={icon} size={size} color={color} />
		</Container>
	);
});

export const IconFab = <AsProps = PressableProps,>(
	props: ComponentProps<typeof IconButton<AsProps>>,
) => {
	const { css, theme } = useYoshiki();

	return (
		<IconButton
			color={theme.colors.black}
			{...(css(
				{
					bg: (theme) => theme.accent,
					fover: {
						self: {
							transform: [{ scale: 1.3 }],
							bg: (theme: Theme) => theme.accent,
						},
					},
				},
				props,
			) as any)}
		/>
	);
};