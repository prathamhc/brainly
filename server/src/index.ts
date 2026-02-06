import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import { UserModel } from "./db.js";
import { JWT_PASSWORD } from "./config.js";

const app = express();
app.use(express.json())
const signupSchema = z.object({
    username: z.string().min(3).max(10),
    password: z.string().min(8).max(20)
});

app.post("/api/v1/signup", async (req, res) => {
    try {
        const parsedInput = signupSchema.safeParse(req.body);

        if (!parsedInput.success) {
            res.status(411).json({ message: "Invalid input" });
            return;
        }

        const { username, password } = parsedInput.data;

        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            res.status(403).json({ message: "User already exists with this username" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            username: username,
            password: hashedPassword
        });

        res.status(200).json({
            message: "Done Signing up"
        })
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }

})
app.post("/api/v1/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(411).json({ message: "Invalid input" });
            return;
        }

        const existingUser = await UserModel.findOne({ username });

        if (!existingUser) {
            res.status(403).json({ message: "User doesn't exist" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password || "");

        if (!isPasswordValid) {
            res.status(403).json({ message: "Incorrect password" });
            return;
        }

        const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD);
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})
app.post("/api/v1/content", (req, res) => {

})
app.get("/api/v1/content", (req, res) => {

})
app.delete("/api/v1/content", (req, res) => {

})
app.post("/api/v1/brain/share", (req, res) => {

})
app.get("/api/v1/brain/:shareLink", (req, res) => {

})
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});