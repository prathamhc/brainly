import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const userMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const header = req.headers["authorization"];

    if (!header) {
        return res.status(403).json({
            message: "Token missing"
        });
    }

    try {
        const decoded = jwt.verify(
            header,
            JWT_PASSWORD
        ) as { id: string };

        req.userId = decoded.id;

        next();

    } catch (err) {
        return res.status(403).json({
            message: "Unauthorized login attempt"
        });
    }
};