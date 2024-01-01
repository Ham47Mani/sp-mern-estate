import express, { Express } from "express";
import dotenv from "dotenv";
import { connectToDB } from "./utils/mongooseCruds";
import { errorHandler, notFound } from "./middlewares/errorHandling";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route";


// Use dotenv package to use envirenment variable
dotenv.config();

const app: Express = express();// Create Object instance from express
const PORT = process.env.PORT || 4000;// Get PRT from .env file

app.use(express.json());// Express built-in middleware for parsing JSON
app.use(cookieParser());// Get info from cookie

const corsOptions: CorsOptions = {
  origin: 'http://localhost:3000', // Allow only requests from this origin
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
// Enable CORS for a specific origin
app.use(cors(corsOptions));

// Database URL
const databaseURL:string = `${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
connectToDB(databaseURL);// Connect to "SpaiderEstate" Database

// Routes
app.use("/api/users", userRouter);// User Routes
app.use("/api/auth", authRouter);// Auth Routes
app.use("/api/listings", listingRouter);// Listing Routes

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start listening
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));