import React, { useState } from "react";

interface Shade {
    hue: number;
    saturation: number;
    lightness: number;
}

interface Color {
    name: string;
    hsl: [number, number, number];
    shades: Shade[];
}

interface GenerateCodeProps {
    allColors: Color[];
}

interface TailwindConfig {
    colors: Record<string, Record<number, string>>;
}

export default function GenerateCode({ allColors }: GenerateCodeProps) {
    const [code, setCode] = useState<TailwindConfig | undefined>(undefined);

    const generateTailwindConfig = () => {
        let colorsConfig: Record<string, Record<number, string>> = {};

        allColors.map((color) => {
            const shades: Record<number, string> = {};
            color.shades.map((shade, index) => {
                const scale = (index + 1) * 100;
                shades[scale] = `hsl(${shade.hue}, ${shade.saturation}%, ${shade.lightness}%)`;
            });

            colorsConfig[color.name] = shades;
        });

        return { colors: colorsConfig };
    }

    const handleClick = () => {
        const code = generateTailwindConfig();

        setCode(code);
        console.log(code);
    }

    return (
        <div>
            <h1>Generate code</h1>
            <button onClick={handleClick}>CLICK</button>
            {code && (
                <pre>
                    <code>
                        {JSON.stringify(code, null, 4)}
                    </code>
                </pre>
            )}
        </div>
    );
}