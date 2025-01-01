"use client";

import React, { useState, useEffect} from "react";

interface hslInterface {
    hsl: [number, number, number];
}

interface Shade {
    hue: number;
    saturation: number;
    lightness: number;
}

export default function ShadeGenerator({ hsl }: hslInterface) {
    const [shades, setShades] = useState<Shade[]>([]);

    useEffect(() => {
        const generateShades = () => {
            let [ hue, saturation, lightness ] = hsl;
            hue = Math.round(hue);
            saturation = Math.round(saturation * 100);
            lightness = Math.round(lightness * 100);

            const shades: Shade[] = []
    
            for (let i = 0; i < 5; i++) {
                const adjustedLightness = Math.max(0, Math.min(100, lightness - i * 10));
                shades.push({hue, saturation, lightness: adjustedLightness})
            }

            for (let i = 1; i < 6; i++) {
                const adjustedLightness = Math.max(0, Math.min(100, lightness + i * 10));
                shades.push({hue, saturation, lightness: adjustedLightness})
            }
    
            console.log(shades);
            const sortedShades = shades.sort((a, b) => a.lightness - b.lightness);
            return sortedShades;
        }

        setShades(generateShades());
    }, [])
    
    return (
        <div className="flex">
            {shades.map((shade, index) => (
                <div key={index} className="w-[160px] h-[100px]" style={{ backgroundColor: `hsl(${shade.hue}, ${shade.saturation}%, ${shade.lightness}%)` }}>
                    <p className="text-center pt-[70px]">hsl({shade.hue}, {shade.saturation}%, {shade.lightness}%)</p>
                </div>
            ))}
        </div>
    );
}