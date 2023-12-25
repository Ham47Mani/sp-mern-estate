import express, { Express } from "express";
import dotenv from "dotenv";


// Use dotenv package to use envirenment variable
dotenv.config();

const app: Express = express();// Create Object instance from express
const PORT = process.env.PORT || 4000;// Get PRT from .env file


// Express built-in middleware for parsing JSON
app.use(express.json());


// Start listening
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));