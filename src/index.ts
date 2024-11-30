import express, { Request } from "express";
import morgan from "morgan";
import cors from "cors";
import createError from "http-errors";
import dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./data-source";
import errorHandlerMiddleware from "./middlewares/errorHandler";

const app = express();

app.use(
  morgan("dev", {
    skip: (req: Request) => req.method === "OPTIONS",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", async (req, res, next) => {
  try {
    res.send(`Welcome to Library Case App!`);
  } catch (error) {
    next(error);
  }
});

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use(errorHandlerMiddleware);

AppDataSource.initialize()
  .then(() => console.log("Database connected succesfuly!"))
  .catch((err) => console.log("Error connecting to database! ", err));

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
