import express, { Express } from "express";
import dotenv from "dotenv";
import { connectToDB } from "./utils/mongooseCruds";
import { errorHandler, notFound } from "./middlewares/errorHandling";


// Use dotenv package to use envirenment variable
dotenv.config();

const app: Express = express();// Create Object instance from express
const PORT = process.env.PORT || 4000;// Get PRT from .env file


// Express built-in middleware for parsing JSON
app.use(express.json());

// Database URL
const databaseURL:string = `${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
connectToDB(databaseURL);// Connect to "SpaiderEstate" Database

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start listening
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));