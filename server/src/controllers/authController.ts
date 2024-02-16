import { Request, Response } from "express";
import UserM, { IUser } from "../models/authModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IMovie } from "../models/movieModel";
import { ISerie } from "../models/serieModel";

// REUSEABLE
const genToken = (id: string): string => {
    return jwt.sign(
        { id },
        `${process.env.JWT_SECRET}`,
        { expiresIn: "24h" }
    );
}

// POST
export const register = async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        res.status(400).json({
            error: "Don't leave empty fields."
        });
        return;
    }

    const alreadyExists: { _id: string; } | null = await UserM.exists({ email });
    if (alreadyExists) {
        res.status(400).json({
            error: "Email already exists, sign in instead."
        });
        return;
    }

    try {
        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password, salt);

        const newUser: IUser = await UserM.create({
            fullName,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            token: genToken(newUser._id)
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "Registration Failed."
        });
        return;
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            error: "Don't leave empty fields."
        });
        return;
    }

    const user: IUser | null = await UserM.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            token: genToken(user._id)
        });
        return;
    }

    res.status(400).json({
        error: "Email or password incorrect."
    });
    return;
}