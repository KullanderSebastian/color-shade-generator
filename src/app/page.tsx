"use client";

import React, { useState } from "react";
import Header from "./Layout/Header";
import ColorInput from "./components/ColorInput";
import ShadeGenerator from "./components/ShadeGenerator";
import chroma from "chroma-js";
import colorName from "color-name";

interface Color {
	hsl: [number, number, number];
}

const namedColors = Object.entries(colorName).reduce((acc: Record<string, string>, [name, rgb]) => {
	acc[name] = chroma(rgb).hex(); // Convert RGB to HEX
    return acc;
}, {});

export default function Home() {
	const [colors, setColors] = useState<Color[]>([]);

	const addColor = (newHsl: [number, number, number]) => {
		setColors([...colors, { hsl: newHsl }]);
	};

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

	return (
		<div>
			<Header />
			<h1>Hello Home</h1>
			<ColorInput setHsl={addColor} />
			<div className="">
                {colors.map((color, index) => (
                    <div key={index} className="color-section">
                        <h2>{getClosestColorNameFromHSL(color.hsl)}</h2>
                        <ShadeGenerator hsl={color.hsl} />
                    </div>
                ))}
            </div>
		</div>
	);
}
