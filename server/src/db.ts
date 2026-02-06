import mongoose, { model, Schema } from "mongoose";
import { MONGO_URL } from "./config.js";

mongoose.connect(MONGO_URL);

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
})

export const UserModel = model("User", UserSchema); 