"use client";

import React, { useState, useCallback } from "react";
import Header from "./Layout/Header";
import ColorInput from "./components/ColorInput";
import ShadeGenerator from "./components/ShadeGenerator";
import chroma from "chroma-js";
import colorName from "color-name";
import GenerateCode from "./components/GenerateCode";

interface Color {
	name: string;
	hsl: [number, number, number];
	shades: Shade[];
}

interface Shade {
	hue: number;
	saturation: number;
	lightness: number;
}

const namedColors = Object.entries(colorName).reduce((acc: Record<string, string>, [name, rgb]) => {
	acc[name] = chroma(rgb).hex();
    return acc;
}, {});

export default function Home() {
	const [colors, setColors] = useState<Color[]>([]);

	const addColor = (newHsl: [number, number, number]) => {
		const colorName = getClosestColorNameFromHSL(newHsl);

		setColors([...colors, { name: colorName, hsl: newHsl, shades: [] }]);
	};

	const updateShades = useCallback((index: number, shades: Shade[]) => {
        setColors((prevColors) =>
            prevColors.map((color, i) =>
                i === index ? { ...color, shades } : color
            )
        );
    }, []);

	const getClosestColorName = (inputColor: string): string => {
		let closestColor = "";
		let smallestDistance = Infinity;

		Object.entries(namedColors).forEach(([name, hex]) => {
			const distance = chroma.distance(inputColor, hex);
			if (distance < smallestDistance) {
				smallestDistance = distance;
				closestColor = name;
			}
		});

		return closestColor;
	}

	function getClosestColorNameFromHSL(hsl: [number, number, number]): string {
		const hex = chroma.hsl(...hsl).hex();
	
		return getClosestColorName(hex);
	}

	function printColors() {
		console.log(colors);
	}

	return (
		<div>
			<Header />
			<h1>Hello Home</h1>
			<ColorInput setHsl={addColor} />
			<div className="">
				{colors.map((color, index) => (
					<div key={index} className="color-section">
						<h2>{getClosestColorNameFromHSL(color.hsl)}</h2>
						<ShadeGenerator
							hsl={color.hsl}
							shades={color.shades || []}
							onShadesGenerated={(shades) => updateShades(index, shades)}
						/>
					</div>
				))}
			</div>
			<GenerateCode allColors={colors} />
			<button onClick={printColors}>PRINT COLORS</button>
		</div>
	);
}