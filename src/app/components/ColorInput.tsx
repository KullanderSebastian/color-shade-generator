"use client";

import React, { useState } from "react";
import chroma from "chroma-js";

interface propsInterface {
    setHsl: (hsl: [number, number, number]) => void;
}

export default function ColorInput({ setHsl }: propsInterface) {
    const [color, setColor] = useState("");

    const getColor = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (chroma.valid(color)) {
            const temp = chroma(color).hsl() as [number, number, number];
            setHsl(temp);
            setColor("");
        } else {
            alert("Invalid color. Please enter a valid color name or HEX value.");
        }
    };

    return (
        <div>
            <h1>Welcome to the Shade Generator!</h1>
            <form onSubmit={getColor}>
                <input
                    name="color"
                    id="color"
                    placeholder="Enter color (e.g., red, #3498db)"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <button type="submit">Add Color</button>
            </form>
        </div>
    );
}