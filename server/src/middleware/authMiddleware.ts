import { Request, Response, NextFunction } from "express";
import UserM from "../models/authModel";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader: string | undefined = req.headers.authorization;
    const token: string | null = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) {
        res.status(403).json({
            error: "Not Authorized"
        });
        return;
    }

    try {
        const { id } = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;
        req.user = await UserM.findById(id);
        next();
    } catch (error) {
        res.status(403).json({
            error: "Not Authorized"
        });
        return;
    }
}