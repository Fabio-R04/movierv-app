import { config } from "dotenv";
config();
import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import mongoose from "mongoose";
// Import Routes
import authRoutes from "./routes/authRoutes";
import movieRoutes from "./routes/movieRoutes";
import serieRoutes from "./routes/serieRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import collectionRoutes from "./routes/collectionRoutes";
import peopleRoutes from "./routes/peopleRoutes";

const app: Application = express();
const clientURL: string = `${process.env.CLIENT_URL}`;
const corsOptions: CorsOptions = {
    origin: clientURL,
    credentials: true
}

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Routes Middleware
app.use("/auth", authRoutes);
app.use("/movie", movieRoutes);
app.use("/serie", serieRoutes);
app.use("/review", reviewRoutes);
app.use("/collection", collectionRoutes);
app.use("/people", peopleRoutes);

// Database Connection
const port: number = Number(process.env.PORT);
const uri: string = `${process.env.MONGO_URI}`;

(async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected");

        app.listen(port, () => {
            console.log(`Server listening on port: ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
})();