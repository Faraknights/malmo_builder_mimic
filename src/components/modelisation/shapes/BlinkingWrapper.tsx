import React, { useMemo } from "react";
import { shapeProps } from "./Shape";
import { COLORS, definedColors } from "../../../constants/colors";

const interpolateColor = (initial: string, final: string, percent: number): string => {
    const initialRGB = hexToRGB(initial);
    const finalRGB = hexToRGB(final);

    const intermediateRGB = initialRGB.map((component, index) =>
        Math.max(0, Math.min(255, Math.round(component + (finalRGB[index] - component) * percent / 100)))
    );

    return rgbToHex(intermediateRGB);
};

const hexToRGB = (hex: string): number[] => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16)
];

const rgbToHex = (rgb: number[]): string =>
    '#' + rgb.map(component => component.toString(16).padStart(2, '0')).join('');

interface BlinkingCubeWrapperProps {
    children: React.ReactElement<shapeProps>;
}

export const BlinkingCubeWrapper: React.FC<BlinkingCubeWrapperProps> = ({ children }) => {
    const childProps = children.props as shapeProps;
    const initialColor = childProps.color;
    const finalColor = COLORS[definedColors.WHITE];

    const intermediateColor = useMemo(() => {
        return interpolateColor(initialColor.hex, finalColor.hex, 40);
    }, [initialColor, finalColor]);

    const newProps = { ...childProps, color: { hex: intermediateColor, id: definedColors.WHITE } };

    const clonedElement = React.cloneElement(children, newProps);
    return clonedElement;
};
