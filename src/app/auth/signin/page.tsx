"use client";

import React, { useState } from "react";
import { signIn } from 'next-auth/react';

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleCredentialsSignIn = async () => {
        const res = await signIn("credentials", {
            email,
            password
        });

        if (res?.error) {
            console.error("Login failed: ", res.error);
        } else {
            console.log("Login successful");
        }
    };

    return (
        <div>
            <h1>Sign In</h1>
            <button onClick={() => signIn('google')}>Sign in with Google</button>

            <div>
                <h2>Sign in with credentials</h2>
                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <button onClick={handleCredentialsSignIn}>Sign In</button>
            </div>
        </div>
    );
}