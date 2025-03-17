import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/app/lib/mongodb";
import User from "../../../src/app/models/UserSchema";
import bcrypt from "bcrypt";

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        if (savedUser) {
            return res.status(201).json({ message: "User created", userId: savedUser._id });
        } else {
            return res.status(500).json({ message: "Failed to create user" });
        }
    } catch (error) {
        console.error("Error during signup: ", error);
        res.status(500).json({ message: "Internal server errror" });
    }
}