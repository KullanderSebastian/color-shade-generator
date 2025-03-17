import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from "bcrypt";
import User from '../../../src/app/models/UserSchema';
import connectToDatabase from '@/app/lib/mongodb';
import clientPromise from '@/app/lib/mongodbAdapter';
import dotenv from "dotenv";

dotenv.config();

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                await connectToDatabase();
                const user = await User.findOne({ email: credentials?.email });

                if (user && user.password) {
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (isValid) {
                        return { id: user._id.toString(), email: user.email };
                    }
                }
                return null;
            },
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                await connectToDatabase();

                const existingUser = await User.findOne({ email: user.email });
                
                if (!existingUser) {
                    await new User({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        googleId: account.providerAccountId,
                    }).save();
                }
            }
            return true;
        },
        async session({ session, token }) {
            const user = await User.findById(token.sub);
            if (user) {
                session.userId = user._id;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/auth/signin',
    },
};
export default NextAuth(authOptions);