"use client";

import Header from "@/app/Layout/Header";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Singup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (res.ok) {
            router.push("/auth/signin");
        } else {
            const data = await res.json();
            throw new Error(data.message || "Signup failed");
        }
    }

    return (
        <div>
            <Header />
            <form onSubmit={handleSignup}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                />
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {setConfirmPassword(e.target.value)}}
                />
                <button type="submit">Sign up</button>
            </form>
        </div>
    );
}