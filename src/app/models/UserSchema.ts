import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    googleId?: string;
}

const UserSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String , unique: true, required: true },
    password: { type: String },
    image: { type: String },
    googleId: { type: String },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);